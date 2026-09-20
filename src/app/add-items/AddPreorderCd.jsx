"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Copy, RotateCcw, X, Plus, Star, StarOff, Trash2, Eye } from "lucide-react";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { toast } from "sonner";
import { addProductToInventory } from "@/app/apis/api";
import DeletePop from "@/components/confirmation-modal/DeletePop";
import ImagePreview from "@/components/inventory/ImagePreview";
import DescriptionEditor, {
  convertDescriptionObjectToFormState,
  serializeDescriptionState,
} from "@/components/inventory/DescriptionEditor";
import useDescriptionState from "@/hooks/useDescriptionState";

const PS5_DESCRIPTION_TEMPLATE = {
  Packaging: "Pre-Owned Game Case",
  Type: "Blu-ray Disc",
  Global_Attributes: {
    brand: "Bandai Namco Entertainment",
    genre: "Puzzle, Platformer, Horror, Adventure",
    language: "English",
    mode: "Single-player, Online Co-op",
    platform: "PlayStation 5",
    publisher: "Bandai Namco Entertainment",
    rating: "Teen",
    release_date: "10th October 2025",
    release_year: 2025,
  },
  Gameplay: {
    skills: 9,
    features: [
      "Play as Low and Alone, two children trapped within the mysterious Spiral.",
      "Experience a dark atmospheric adventure filled with suspense and tension.",
      "Solve environmental puzzles using unique tools and abilities.",
      "Navigate dangerous locations filled with disturbing creatures and hidden threats.",
      "Work together in online co-op or play solo with AI companion support.",
      "Explore richly detailed environments inspired by childhood fears and nightmares.",
      "Use teamwork, timing, and problem-solving skills to overcome obstacles.",
      "Enjoy enhanced visuals, immersive audio, and smooth performance on PlayStation 5.",
      "Uncover secrets of the Spiral and survive a haunting journey through a terrifying world.",
    ],
  },
  "summary": "Looking for the best price on a high quality pre-owned copy of Invincible VS for PlayStation 5? Buy Invincible VS PS5 pre-owned game CD online from DACBY, your trusted destination for genuine used PlayStation 5 games, original PS5 Blu-ray discs, second hand PlayStation 5 games, refurbished gaming products, and affordable console games. Published by Skybound Games, Invincible VS is an explosive 3 vs 3 tag team fighting game set in the acclaimed Invincible universe, bringing together iconic heroes and villains from the popular comic series and animated show. Build your ultimate team, execute devastating combos, unleash cinematic Super Moves, experience an original story, and battle across exciting game modes with fast paced competitive gameplay. Fully compatible with PlayStation 5, Invincible VS delivers stunning visuals, responsive controls, immersive audio, smooth performance, and an action packed superhero fighting experience for both casual players and competitive fighting game fans.\n\nWhether you are looking to buy Invincible VS PS5 online, expand your PlayStation 5 game collection, or enjoy an affordable superhero fighting game, this title offers exceptional replay value through online multiplayer, strategic tag team combat, advanced combo mechanics, and intense competitive matches. Perfect for collectors, fans of the Invincible franchise, comic book enthusiasts, and players who enjoy competitive fighting games, Invincible VS combines accessible gameplay with deep combat systems that reward skill, teamwork, timing, and strategy. A pre-owned Invincible VS PS5 game disc lets you experience premium PlayStation 5 gaming at a great value while owning an original physical Blu-ray disc.\n\nWhen you choose to buy a pre-owned Invincible VS PS5 game CD online at DACBY, you can shop with complete confidence and peace of mind. Every pre-owned PlayStation 5 game sold through DACBY is thoroughly inspected, professionally tested for functionality, cleaned, verified for authenticity, and carefully checked to ensure it is in excellent working condition before being listed for sale. DACBY offers competitive pricing, secure payment options, fast shipping, reliable customer support, and a seamless online shopping experience. Whether you are searching for used PS5 game CDs, second hand PlayStation 5 games, genuine Invincible VS PS5 Blu-ray discs, affordable PS5 fighting games, original PlayStation game discs, or trusted pre-owned gaming products, DACBY is your reliable destination for premium quality gaming products at exceptional value."
};

const PS5_DESCRIPTION_JSON = JSON.stringify(PS5_DESCRIPTION_TEMPLATE, null, 2);

