"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  Package,
  Search,
  X,
} from "lucide-react";

import { addSpecialEdition, getProductDetail, searchProducts } from "@/app/apis/api";
import { brandMap, typeMap } from "@/constants/inventory";

function generateSpecialEditionSku(specId, productTitle) {
  const specWords = specId.toLowerCase().split("-");
  const titleWords = productTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const uniqueTitleWords = titleWords.filter(
    (word) => !specWords.includes(word)
  );

  return [...specWords, ...uniqueTitleWords].join("-");
}

function convertImageToCdn(imageUrl) {
  const firebasePrefix =
    "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/";
  const cdnPrefix = "https://dacby-database.web.app/cdn/";
  const trimmedUrl = imageUrl.trim();

  if (!trimmedUrl.startsWith(firebasePrefix)) return trimmedUrl;

  return `${cdnPrefix}${trimmedUrl.slice(firebasePrefix.length)}`;
}

function makeEmptyForm() {
  return {
    categoryCode: "",
    brand: "",
    type: "",
    productTitle: "",
    sku: "",
    price: "",
    mrp: "",
    sellPrice: "",
    sellMaxPrice: "",
    weight: "",
    stocks: "",
    sell: true,
    vendorName: "Dacby Technologies Pvt. Ltd.",
    vendorNote: "",
    youtubeIframe: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  };
}

