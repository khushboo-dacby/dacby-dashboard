"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Copy, RotateCcw, X } from "lucide-react";
// import { toast } from "sonner";
// import { addProductToInventory } from "@/app/apis/api";

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
  summary:
    "Looking for the best price on a high quality pre-owned copy of Little Nightmares III for PlayStation 5? Buy Little Nightmares III PS5 pre-owned game CD online in India from DACBY, your trusted destination for genuine used PlayStation 5 games, second hand PS5 Blu-ray discs, and affordable gaming titles. Published by Bandai Namco Entertainment, Little Nightmares III takes players on a chilling adventure through the mysterious Spiral, a world filled with frightening locations, strange inhabitants, and unsettling dangers. Play as Low and Alone, two friends searching for a path to freedom while surviving terrifying encounters and solving challenging puzzles. Explore haunting environments, uncover hidden secrets, overcome deadly traps, and experience a unique blend of horror, platforming, exploration, and puzzle solving. Optimized for PlayStation 5, Little Nightmares III delivers atmospheric visuals, immersive sound design, responsive gameplay, and a captivating horror adventure designed for modern hardware.\n\nWhen you choose to buy a pre-owned Little Nightmares III PS5 game disc online at DACBY, you can shop with complete confidence and peace of mind. Every pre-owned PlayStation 5 game sold through DACBY is thoroughly inspected, tested for functionality, and verified for authenticity before being listed for sale. DACBY provides secure payment options, competitive pricing, reliable customer support, and fast shipping across India. Whether you are a fan of horror games, puzzle platformers, atmospheric adventures, or simply looking for an affordable way to enjoy one of the most anticipated PlayStation 5 releases, DACBY is your trusted online destination for buying used PS5 game CDs, pre-owned PlayStation 5 Blu-ray discs, adventure games, and premium gaming products at great prices.",
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
  summary:
    "Looking for the best price on a high quality pre-owned copy of Little Nightmares III for PlayStation 4? Buy Little Nightmares III PS4 pre-owned game CD online in India from DACBY, your trusted destination for genuine used PlayStation 4 games, second hand PS4 Blu-ray discs, and affordable gaming titles. Published by Bandai Namco Entertainment, Little Nightmares III takes players on a chilling adventure through the mysterious Spiral, a world filled with frightening locations, strange inhabitants, and unsettling dangers. Play as Low and Alone, two friends searching for a path to freedom while surviving terrifying encounters and solving challenging puzzles. Explore haunting environments, uncover hidden secrets, overcome deadly traps, and experience a unique blend of horror, platforming, exploration, and puzzle solving. Optimized for PlayStation 4, Little Nightmares III delivers atmospheric visuals, immersive sound design, responsive gameplay, and a captivating horror adventure for console players.\n\nWhen you choose to buy a pre-owned Little Nightmares III PS4 game disc online at DACBY, you can shop with complete confidence and peace of mind. Every pre-owned PlayStation 4 game sold through DACBY is thoroughly inspected, tested for functionality, and verified for authenticity before being listed for sale. DACBY provides secure payment options, competitive pricing, reliable customer support, and fast shipping across India. Whether you are a fan of horror games, puzzle platformers, atmospheric adventures, or simply looking for an affordable way to enjoy one of the most anticipated PlayStation releases, DACBY is your trusted online destination for buying used PS4 game CDs, pre-owned PlayStation 4 Blu-ray discs, adventure games, and premium gaming products at great prices.",
};

const PS4_DESCRIPTION_JSON = JSON.stringify(PS4_DESCRIPTION_TEMPLATE, null, 2);

function makeSlug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function makeEmptyForm(descriptionJson = "") {
  return {
    productTitle: "",
    mrp: "",
    buyPrice: "",
    sellPrice: "",
    maxSellPrice: "",
    stocks: "",
    weight: "",
    availableForSell: true,
    releaseDate: "",
    sku: "",
    vendorName: "Dacby Technologies Pvt. Ltd.",
    vendorNote: "",
    youtubeIframe: "",
    descriptionJson,
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  };
}