const PS4_DESCRIPTION_TEMPLATE = {
  ...PS5_DESCRIPTION_TEMPLATE,
  Global_Attributes: {
    ...PS5_DESCRIPTION_TEMPLATE.Global_Attributes,
    platform: "PlayStation 4",
  },
  Gameplay: {
    ...PS5_DESCRIPTION_TEMPLATE.Gameplay,
    features: [
      "Play as Low and Alone, two children trapped within the mysterious Spiral.",
      "Experience a dark atmospheric adventure filled with suspense and tension.",
      "Solve environmental puzzles using unique tools and abilities.",
      "Navigate dangerous locations filled with disturbing creatures and hidden threats.",
      "Work together in online co-op or play solo with AI companion support.",
      "Explore richly detailed environments inspired by childhood fears and nightmares.",
      "Use teamwork, timing, and problem-solving skills to overcome obstacles.",
      "Enjoy immersive visuals, atmospheric sound design, and smooth gameplay on PlayStation 4.",
      "Uncover secrets of the Spiral and survive a haunting journey through a terrifying world.",
    ],
  },
  "summary": "Looking for the best price on a high quality pre-owned copy of Invincible VS for PlayStation 4? Buy Invincible VS PS4 pre-owned game CD online from DACBY, your trusted destination for genuine used PlayStation 4 games, original PS4 Blu-ray discs, second hand PlayStation 4 games, refurbished gaming products, and affordable console games. Published by Skybound Games, Invincible VS is an explosive 3 vs 3 tag team fighting game set in the acclaimed Invincible universe, bringing together iconic heroes and villains from the popular comic series and animated show. Build your ultimate team, execute devastating combos, unleash cinematic Super Moves, experience an original story, and battle across exciting game modes with fast paced competitive gameplay. Fully compatible with PlayStation 4, Invincible VS delivers stunning visuals, responsive controls, immersive audio, smooth performance, and an action packed superhero fighting experience for both casual players and competitive fighting game fans.\n\nWhether you are looking to buy Invincible VS PS4 online, expand your PlayStation 4 game collection, or enjoy an affordable superhero fighting game, this title offers exceptional replay value through online multiplayer, strategic tag team combat, advanced combo mechanics, and intense competitive matches. Perfect for collectors, fans of the Invincible franchise, comic book enthusiasts, and players who enjoy competitive fighting games, Invincible VS combines accessible gameplay with deep combat systems that reward skill, teamwork, timing, and strategy. A pre-owned Invincible VS PS4 game disc lets you experience premium PlayStation 4 gaming at a great value while owning an original physical Blu-ray disc.\n\nWhen you choose to buy a pre-owned Invincible VS PS4 game CD online at DACBY, you can shop with complete confidence and peace of mind. Every pre-owned PlayStation 4 game sold through DACBY is thoroughly inspected, professionally tested for functionality, cleaned, verified for authenticity, and carefully checked to ensure it is in excellent working condition before being listed for sale. DACBY offers competitive pricing, secure payment options, fast shipping, reliable customer support, and a seamless online shopping experience. Whether you are searching for used PS4 game CDs, second hand PlayStation 4 games, genuine Invincible VS PS4 Blu-ray discs, affordable PS4 fighting games, original PlayStation game discs, or trusted pre-owned gaming products, DACBY is your reliable destination for premium quality gaming products at exceptional value."

};

const PS4_DESCRIPTION_JSON = JSON.stringify(PS4_DESCRIPTION_TEMPLATE, null, 2);