export default function SpecialEdition() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(makeEmptyForm());
  const searchRequestId = useRef(0);
  const detailsRequestId = useRef(0);

  useEffect(() => {
    const query = searchTerm.trim();
    const requestId = ++searchRequestId.current;

    if (!query) return;

    const timeoutId = window.setTimeout(async () => {
      setSearching(true);
      setSearchError("");

      try {
        const results = await searchProducts(query);
        if (requestId !== searchRequestId.current) return;
        setSearchResults(Array.isArray(results) ? results : []);
      } catch (error) {
        if (requestId !== searchRequestId.current) return;
        setSearchResults([]);
        setSearchError(error.message || "Failed to search products");
      } finally {
        if (requestId === searchRequestId.current) setSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const selectedCategory = productDetails?.details
    ? {
        name: productDetails.details.category_name,
        code: productDetails.details.code,
      }
    : null;
  const specialEditionCategories = selectedCategory ? [selectedCategory] : [];

  function handleSearchChange(value) {
    setSearchTerm(value);
    if (!value.trim()) {
      searchRequestId.current += 1;
      setSearchResults([]);
      setSearchError("");
      setSearching(false);
    }
  }

  async function handleSelectProduct(item) {
    const requestId = ++detailsRequestId.current;
    setSelectedProduct(item);
    setProductDetails(null);
    setDetailsError("");
    setLoadingDetails(true);

    setFormData(makeEmptyForm());

    try {
      const details = await getProductDetail(item.docId);
      if (requestId !== detailsRequestId.current) return;
      setProductDetails(details);
      setFormData((currentFormData) => ({
        ...currentFormData,
        categoryCode: details?.details?.code || "",
        brand: details?.details?.brand || "",
        type: details?.details?.type || "",
      }));
    } catch (error) {
      if (requestId !== detailsRequestId.current) return;
      setDetailsError(error.message || "Failed to fetch product details");
    } finally {
      if (requestId === detailsRequestId.current) setLoadingDetails(false);
    }
  }

  function handleFormChange(field, value) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));
  }

  function handleProductTitleChange(value) {
    if (!productDetails) return;

    setFormData((currentFormData) => ({
      ...currentFormData,
      productTitle: value,
      sku: generateSpecialEditionSku(
        productDetails.details.spec_id,
        value
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedProduct) return;

    const selectedCategory = specialEditionCategories.find((category) => {
      return category.code === formData.categoryCode;
    });

    const price = Number(formData.price) || 0;
    const mrp = Number(formData.mrp) || 0;
    const sellPrice = Number(formData.sellPrice) || 0;
    const sellMaxPrice = Number(formData.sellMaxPrice) || 0;
    const weight = Number(formData.weight) || 0;
    const stocks = Number(formData.stocks) || 0;
    const images = [
      formData.image1,
      formData.image2,
      formData.image3,
      formData.image4,
    ]
      .map((imageUrl) => convertImageToCdn(imageUrl))
      .filter(Boolean);

    const product = {
      spec_id: productDetails?.details?.spec_id || "",
      product_title: formData.productTitle,
      code: selectedCategory?.code ?? "",
      category_name: selectedCategory?.name ?? "",
      condition: selectedProduct.product.condition,
      ...(formData.brand.trim() ? { brand: formData.brand.trim() } : {}),
      ...(formData.type.trim() ? { type: formData.type.trim() } : {}),
      mrp,
      price,
      rating: 0,
      rating_count: 0,
      sell: formData.sell,
      sell_max_price: sellMaxPrice,
      in_stock: stocks > 0,
      yt_iframe: formData.youtubeIframe,
      vendors: {
        VENDOR_001: {
          vendor_id: "VENDOR_001",
          vendor_note: formData.vendorNote,
          name: formData.vendorName,
          combination_offered: {
            combination_1: {
              item_1: {
                sell_price: sellPrice,
                sell: formData.sell,
                sku: formData.sku,
                weight,
                mrp,
                price,
                rating: 0,
                rating_count: 0,
                yt_iframe: "",
                images,
                stocks,
              },
            },
          },
        },
      },
    };
    const payload = { product };

    setSubmitting(true);
    try {
      console.log("Special edition payload:", payload);
      const response = await addSpecialEdition(payload);
      toast.success(response?.message || "Special edition added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add special edition");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex items-start justify-between border-b border-slate-200 bg-white px-5 py-3 md:px-8 lg:px-11">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Add New Product</h1>
          <p className="mt-1 text-slate-500">
            Search a product and enter special edition details
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer text-slate-500 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-12 px-5 py-6 md:px-8 md:py-6 lg:px-11 lg:py-9">
        <SearchProductStep
          searchTerm={searchTerm}
          products={searchResults}
          selectedProduct={selectedProduct}
          searching={searching}
          searchError={searchError}
          loadingDetails={loadingDetails}
          detailsError={detailsError}
          onSearchChange={handleSearchChange}
          onSelectProduct={handleSelectProduct}
        />

        {selectedProduct && productDetails && (
        <ProductDetailsStep
          key={selectedProduct.docId}
          selectedProduct={selectedProduct}
          productDetails={productDetails}
          categories={specialEditionCategories}
          formData={formData}
          onFormChange={handleFormChange}
          onProductTitleChange={handleProductTitleChange}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
        )}
      </div>
    </main>
  );
}

function SearchProductStep({
  searchTerm,
  products,
  selectedProduct,
  searching,
  searchError,
  loadingDetails,
  detailsError,
  onSearchChange,
  onSelectProduct,
}) {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950 to-amber-800 px-8 py-7 text-white">
        <h2 className="text-2xl font-bold">Special Edition Product</h2>
        <p className="mt-2 text-amber-200">
          Search for an existing product to use its spec_id
        </p>
      </div>

      <div>
        <label className="mb-2 block font-semibold">Search Product</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by product, category, or code"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 outline-none focus:border-indigo-700"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 font-semibold">
          Select Product ({products.length} results)
        </p>
        <div
          className={`space-y-3 overflow-y-auto pr-2 ${
            selectedProduct
              ? "max-h-[330px]"
              : "max-h-[calc(100vh-24rem)]"
          }`}
        >
          {products.map((item) => {
            const isSelected = selectedProduct?.docId === item.docId;

            return (
              <button
                type="button"
                key={item.docId}
                onClick={() => onSelectProduct(item)}
                className={`flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 p-4 text-left ${
                  isSelected
                    ? "border-indigo-900 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <Image
                  src={item.product.image}
                  alt={item.product.product_title}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div>
                  <p className="font-bold text-slate-950">
                    {item.product.product_title}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">
                      {item.product.category}
                    </span>
                    <span className="font-semibold text-green-600">
                      ₹{item.product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {searching && (
            <p className="rounded-xl border border-slate-200 p-6 text-center text-slate-500">
              Searching products...
            </p>
          )}

          {searchError && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
              {searchError}
            </p>
          )}

          {!searching && !searchError && searchTerm.trim() && products.length === 0 && (
            <p className="rounded-xl border border-slate-200 p-6 text-center text-slate-400">
              No products found.
            </p>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className="overflow-hidden rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-950 to-indigo-700 px-6 py-5 text-white">
            <div>
              <p className="text-lg font-bold">
                {selectedProduct.product.product_title}
              </p>
              <p className="mt-1 text-indigo-200">
                {selectedProduct.product.category} · {selectedProduct.product.code}
              </p>
            </div>
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
              {selectedProduct.product.condition}
            </span>
          </div>
        </div>
      )}

      {loadingDetails && (
        <p className="text-sm text-slate-500">Loading product details...</p>
      )}
      {detailsError && (
        <p className="text-sm text-red-600">{detailsError}</p>
      )}
    </section>
  );
}

function ProductDetailsStep({
  selectedProduct,
  productDetails,
  categories,
  formData,
  onFormChange,
  onProductTitleChange,
  onSubmit,
  submitting,
}) {
  const specId = productDetails?.details?.spec_id || "";
  const categoryName = productDetails?.details?.category_name || "";
  const showsBrandAndType =
    categoryName === "Consoles" || categoryName === "Cameras";
  const brandOptions = brandMap[categoryName] || [];
  const typeOptions = typeMap[categoryName] || [];
  const [addingCustomBrand, setAddingCustomBrand] = useState(
    Boolean(formData.brand) && !brandOptions.includes(formData.brand),
  );
  const [addingCustomType, setAddingCustomType] = useState(
    Boolean(formData.type) && !typeOptions.includes(formData.type),
  );

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-6 py-5">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Spec ID:</span>
          <span className="rounded-lg bg-white px-4 py-2 font-mono font-bold text-green-700">
            {specId}
          </span>
        </div>
        <span className="text-sm text-slate-500">
          from: {selectedProduct.product.product_title}
        </span>
      </div>

      <div>
        <p className="mb-3 font-semibold">Category *</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const isSelected = formData.categoryCode === category.code;

            return (
              <button
                type="button"
                key={category.code}
                onClick={() => onFormChange("categoryCode", category.code)}
                className={`cursor-pointer rounded-xl border-2 p-4 text-left ${
                  isSelected
                    ? "border-indigo-900 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <p className="font-bold">{category.name}</p>
                <p className="mt-1 font-mono text-sm text-slate-400">
                  {category.code}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {showsBrandAndType ? (
        <div className="grid gap-5 md:grid-cols-2">
          <MappedOrCustomField
            label="Brand"
            value={formData.brand}
            options={brandOptions}
            addingCustom={addingCustomBrand}
            onAddingCustomChange={setAddingCustomBrand}
            onChange={(value) => onFormChange("brand", value)}
          />
          <MappedOrCustomField
            label="Type"
            value={formData.type}
            options={typeOptions}
            addingCustom={addingCustomType}
            onAddingCustomChange={setAddingCustomType}
            onChange={(value) => onFormChange("type", value)}
          />
        </div>
      ) : null}

      <TextField
        label="Product Title *"
        value={formData.productTitle}
        placeholder="PS4 Dualshock V1 (GT Sport)"
        onChange={onProductTitleChange}
      />

      <div>
        <TextField
          label="SKU"
          value={formData.sku}
          onChange={(value) => onFormChange("sku", value)}
        />
        <p className="mt-2 text-sm text-slate-400">
          Auto-generated from product title. Edit if needed.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Price *" type="number" value={formData.price} placeholder="0" onChange={(value) => onFormChange("price", value)} />
        <TextField label="MRP *" type="number" value={formData.mrp} placeholder="0" onChange={(value) => onFormChange("mrp", value)} />
        <TextField label="Sell Price *" type="number" value={formData.sellPrice} placeholder="0" onChange={(value) => onFormChange("sellPrice", value)} />
        <TextField label="Sell Max Price" type="number" value={formData.sellMaxPrice} placeholder="0" onChange={(value) => onFormChange("sellMaxPrice", value)} />
        <TextField label="Weight (kg) *" type="number" value={formData.weight} placeholder="0" onChange={(value) => onFormChange("weight", value)} />
        <TextField label="Stocks *" type="number" value={formData.stocks} placeholder="0" onChange={(value) => onFormChange("stocks", value)} />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4">
        <span className="font-semibold">Sell</span>
        <div className="flex gap-2">
          <ToggleButton active={formData.sell} onClick={() => onFormChange("sell", true)}>Yes</ToggleButton>
          <ToggleButton
            active={!formData.sell}
            activeColor="red"
            onClick={() => onFormChange("sell", false)}
          >
            No
          </ToggleButton>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Vendor Name" value={formData.vendorName} onChange={(value) => onFormChange("vendorName", value)} />
        <TextField label="Vendor Note" value={formData.vendorNote} placeholder="Optional note" onChange={(value) => onFormChange("vendorNote", value)} />
      </div>

      <div>
        <label className="mb-2 block font-semibold">YouTube Iframe</label>
        <textarea
          value={formData.youtubeIframe}
          onChange={(event) => onFormChange("youtubeIframe", event.target.value)}
          placeholder={'<iframe src="https://www.youtube.com/embed/..."></iframe>'}
          rows={4}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-700"
        />
      </div>

      <div>
        <p className="mb-3 font-semibold">Product Images (URLs)</p>
        <div className="grid gap-5 md:grid-cols-2">
          {["image1", "image2", "image3", "image4"].map((field, index) => (
            <TextField
              key={field}
              label={`Image ${index + 1}`}
              value={formData[field]}
              placeholder="https://..."
              onChange={(value) => onFormChange(field, value)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          <CheckCircle2 className="h-5 w-5" />
          {submitting ? "Submitting Product..." : "Submit Product"}
        </button>
      </div>
    </form>
  );
}

function MappedOrCustomField({
  label,
  value,
  options,
  addingCustom,
  onAddingCustomChange,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block font-semibold">{label}</label>
      <select
        value={addingCustom ? "__other__" : value}
        onChange={(event) => {
          const nextValue = event.target.value;
          const isOther = nextValue === "__other__";
          onAddingCustomChange(isOther);
          onChange(isOther ? "" : nextValue);
        }}
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-700"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="__other__">Other</option>
      </select>
      {addingCustom ? (
        <input
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Enter another ${label.toLowerCase()}`}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-700"
        />
      ) : null}
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="mb-2 block font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-700"
      />
    </div>
  );
}

function ToggleButton({ active, activeColor = "green", onClick, children }) {
  let activeClasses = "bg-green-600 text-white";

  if (activeColor === "red") {
    activeClasses = "bg-red-600 text-white";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-5 py-2 font-semibold ${
        active ? activeClasses : "bg-slate-100 text-slate-500"
      }`}
    >
      {children}
    </button>
  );
}
