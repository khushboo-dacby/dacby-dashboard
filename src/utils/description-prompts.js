export function getCdDescriptionPrompt(productTitle, category, condition) {
  return `
Find accurate information about this product.

Product Title: ${productTitle}
Category/Platform: ${category || "Unknown"}
Condition: ${condition || "Unknown"}
--------------------------------------------------
CONDITION RULES
--------------------------------------------------
The supplied condition must be respected.
If condition = "New":
- Description must clearly describe the product as New.
- Do not claim factory sealed, authentic, genuine, original, etc. unless explicitly provided.

If condition = "Pre Owned":
- Description must clearly describe the product as Pre Owned / Pre-Owned.
- Never describe it as New, brand new, sealed, unused, or unopened.
- Do not invent the physical condition of the disc or case.

If condition = "Pre Order":
- Description must clearly describe the product as Pre Order.
- Include the verified release date if available.
- Do not describe it as currently available or in stock.
- Do not invent delivery dates.

--------------------------------------------------
--------------------------------------------------
DESCRIPTION REQUIREMENTS
--------------------------------------------------

Generate an SEO-friendly ecommerce description suitable for DACBY.

The "summary" MUST be approximately 400 words in total and MUST contain EXACTLY TWO PARAGRAPHS.

Do NOT create:
- More than two paragraphs
- Less than two paragraphs
- Bullet points
- Numbered lists
- Headings
- Separate feature sections inside the summary

The summary must follow the exact structure and writing pattern below.

Adapt ONLY the following placeholders using verified product information:
- [Product Title]
- [Platform]
- [Condition]
- [Publisher]
- [Genre]
- [Setting]
- [Story]
- [Gameplay Details]
- [Verified Features]
- [Franchise]
- Other specific verified game details

Do not copy the example literally when the information does not apply to the researched product.

==================================================
NEW / PRE ORDER DESCRIPTION STRUCTURE
==================================================

For New or Pre Order products, follow this structure:

PARAGRAPH 1:

Start with:

"Looking for the best price on a brand new copy of [Product Title] for [Platform]? Buy [Product Title] [Platform] New Game CD online in India from DACBY..."

Continue naturally by introducing the exact product.

Mention:
- Product Title
- Platform
- Condition
- Publisher
- Genre
- Setting
- Story premise
- Main characters when relevant
- Important gameplay mechanics
- Exploration
- Combat
- Missions
- Open-world elements
- Multiplayer or single-player information when verified
- Other important product-specific details

Naturally include relevant SEO keywords such as:
- [Product Title] [Platform]
- [Platform] game CD
- [Platform] game disc
- New [Platform] game
- [Genre]
- Relevant franchise keywords

Do NOT keyword stuff.

End the first paragraph by naturally describing what the product offers on the specified platform.

Do not insert bullet points.

==================================================
PARAGRAPH 2:
==================================================

Start with a natural customer-oriented sentence similar in structure to:

"When you choose to buy a new [Product Title] [Platform] game disc online at DACBY..."

Continue with relevant DACBY purchasing information and product-focused SEO content.

For New products, the paragraph may include the following DACBY business claims ONLY because they are explicitly defined by this prompt:

- 100% genuine
- Factory sealed
- Sourced through trusted channels
- Secure payment options
- Competitive pricing
- Reliable customer support
- Fast shipping

Naturally explain why the product may be relevant to:
- Fans of the franchise
- Fans of the genre
- Open-world gaming enthusiasts
- Collectors
- Players looking for new [Platform] releases

End naturally with relevant product and category keywords.

==================================================
PRE OWNED DESCRIPTION STRUCTURE
==================================================

For Pre Owned products, follow this structure:

PARAGRAPH 1:

Start with:

"Looking for the best price on a high quality pre-owned copy of [Product Title] for [Platform]? Buy [Product Title] [Platform] pre-owned game CD online from DACBY..."

Continue naturally by introducing the exact product.

Mention:
- Product Title
- Platform
- Pre Owned condition
- Publisher
- Genre
- Setting
- Story premise
- Main characters when relevant
- Gameplay mechanics
- Combat
- Exploration
- Missions
- Open-world elements
- Multiplayer or single-player information when verified
- Other important product-specific details

Naturally include relevant SEO keywords such as:
- [Product Title] [Platform]
- Pre Owned [Platform] game
- Pre-owned game CD
- Used [Platform] game
- [Platform] game disc
- Relevant franchise keywords

Do NOT keyword stuff.

Do not describe the product as:
- New
- Brand new
- Factory sealed
- Unused
- Unopened

Do not invent the physical condition of the disc, case, cover, or accessories.

End the first paragraph by naturally describing the gaming experience offered by the product.

Do not insert bullet points.

==================================================
PARAGRAPH 2:
==================================================

Start with a natural customer-oriented sentence similar in structure to:

"When you choose to buy a pre-owned [Product Title] [Platform] game CD online at DACBY..."

Continue with relevant DACBY purchasing information and product-focused SEO content.

For Pre Owned products, the paragraph may include the following DACBY business claims ONLY because they are explicitly defined by this prompt:

- Thoroughly inspected
- Professionally tested for functionality
- Cleaned
- Verified for authenticity
- Carefully checked for working condition
- Competitive pricing
- Secure payment options
- Fast shipping
- Reliable customer support
- Seamless online shopping experience

Naturally explain why the product may be relevant to:
- Fans of the franchise
- Fans of the genre
- Players looking for used games
- Collectors
- Customers looking for affordable [Platform] games

End naturally with relevant product and category keywords.

==================================================
WORD COUNT
==================================================

The complete "summary" must be approximately 400 words.

Target:
- Minimum: 350 words
- Ideal: 380–420 words
- Maximum: 450 words

The summary MUST contain exactly TWO paragraphs.

Each paragraph should be approximately 175–210 words.

Do not sacrifice factual accuracy just to reach the word count.

If verified product information is limited, write a shorter accurate description rather than inventing information.

==================================================
IMPORTANT
==================================================

The [Product Title], [Platform], [Condition], [Publisher], and game-specific information MUST come from the input and verified Google Search research.

Do not blindly copy the example text.

The example defines the WRITING STRUCTURE, not fixed product facts.

--------------------------------------------------
FIELD RULES
--------------------------------------------------
Packaging: If condition is "New" or "Pre Order", return "Original Game Case". If condition is "Pre Owned", return "Pre-Owned Game Case".
Type: Return the verified physical media type, such as "Blu-ray Disc". Do not assume.
brand: Return the relevant verified brand. If unknown, return "".
genre: Return relevant genres as a concise comma-separated string.
language: Return verified supported language information. Do not assume English.
mode: Return verified modes such as Single-player, Multiplayer, Co-op, etc.
platform: Return the exact platform matching the product.
publisher: Return the verified publisher.
rating: Return the verified age/content rating. If unavailable, return "".
release_date: Return the verified release date in a human-readable format. If unavailable, return "".
release_year: Return the numeric release year. If unavailable, return null.

--------------------------------------------------
FEATURES FORMAT
--------------------------------------------------
The "features" field MUST be a SINGLE STRING.
Do NOT return an array.
Each feature must start with "- ".
Separate features using "\n".
Generate approximately 5–10 features when enough verified information exists.
Do not invent features just to reach 5–10.
--------------------------------------------------
OUTPUT FORMAT
--------------------------------------------------
Return ONLY valid JSON.
Do not use markdown formatting.
Return exactly this JSON structure:

{
  "description": {
    "summary": "",
    "Packaging": "",
    "Type": "",
    "brand": "",
    "genre": "",
    "language": "",
    "mode": "",
    "platform": "",
    "publisher": "",
    "rating": "",
    "release_date": "",
    "release_year": null,
    "features": ""
  }
}
`;
}



export function getDefaultDescriptionPrompt(productTitle, category, condition) {
  return `
Find accurate information about this product.

Product Title: ${productTitle}
Category/Platform: ${category || "Unknown"}
Condition: ${condition || "Unknown"}

Return the important product information in JSON format with exactly this structure:
Return ONLY valid JSON. Do not use markdown formatting.

{
  "description": {
    "summary": "",
    "Packaging": "",
    "Type": "",
    "brand": "",
    "genre": "",
    "language": "",
    "mode": "",
    "platform": "",
    "publisher": "",
    "rating": "",
    "release_date": "",
    "release_year": null,
    "features": ""
  }
}
`;
}