const PREORDER_DESCRIPTION_TEMPLATE = {
  summary:
    "Short Description:\nPre-order Hell Let Loose Vietnam for PlayStation 5 and experience large-scale tactical warfare set during the Vietnam War. Fight across dense jungles, rural villages, military bases, and battle-scarred landscapes in intense 50 vs 50 multiplayer battles that demand teamwork, communication, and strategy. Reserve your copy today from DACBY and secure your place on the battlefield before launch.\n\nFull Product Description:\nHell Let Loose Vietnam brings the award-winning tactical first-person shooter franchise to a brand-new setting inspired by the Vietnam War. Built for PlayStation 5, this next-generation military shooter delivers authentic large-scale combat where teamwork, communication, and strategic coordination determine victory. Engage in intense 50 vs 50 battles across expansive maps featuring dense jungles, river systems, military compounds, villages, and war-torn environments designed to recreate the challenges of Vietnam-era warfare.\n\nPlayers can choose from multiple military roles including infantry, officer, machine gunner, medic, engineer, scout, tank crew, and commander, each contributing to the success of their team. Coordinate attacks, establish defensive positions, manage resources, deploy vehicles, and work alongside your squad to capture objectives and control the battlefield. Realistic weapon handling, immersive audio design, dynamic environments, and strategic gameplay combine to create a deeply authentic combat experience.\n\nOptimized for PlayStation 5, Hell Let Loose Vietnam features enhanced visuals, improved environmental detail, immersive 3D audio, fast loading times, smooth performance, and support for large-scale multiplayer battles. Whether advancing through dense jungle terrain, defending critical objectives, or coordinating large military operations, every battle offers a unique and intense tactical experience.\n\nPre-order Hell Let Loose Vietnam PS5 online from DACBY and secure your copy before launch. DACBY offers genuine PlayStation 5 games, authentic pre-order titles, competitive prices, secure online payments, trusted customer support, quality assurance, and fast delivery across India. Shop the latest PS5 games, upcoming military shooters, tactical multiplayer titles, and the best PlayStation 5 pre-orders only at DACBY, your trusted destination for gaming products in India.\n\nImportant Note:\nThis is a pre-order product. Release date, packaging details, bonus content, and final game specifications are subject to confirmation by the publisher. Physical units will be dispatched according to publisher availability and official launch schedules.",
  Global_Attributes: {
    Packaging: "Original Sealed Retail Box",
    Type: "Blu-ray Disc",
    Brand: "Team17",
    Franchise: "Hell Let Loose",
    Edition: "Standard Edition",
    Genre: "First-Person Shooter, Tactical Shooter, Military Simulation",
    Language: "English (Additional Languages Supported)",
    Mode: "Online Multiplayer",
    Platform: "PlayStation 5",
    Publisher: "Team17",
    Rating: "teen",
    Release_Date: "13th August",
    Release_Year: 2026,
  },
};

const PREORDER_DESCRIPTION_JSON = JSON.stringify(
  PREORDER_DESCRIPTION_TEMPLATE,
  null,
  2
);

function createDescriptionPrompt(productTitle, platform, exampleJson) {
  const title = productTitle.trim() || "[PRODUCT TITLE]";

  return `Use this JSON as the pattern:

${exampleJson}

Generate the same pattern description for title "${title}" as a pre-owned ${platform} game CD sold on the DACBY website.

Requirements:
1. Replace all example-game information with accurate information for "${title}".
2. Keep the exact JSON structure and return only valid JSON.
3. Include exactly 9 relevant gameplay features.
4. Write the summary in the same detailed two-paragraph pattern.
5. Separate summary paragraphs with \\n\\n.
6. Do not use em dashes.
7. Use natural SEO, GEO, and AEO keywords relevant to "${title}", pre-owned ${platform} game CDs, and the DACBY website.
8. Include useful purchase-intent phrases naturally, without keyword stuffing.
9. Mention DACBY product inspection, authenticity, competitive pricing, secure payment, customer support, and shipping in the second paragraph.
10. Do not use Markdown or add text outside the JSON.`;
}

function createPreOrderDescriptionPrompt(productTitle, exampleJson) {
  const title = productTitle.trim() || "[PRODUCT TITLE]";

  return `Use this JSON as the pattern:

${exampleJson}

Generate the same pattern pre-order description for title "${title}" sold on the DACBY website.

Requirements:
1. Replace all example-product information with accurate information for "${title}".
2. Keep the exact JSON structure and return only valid JSON.
3. Preserve the Short Description, Full Product Description, and Important Note sections in the summary.
4. Separate summary paragraphs and sections with \\n\\n.
5. Do not use em dashes.
6. Use natural SEO, GEO, and AEO keywords relevant to "${title}", gaming pre-orders, buyers in India, and the DACBY website.
7. Include useful purchase-intent phrases naturally, without keyword stuffing.
8. Mention DACBY genuine products, competitive pricing, secure payment, customer support, quality assurance, and delivery across India.
9. Always include the official release date and official age rating for every game. For all preorder titles, the release date field is mandatory and must contain the officially announced release date. Use only verified information from official sources. Do not invent ratings, publishers, platforms, bonuses, specifications, or release dates. If an official rating has not yet been announced, use "Rating Pending".
10. Do not use Markdown or add text outside the JSON.`;
}