export default function AddPreorderCd({ categoryName, code }) {
  const router = useRouter();
  const categorySettings = getCategorySettings(code);
  const isPs5Cd = code === "D001Y";
  const isPs4Cd = code === "D002Y";
  const isGameCd = isPs5Cd || isPs4Cd;
  const isPreOrder = code === "D003Y";
  let initialDescription = "";

  if (isPs5Cd) {
    initialDescription = PS5_DESCRIPTION_JSON;
  }

  if (isPs4Cd) {
    initialDescription = PS4_DESCRIPTION_JSON;
  }
  const [formData, setFormData] = useState(
    makeEmptyForm(initialDescription)
  );
  const [descriptionError, setDescriptionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFormChange(field, value) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));
  }

  function handleProductTitleChange(value) {
    const titleSlug = makeSlug(value);
    const generatedSku = titleSlug
      ? `${titleSlug}-${categorySettings.specId}`
      : "";

    setFormData((currentFormData) => ({
      ...currentFormData,
      productTitle: value,
      sku: generatedSku,
    }));
  }

  function handleReset() {
    setFormData(makeEmptyForm(initialDescription));
    setDescriptionError("");
    setIsSubmitting(false);
  }

  async function handleCopyDescription() {
    try {
      await navigator.clipboard.writeText(formData.descriptionJson);
      alert("Description JSON copied.");
    } catch {
      alert("Could not copy automatically. Please select and copy the JSON.");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    let description;

    if (isGameCd) {
      try {
        description = JSON.parse(formData.descriptionJson);

        if (!description || Array.isArray(description)) {
          throw new Error("Description must be an object");
        }

        setDescriptionError("");
      } catch {
        setDescriptionError("Description must contain valid JSON.");
        return;
      }
    }

    const images = [
      formData.image1,
      formData.image2,
      formData.image3,
      formData.image4,
    ]
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
        condition: categorySettings.condition,
        mrp,
        price,
        sell: formData.availableForSell,
        sell_max_price: maxSellPrice,
        yt_iframe: formData.youtubeIframe,
        ...(isGameCd ? { description } : {}),
        ...(isPreOrder ? { release_date: formData.releaseDate } : {}),
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
                  rating: 0,
                  rating_count: 0,
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

    // API submission is temporarily disabled while the PS4 CD and
    // preorder payloads are being prepared.
    // try {
    //   setIsSubmitting(true);
    //   const response = await addProductToInventory(payload);
    //   toast.success(response.message || "Product added successfully!");
    //   console.log("Inventory API response:", response);
    // } catch (error) {
    //   const errorMessage =
    //     error instanceof Error
    //       ? error.message
    //       : "Could not add the product. Please try again.";
    //   toast.error(errorMessage);
    // } finally {
    //   setIsSubmitting(false);
    // }
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
            <h2 className="text-2xl font-bold">{categorySettings.heading}</h2>
            <p className="mt-2 text-indigo-200">
              Category: {categoryName} · Code: {code}
            </p>
          </div>
          <span className="rounded-full bg-white/20 px-5 py-2 font-semibold">
            {categorySettings.badge}
          </span>
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

        {isGameCd && (
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">Description JSON *</p>
                <p className="mt-1 text-sm text-slate-500">
                  Copy this JSON, update it for the new title, then paste it
                  back here.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyDescription}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                <Copy className="h-4 w-4" /> Copy JSON
              </button>
            </div>
            <textarea
              value={formData.descriptionJson}
              onChange={(event) => {
                handleFormChange("descriptionJson", event.target.value);
                setDescriptionError("");
              }}
              rows={20}
              spellCheck={false}
              className={`w-full rounded-xl border bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none ${
                descriptionError
                  ? "border-red-500"
                  : "border-slate-700 focus:border-indigo-500"
              }`}
            />
            {descriptionError && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {descriptionError}
              </p>
            )}
          </div>
        )}

        <div>
          <p className="mb-3 font-semibold">Product Images (URLs)</p>
          <div className="grid gap-5 md:grid-cols-2">
            {["image1", "image2", "image3", "image4"].map((field, index) => (
              <FormField
                key={field}
                label={`Image ${index + 1}`}
                value={formData[field]}
                placeholder={`Image ${index + 1} URL`}
                onChange={(value) => handleFormChange(field, value)}
              />
            ))}
          </div>
        </div>

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
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
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
