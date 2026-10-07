// import { GoogleGenAI } from "@google/genai";
// import { getCdDescriptionPrompt } from "@/utils/description-prompts";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export async function POST(request) {
//   try {
//     const { productTitle, category, condition, promptType } = await request.json();

//     if (!productTitle) {
//       return Response.json(
//         { error: "Product title is required" },
//         { status: 400 }
//       );
//     }

//     let prompt = "";
//     if (promptType === "cd") {
//       prompt = getCdDescriptionPrompt(productTitle, category, condition);
//     } else {
//       prompt = `Find accurate information about this product using Google Search:
// Product Title: ${productTitle}
// Category/Platform: ${category || "Unknown"}
// Condition: ${condition || "Unknown"}

// Return the important product information in JSON format with exactly this structure:
// {
//   "description": {
//     "summary": "...",
//     "Packaging": "...",
//     "Type": "...",
//     "brand": "...",
//     "genre": "...",
//     "language": "...",
//     "mode": "...",
//     "platform": "...",
//     "publisher": "...",
//     "rating": "...",
//     "release_date": "...",
//     "release_year": null,
//     "features": "..."
//   }
// }`;
//     }

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//       config: {
//         tools: [{ googleSearch: {} }],
//         // responseMimeType: "application/json",
//         responseSchema: {
//           type: "OBJECT",
//           properties: {
//             description: {
//               type: "OBJECT",
//               properties: {
//                 summary: { type: "STRING" },
//                 Packaging: { type: "STRING" },
//                 Type: { type: "STRING" },
//                 brand: { type: "STRING" },
//                 genre: { type: "STRING" },
//                 language: { type: "STRING" },
//                 mode: { type: "STRING" },
//                 platform: { type: "STRING" },
//                 publisher: { type: "STRING" },
//                 rating: { type: "STRING" },
//                 release_date: { type: "STRING" },
//                 release_year: { type: "INTEGER", nullable: true },
//                 features: { type: "STRING" }
//               },
//               required: [
//                 "summary", "Packaging", "Type", "brand", "genre", 
//                 "language", "mode", "platform", "publisher", 
//                 "rating", "release_date", "release_year", "features"
//               ]
//             }
//           },
//           required: ["description"]
//         }
//       },
//     });
//      const text=response.text.trim();
//     let resultData;
//     try {
//         console.log("error response of gemini ",text);
//     //   resultData = JSON.parse(response.text);
//     resultData = text;
//     } catch (parseError) {
//       console.error("Failed to parse Gemini JSON:", response.text);
//       throw new Error("Gemini returned invalid JSON");
//     }

//     return Response.json({
//       success: true,
//       result: resultData,
//     });
//   } catch (error) {
//     console.error("Gemini API error:", error);

//     return Response.json(
//       { error: error.message || "Failed to generate product information" },
//       { status: 500 }
//     );
//   }
// }
import { Ollama } from "ollama";
import { getCdDescriptionPrompt, getDefaultDescriptionPrompt } from "@/utils/description-prompts";

const ollama = new Ollama({
  host: "http://localhost:11434",
});

export async function POST(request) {
  try {
    const {
      productTitle,
      category,
      condition,
      promptType,
    } = await request.json();

    if (!productTitle) {
      return Response.json(
        { error: "Product title is required" },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 1. CREATE PROMPT
    // -----------------------------------------

    let prompt = "";

    if (promptType === "cd") {
      prompt = getCdDescriptionPrompt(productTitle, category, condition);
    } else {
      prompt = getDefaultDescriptionPrompt(productTitle, category, condition);
    }

    // -----------------------------------------
    // 2. WEB SEARCH
    // -----------------------------------------

    const searchQuery = `"${productTitle}" ${
      category || ""
    } ${condition || ""}`;

    console.log("Ollama Web Search:", searchQuery);

    const searchResults = await ollama.webSearch({
      query: searchQuery,
      maxResults: 2,
    });
 console.log("search resutls ",searchResults);
    // -----------------------------------------
    // 3. PREPARE RESEARCH
    // -----------------------------------------

    const research = (searchResults.results || [])
      .map(
        (result, index) => `
SOURCE ${index + 1}

Title:
${result.title || ""}

URL:
${result.url || ""}

Content:
${(result.content || result.snippet || "").substring(0, 800)}...
`
      )
      .join("\n\n");

    console.log("Web research received");

    // -----------------------------------------
    // 4. FINAL PROMPT
    // -----------------------------------------

    const finalPrompt = `
====================
WEB RESEARCH
====================

Use the following web research to complete the task below. Do not hallucinate facts.

${research}

====================
TASK INSTRUCTIONS
====================

${prompt}
`;
    // -----------------------------------------
    // 5. GENERATE USING LOCAL OLLAMA
    // -----------------------------------------

    console.log("Generating product data with Ollama...");

    const response = await ollama.chat({
      model: "qwen2.5:7b",
      format: "json",
      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      stream: false,
    });

    // -----------------------------------------
    // 6. GET RESPONSE
    // -----------------------------------------

    let text = response.message.content.trim();

    console.log("Ollama raw response:", text);

    // Remove Markdown code fences if model adds them
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // -----------------------------------------
    // 7. PARSE JSON
    // -----------------------------------------

    let resultData;

    try {
      resultData = JSON.parse(text);
    } catch (parseError) {
      console.error("Invalid JSON from Ollama:", text);

      return Response.json(
        {
          error: "Ollama returned invalid JSON",
          raw: text,
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 8. RETURN RESULT
    // -----------------------------------------

    return Response.json({
      success: true,
      result: resultData,
    });
  } catch (error) {
    console.error("Ollama API error:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "Failed to generate product information",
      },
      { status: 500 }
    );
  }
}