function makeSlug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatReleaseDate(value) {
  if (!value) return "";

  const [year, month, day] = value.split("-").map(Number);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const remainder = day % 100;
  const suffix =
    remainder >= 11 && remainder <= 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th";

  return `${day}${suffix} ${monthNames[month - 1]} ${year}`;
}

function convertImageToCdn(imageUrl) {
  const firebasePrefix =
    "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/";
  const cdnPrefix = "https://dacby-database.web.app/cdn/";
  const trimmedUrl = imageUrl.trim();

  if (!trimmedUrl.startsWith(firebasePrefix)) return trimmedUrl;

  return `${cdnPrefix}${trimmedUrl.slice(firebasePrefix.length)}`;
}

function getCategorySettings(code) {
  if (code === "D001Y") {
    return {
      specId: "ps5-cds",
      condition: "Pre Owned",
      heading: "Add Pre Owned Product",
      badge: "Pre Owned",
    };
  }

  if (code === "D002Y") {
    return {
      specId: "ps4-cds",
      condition: "Pre Owned",
      heading: "Add Pre Owned Product",
      badge: "Pre Owned",
    };
  }

  return {
    specId: "pre-order",
    condition: "Pre Order",
    heading: "Add Pre Order Product",
    badge: "Pre Order",
  };
}

function makeEmptyForm(availableForSell = true, defaultWeight = "") {
  return {
    productTitle: "",
    mrp: "",
    buyPrice: "",
    sellPrice: "",
    maxSellPrice: "",
    stocks: "",
    weight: defaultWeight,
    availableForSell,
    releaseDate: "",
    sku: "",
    vendorName: "Dacby Technologies Pvt. Ltd.",
    vendorNote: "",
    youtubeIframe: "",
    descriptionJson: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    images: [],
  };
}

function getYouTubeEmbedUrl(embedCode) {
  const value = String(embedCode || "").trim();
  const sourceMatch = value.match(/src=["']([^"']+)["']/i);
  const possibleUrl = sourceMatch?.[1] || value;

  try {
    const url = new URL(possibleUrl);
    const allowedHosts = [
      "youtube.com",
      "www.youtube.com",
      "youtube-nocookie.com",
      "www.youtube-nocookie.com",
    ];

    return url.protocol === "https:" && allowedHosts.includes(url.hostname)
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

export default function AddPreorderCd({ categoryName, code }) {
  const router = useRouter();
  const categorySettings = getCategorySettings(code);
  const isPs5Cd = code === "D001Y";
  const isPs4Cd = code === "D002Y";
  const isGameCd = isPs5Cd || isPs4Cd;
  const isPreOrder = code === "D003Y";
  const requiresDescription = isGameCd || isPreOrder;
  let descriptionTemplate = "";

  if (isPs5Cd) {
    descriptionTemplate = PS5_DESCRIPTION_JSON;
  }

  if (isPs4Cd) {
    descriptionTemplate = PS4_DESCRIPTION_JSON;
  }

  if (isPreOrder) {
    descriptionTemplate = PREORDER_DESCRIPTION_JSON;
  }
  const [isNewCondition, setIsNewCondition] = useState(false);
  const [formData, setFormData] = useState(
    makeEmptyForm(!isPreOrder, isGameCd ? 0.1 : ""),
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showSubmitPop, setShowSubmitPop] = useState(false);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl.trim()],
    }));
    setNewImageUrl("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleMakePrimary = (indexToPrimary) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const [movedImage] = newImages.splice(indexToPrimary, 1);
      newImages.unshift(movedImage);
      return { ...prev, images: newImages };
    });
  };
  const initialDescription = convertDescriptionObjectToFormState({});
  const {
    description: descriptionState,
    resetDescription,
    updateSummary,
    addDescriptionSection,
    removeDescriptionSection,
    renameDescriptionSection,
    finalizeDescriptionSection,
    addDescriptionField,
    updateDescriptionFieldKey,
    finalizeDescriptionFieldKey,
    updateDescriptionFieldValue,
    updateDescriptionFieldValueType,
    removeDescriptionField,
  } = useDescriptionState(initialDescription);
  const [descriptionError, setDescriptionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewPayload, setPreviewPayload] = useState(null);
  const youtubePreviewUrl = getYouTubeEmbedUrl(formData.youtubeIframe);

  function handleFormChange(field, value) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));
  }

  function getGeneratedSku(title, conditionIsNew) {
    const titleSlug = makeSlug(title);
    if (!titleSlug) return "";
    return conditionIsNew 
      ? `${titleSlug}-${categorySettings.specId}-new`
      : `${titleSlug}-${categorySettings.specId}`;
  }

  function handleProductTitleChange(value) {
    const generatedSku = getGeneratedSku(value, isNewCondition);

    setFormData((currentFormData) => ({
      ...currentFormData,
      productTitle: value,
      sku: generatedSku,
    }));
  }

  function handleConditionToggle(isNew) {
    setIsNewCondition(isNew);
    setFormData((currentFormData) => {
      let currentSku = currentFormData.sku || "";
      if (isNew) {
        if (!currentSku.endsWith("-new")) {
          currentSku = currentSku ? `${currentSku}-new` : getGeneratedSku(currentFormData.productTitle, isNew);
        }
      } else {
        if (currentSku.endsWith("-new")) {
          currentSku = currentSku.slice(0, -4);
        }
      }
      return { ...currentFormData, sku: currentSku };
    });
  }

  function handleReset() {
    setFormData(makeEmptyForm(!isPreOrder, isGameCd ? 0.1 : ""));
    resetDescription(initialDescription);
    setDescriptionError("");
    setIsSubmitting(false);
    setPreviewPayload(null);
  }

  async function handleCopyDescription() {
    const platform = isPs5Cd ? "PlayStation 5" : "PlayStation 4";
    const prompt = isPreOrder
      ? createPreOrderDescriptionPrompt(
          formData.productTitle,
          descriptionTemplate
        )
      : createDescriptionPrompt(
          formData.productTitle,
          platform,
          descriptionTemplate
        );

    try {
      await navigator.clipboard.writeText(prompt);
      alert("Description prompt copied.");
    } catch {
      alert("Could not copy the description prompt automatically.");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    let inventoryDescription;

    if (requiresDescription) {
      try {
        inventoryDescription = serializeDescriptionState(descriptionState);

        if (!inventoryDescription || Array.isArray(inventoryDescription)) {
          throw new Error("Description must be an object");
        }

        setDescriptionError("");
      } catch {
        setDescriptionError("Description must contain valid JSON.");
        return;
      }
    }

    const images = (formData.images || [])
      .map((imageUrl) => convertImageToCdn(imageUrl))
      .filter(Boolean);

    const mrp = Number(formData.mrp) || 0;
    const price = Number(formData.buyPrice) || 0;
    const sellPrice = Number(formData.sellPrice) || 0;
    const maxSellPrice = Number(formData.maxSellPrice) || 0;
    const stocks = Number(formData.stocks) || 0;
    const weight = Number(formData.weight) || 0;

    const payload = {
      spec_id: categorySettings.specId,
      inventory_doc: {
        spec_id: categorySettings.specId,
        product_title: formData.productTitle,
        code,
        category_name: categoryName,
        condition: isGameCd ? (isNewCondition ? "New" : "Pre Owned") : categorySettings.condition,
        mrp,
        price,
        sell: formData.availableForSell,
        sell_max_price: maxSellPrice,
        yt_iframe: formData.youtubeIframe,
        ...(requiresDescription ? { description: inventoryDescription } : {}),
        ...(isPreOrder
          ? { release_date: formatReleaseDate(formData.releaseDate) }
          : {}),
        vendors: {
          VENDOR_001: {
            vendor_id: "yyyyyyyyyyyyyyyyyyyyyyyyyyyy",
            name: formData.vendorName,
            ratings: 0,
            total_sales: 0,
            vendor_note: formData.vendorNote,
            combination_offered: {
              combination_1: {
                item_1: {
                  sku: formData.sku,
                  mrp,
                  price,
                  sell: formData.availableForSell,
                  sell_price: sellPrice,
                  weight,
                  rating: 4.5,
                  rating_count: 120,
                  stocks,
                  images,
                },
              },
            },
          },
        },
        in_stock: stocks > 0,
      },
    };

    console.log("Generated product payload:", payload);
    setPreviewPayload(payload);
    setShowSubmitPop(true);
  }

  async function handleFinalSubmit() {
    if (!previewPayload) return;

    try {
      setIsSubmitting(true);
      await addProductToInventory(previewPayload);
      toast.success("Product added successfully!");
      setShowSubmitPop(false);
      router.push("/");
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add product";
      toast.error(errorMessage);
      setShowSubmitPop(false);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-4 md:px-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Add New Product</h1>
          <p className="mt-1 text-slate-500">
            Fill in product details for {categoryName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer text-slate-500 hover:text-slate-900"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl space-y-7 px-6 py-8 md:px-10"
      >
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-950 to-indigo-700 px-7 py-6 text-white">
          <div>
            <h2 className="text-2xl font-bold">
              {isGameCd ? (isNewCondition ? "Add New Product" : "Add Pre Owned Product") : categorySettings.heading}
            </h2>
            <p className="mt-2 text-indigo-200">
              Category: {categoryName} · Code: {code}
            </p>
          </div>
          {isGameCd ? (
            <div className="flex items-center gap-1 rounded-full bg-white/20 p-1">
              <button
                type="button"
                onClick={() => handleConditionToggle(true)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  isNewCondition ? "bg-white text-indigo-900 shadow" : "text-white hover:bg-white/10"
                }`}
              >
                New
              </button>
              <button
                type="button"
                onClick={() => handleConditionToggle(false)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  !isNewCondition ? "bg-white text-indigo-900 shadow" : "text-white hover:bg-white/10"
                }`}
              >
                Pre Owned
              </button>
            </div>
          ) : (
            <span className="rounded-full bg-white/20 px-5 py-2 font-semibold">
              {categorySettings.badge}
            </span>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            label="Product Title *"
            value={formData.productTitle}
            placeholder="Enter product title"
            required
            onChange={handleProductTitleChange}
          />
          <FormField
            label="MRP (₹) *"
            type="number"
            value={formData.mrp}
            placeholder="Enter MRP"
            required
            onChange={(value) => handleFormChange("mrp", value)}
          />
          <FormField
            label="Buy Price (₹) *"
            type="number"
            value={formData.buyPrice}
            placeholder="Enter buy price"
            required
            onChange={(value) => handleFormChange("buyPrice", value)}
          />
          <FormField
            label="Sell Price (₹) *"
            type="number"
            value={formData.sellPrice}
            placeholder="Enter sell price"
            required
            onChange={(value) => handleFormChange("sellPrice", value)}
          />
          <FormField
            label="Max Sell Price (₹) *"
            type="number"
            value={formData.maxSellPrice}
            placeholder="Enter max sell price"
            required
            onChange={(value) => handleFormChange("maxSellPrice", value)}
          />
          <FormField
            label="Stock Quantity *"
            type="number"
            value={formData.stocks}
            placeholder="Enter stock quantity"
            required
            onChange={(value) => handleFormChange("stocks", value)}
          />
          <FormField
            label="Weight (kg) *"
            type="number"
            value={formData.weight}
            placeholder="Enter weight"
            required
            onChange={(value) => handleFormChange("weight", value)}
          />
          <FormField
            label="Condition"
            value={categorySettings.condition}
            readOnly
          />
          <SellToggle
            value={formData.availableForSell}
            onChange={(value) => handleFormChange("availableForSell", value)}
          />

          {isPreOrder && (
            <FormField
              label="Release Date *"
              type="date"
              value={formData.releaseDate}
              required
              onChange={(value) => handleFormChange("releaseDate", value)}
            />
          )}

          <FormField
            label="Spec ID"
            value={categorySettings.specId}
            readOnly
          />
          <FormField
            label="SKU"
            value={formData.sku}
            placeholder="Generated from product title"
            onChange={(value) => handleFormChange("sku", value)}
          />
          <FormField
            label="Vendor Name"
            value={formData.vendorName}
            onChange={(value) => handleFormChange("vendorName", value)}
          />
        </div>

        {requiresDescription && (
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                {/* <p className="font-semibold">Description *</p> */}
                {/* {!isGameCd && (
                  <p className="mt-1 text-sm text-slate-500">
                    Use Form Mode or JSON Mode. Preview description before submitting.
                  </p>
                )} */}
              </div>
              {/* {!isGameCd && (
                <button
                  type="button"
                  onClick={handleCopyDescription}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  <Copy className="h-4 w-4" /> Copy Prompt for Description
                </button>
              )} */}
            </div>
            <DescriptionEditor
              description={descriptionState}
              updateSummary={updateSummary}
              addDescriptionSection={addDescriptionSection}
              removeDescriptionSection={removeDescriptionSection}
              renameDescriptionSection={renameDescriptionSection}
              finalizeDescriptionSection={finalizeDescriptionSection}
              addDescriptionField={addDescriptionField}
              updateDescriptionFieldKey={updateDescriptionFieldKey}
              finalizeDescriptionFieldKey={finalizeDescriptionFieldKey}
              updateDescriptionFieldValue={updateDescriptionFieldValue}
              updateDescriptionFieldValueType={updateDescriptionFieldValueType}
              removeDescriptionField={removeDescriptionField}
              resetDescription={resetDescription}
            />
            {descriptionError && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {descriptionError}
              </p>
            )}
          </div>
        )}

        <section>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Variant Images
          </h3>

          <div className="mb-6 flex gap-3">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL to add..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700"
            />
            <button
              type="button"
              onClick={handleAddImage}
              disabled={!newImageUrl.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add Image
            </button>
          </div>

          {(formData.images || []).length > 0 ? (
            <PhotoProvider>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {(formData.images || []).map((rawUrl, idx) => {
                  const url = typeof rawUrl === 'string' ? rawUrl.trim() : "";
                  if (!url) return null;

                  const optimizedUrl = `/_next/image?url=${encodeURIComponent(url)}&w=3840&q=75`;

                  return (
                    <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <PhotoView key={idx} src={optimizedUrl}>
                        <div className="h-full w-full cursor-pointer relative">
                          <Image
                            src={url}
                            alt={`Variant Image ${idx + 1}`}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      </PhotoView>
                      <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                        <div className="flex justify-between pointer-events-auto">
                          {idx === 0 ? (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow">
                              <Star className="h-3 w-3 fill-white" /> Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleMakePrimary(idx); }}
                              className="rounded bg-black/50 p-1.5 text-white transition hover:bg-black"
                              title="Set as primary"
                            >
                              <StarOff className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                            className="rounded bg-rose-500 p-1.5 text-white transition hover:bg-rose-600"
                            title="Delete image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <Eye className="h-8 w-8 text-white/70 drop-shadow-md" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </PhotoProvider>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
              <p className="text-sm text-slate-500">No images provided.</p>
            </div>
          )}
        </section>

        <div>
          <label className="mb-2 block font-semibold">Vendor Note</label>
          <textarea
            value={formData.vendorNote}
            onChange={(event) =>
              handleFormChange("vendorNote", event.target.value)
            }
            placeholder="Add any additional notes about the product"
            rows={3}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-700"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">YouTube Embed Code</label>
          <textarea
            value={formData.youtubeIframe}
            onChange={(event) =>
              handleFormChange("youtubeIframe", event.target.value)
            }
            placeholder="Paste YouTube iframe code here"
            rows={3}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-700"
          />
          {youtubePreviewUrl && (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <iframe
                src={youtubePreviewUrl}
                title="YouTube video preview"
                className="aspect-video w-full max-w-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 rounded-lg px-8 py-3 font-semibold text-white ${
              isSubmitting
                ? "cursor-not-allowed bg-green-400"
                : "cursor-pointer bg-green-600 hover:bg-green-700"
            }`}
          >
            <CheckCircle2 className="h-5 w-5" />
            Submit Product
          </button>
        </div>

        {showSubmitPop && (
          <DeletePop
            productName={formData.productTitle || "this product"}
            title="Submit Product"
            description={
              <>
                Please confirm that you want to submit and add{" "}
                <span className="font-semibold text-slate-700">
                  {formData.productTitle || "this product"}
                </span>{" "}
                to the inventory.
              </>
            }
            confirmLabel="Submit"
            processingLabel="Submitting..."
            isProcessing={isSubmitting}
            onCancel={() => setShowSubmitPop(false)}
            onConfirm={handleFinalSubmit}
          />
        )}
      </form>
    </main>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly = false,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        onChange={(event) => onChange?.(event.target.value)}
        className={`w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ${
          readOnly
            ? "cursor-not-allowed bg-slate-100 text-slate-500"
            : "bg-slate-50 focus:border-indigo-700"
        }`}
      />
    </div>
  );
}

function SellToggle({ value, onChange }) {
  return (
    <div>
      <p className="mb-2 font-semibold">Available for Sell *</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`cursor-pointer rounded-xl border-2 px-4 py-3 font-semibold ${
            value
              ? "border-green-600 bg-green-50 text-green-700"
              : "border-slate-200 bg-white text-slate-500"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`cursor-pointer rounded-xl border-2 px-4 py-3 font-semibold ${
            !value
              ? "border-red-600 bg-red-50 text-red-700"
              : "border-slate-200 bg-white text-slate-500"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}
