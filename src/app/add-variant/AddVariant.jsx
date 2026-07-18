"use client";
import { useState } from "react";
import Image from "next/image";
import { SEARCH_RESULTS, PRODUCT_DETAILS } from "@/constants/inventory";
import {
  Search,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

function normalizeAttributeValue(value) {
  return String(value).trim().toLowerCase();
}
// fdfd 
function getCombinationItems(productDetails, combinationId) {
  const vendors = productDetails?.details?.vendors ?? {};
  return Object.values(vendors).flatMap((vendor) =>
    Object.values(vendor.combination_offered?.[combinationId] ?? {})
  );
}

function getPossibleSelections(combo) {
  if (!combo) return [];
  const attributes = Object.entries(combo).filter(([key]) => key !== "id");
  if (attributes.length === 0 || attributes.some(([, values]) => !values.length)) {
    return [];
  }

  return attributes.reduce(
    (selections, [attributeName, values]) =>
      selections.flatMap((selection) =>
        values.map((value) => ({ ...selection, [attributeName]: value }))
      ),
    [{}]
  );
}

function getAvailableSelections(combo, productDetails) {
  const existingItems = getCombinationItems(productDetails, combo.id);
  return getPossibleSelections(combo).filter(
    (selection) =>
      !existingItems.some((item) =>
        Object.entries(selection).every(
          ([attributeName, value]) =>
            normalizeAttributeValue(item[attributeName]) ===
            normalizeAttributeValue(value)
        )
      )
  );
}

function isCombinationFullyExisting(combo, productDetails) {
  const possibleSelections = getPossibleSelections(combo);
  return (
    possibleSelections.length > 0 &&
    getAvailableSelections(combo, productDetails).length === 0
  );
}

export default function AddVariant() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [combinations, setCombinations] = useState([]);
  const [openCombinationId, setOpenCombinationId] = useState(null);
  const [selectorCombinationId, setSelectorCombinationId] = useState(null);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});
  const [attributeScope, setAttributeScope] = useState("all");
  const [valueScope, setValueScope] = useState("all");
  const [showApplySettings, setShowApplySettings] = useState(true);
  const [formData, setFormData] = useState({
    sku: "",
    price: "",
    mrp: "",
    sellPrice: "",
    weight: "",
    stocks: "",
    availableForSell: true,
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  });
  const filteredResults = SEARCH_RESULTS.filter((item) => {
    const title = item.product.product_title.toLowerCase();
    const code = item.product.code.toLowerCase();
    const term = searchTerm.toLowerCase();
    return title.includes(term) || code.includes(term);
  });
  function handleSelectProduct(item) {
    setSelectedProduct(item);
    const details = PRODUCT_DETAILS[item.docId];
    setProductDetails(details || null);
    setAttributeScope("all");
    setValueScope("all");
    setShowApplySettings(true);
    setFormData({
      sku: details?.details.spec_id ?? "",
      price: details?.details.price ?? "",
      mrp: details?.details.mrp ?? "",
      sellPrice: details?.details.sell_max_price ?? "",
      weight: "",
      stocks: "",
      availableForSell: true,
      image1: "",
      image2: "",
      image3: "",
      image4: "",
    });
    if (details) {
      const comboArray = Object.keys(details.specifications.combination).map(
        (comboId) => ({
          id: comboId,
          ...details.specifications.combination[comboId],
        })
      );
      setCombinations(comboArray);
      setOpenCombinationId(comboArray[0]?.id ?? null);
      setSelectorCombinationId(null);
      setSelectedAttributeValues({});
    } else {
      setCombinations([]);
      setOpenCombinationId(null);
      setSelectorCombinationId(null);
      setSelectedAttributeValues({});
    }
  }
  function handleAddNewCombination() {
    const newId = `combination_${combinations.length + 1}`;
    setCombinations([...combinations, { id: newId, color: [] }]);
    setOpenCombinationId(newId);
  }
  function handleDeleteCombination(comboId) {
    setCombinations(combinations.filter((combo) => combo.id !== comboId));
    if (openCombinationId === comboId) {
      setOpenCombinationId(null);
    }
  }
  function handleToggleCombination(comboId) {
    if (openCombinationId === comboId) {
      setOpenCombinationId(null);
    } else {
      setOpenCombinationId(comboId);
    }
  }
  function addAttribute(comboId, attributeName, scope) {
    const normalizedName = attributeName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    if (!normalizedName || normalizedName === "id") return;

    setCombinations((currentCombinations) =>
      currentCombinations.map((combo) => {
        const shouldUpdate = scope === "all" || combo.id === comboId;
        const attributeAlreadyExists = Object.keys(combo).some((key) => {
          return key.toLowerCase() === normalizedName.toLowerCase();
        });

        if (!shouldUpdate || attributeAlreadyExists) return combo;
        return { ...combo, [normalizedName]: [] };
      })
    );
  }
  function handleAddAttribute(comboId, attributeName) {
    addAttribute(comboId, attributeName, attributeScope);
  }
  function handleRemoveAttribute(comboId, attributeName) {
    setCombinations((currentCombinations) =>
      currentCombinations.map((combo) => {
        if (combo.id !== comboId) return combo;
        return Object.fromEntries(
          Object.entries(combo).filter(([key]) => key !== attributeName)
        );
      })
    );
  }
  function addAttributeValue(comboId, attributeName, value, scope) {
    if (!value) return;

    setCombinations((currentCombinations) =>
      currentCombinations.map((combo) => {
        const shouldUpdate = scope === "all" || combo.id === comboId;
        const attributeExists = Array.isArray(combo[attributeName]);
        const valueExists =
          attributeExists &&
          combo[attributeName].some((existingValue) => {
            return (
              normalizeAttributeValue(existingValue) ===
              normalizeAttributeValue(value)
            );
          });

        if (!shouldUpdate || !attributeExists || valueExists) return combo;
        return {
          ...combo,
          [attributeName]: [...combo[attributeName], value],
        };
      })
    );
  }
  function handleAddAttributeValue(comboId, attributeName, value) {
    if (!value) return;
    addAttributeValue(comboId, attributeName, value, valueScope);
  }
  function handleRemoveAttributeValue(comboId, attributeName, valueIndex) {
    setCombinations(
      combinations.map((combo) => {
        if (combo.id !== comboId) return combo;
        const updatedValues = combo[attributeName].filter(
          (_, index) => index !== valueIndex
        );
        return { ...combo, [attributeName]: updatedValues };
      })
    );
  }
  function handleSelectCombination(comboId) {
    const combo = combinations.find((item) => item.id === comboId);
    if (combo) handleSelectorCombination(combo);

    setFormData({
      sku: productDetails.details.spec_id,
      price: productDetails.details.price,
      mrp: productDetails.details.mrp,
      sellPrice: productDetails.details.sell_max_price,
      weight: "",
      stocks: "",
      availableForSell: true,
      image1: "",
      image2: "",
      image3: "",
      image4: "",
    });
  }
  function handleFormChange(field, value) {
    setFormData({ ...formData, [field]: value });
  }
  function handleSubmit() {
    console.log("Submitting product:", {
      product: selectedProduct?.product,
      combination: selectorCombo,
      attributes: selectedAttributeValues,
      ...formData,
    });

    alert("Product submitted! (check the browser console for the data)");
  }
  const selectorCombo = combinations.find(
    (combo) => combo.id === selectorCombinationId
  );
  const availableCombinations = combinations.filter((combo) => {
    return !isCombinationFullyExisting(combo, productDetails);
  });
  const selectorAvailableSelections = selectorCombo
    ? getAvailableSelections(selectorCombo, productDetails)
    : [];
  const selectorAttributes = selectorCombo
    ? Object.entries(selectorCombo).filter(([key]) => key !== "id")
    : [];
  const allAttributesSelected =
    selectorAttributes.length > 0 &&
    selectorAttributes.every(
      ([attributeName, values]) =>
        values.length > 0 && selectedAttributeValues[attributeName]
    );

  function handleSelectorCombination(combo) {
    if (isCombinationFullyExisting(combo, productDetails)) return;
    const firstAvailableSelection = getAvailableSelections(
      combo,
      productDetails
    )[0];
    if (!firstAvailableSelection) return;

    setSelectorCombinationId(combo.id);
    setSelectedAttributeValues(firstAvailableSelection);
  }

  function handleSelectorAttribute(attributeName, value) {
    setSelectedAttributeValues((currentValues) => ({
      ...currentValues,
      [attributeName]: value,
    }));
  }

  return (
    <div className="w-full  bg-white px-20 pt-20">
      <h1 className="mb-1 text-2xl font-bold">Add New Product</h1>
      <p className="mb-6 text-gray-500">
        Search and select a product, choose a variant, then fill in the price
      </p>

      <h2 className="mb-2 font-semibold">Search Product</h2>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or code..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 outline-none focus:border-blue-400"
        />
      </div>

      <h3 className="mb-3 text-sm text-gray-500">
        Select Product ({filteredResults.length} results)
      </h3>
      <div className="max-h-[calc(100vh-20rem)] space-y-3 overflow-y-auto px-5 py-5">
        {filteredResults.map((item) => {
          const isSelected = selectedProduct?.docId === item.docId;

          return (
            <button
              key={item.docId}
              onClick={() => handleSelectProduct(item)}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left hover:border-blue-400 ${
                isSelected
                  ? "border-blue-600 ring-2 ring-blue-600"
                  : "border-gray-200"
              }`}
            >
              <Image
                src={item.product.image}
                alt={item.product.product_title}
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold">{item.product.product_title}</p>
                <p className="text-sm text-gray-500">
                  {item.product.category} · ₹{item.product.price}
                </p>
              </div>
            </button>
          );
        })}

        {filteredResults.length === 0 && (
          <p className="text-sm text-gray-400">No products found.</p>
        )}
      </div>
      {selectedProduct && (
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
          <div className="bg-indigo-900 p-5 text-white">
            <p className="text-lg font-semibold">
              {selectedProduct.product.product_title}
            </p>
            <p className="text-sm text-indigo-200">
              {selectedProduct.product.category} · {selectedProduct.product.code}
            </p>
          </div>

          <div className="p-5">
            {productDetails ? (
              <>
                <div className="mb-4 rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-gray-500">Spec ID:</p>
                  <p className="font-mono font-bold text-green-700">
                    {productDetails.details.spec_id}
                  </p>
                </div>
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-gray-400">MRP</p>
                    <p className="font-bold">₹{productDetails.details.mrp}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-gray-400">PRICE</p>
                    <p className="font-bold">
                      ₹{productDetails.details.price}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs text-gray-400">SELL STATUS</p>
                    <p
                      className={`font-bold ${
                        productDetails.details.sell
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {productDetails.details.sell ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-sm font-semibold text-yellow-800">
                  Minimum Price: ₹{productDetails.specifications.minimum_price}
                </div>

                <ApplyChangesSettings
                  attributeScope={attributeScope}
                  valueScope={valueScope}
                  showSettings={showApplySettings}
                  onAttributeScopeChange={setAttributeScope}
                  onValueScopeChange={setValueScope}
                  onShowSettingsChange={setShowApplySettings}
                />

                <div className="space-y-3">
                  {combinations.map((combo) => {
                    const isOpen = openCombinationId === combo.id;

                    return (
                      <div
                        key={combo.id}
                        className="overflow-hidden rounded-xl border border-gray-200"
                      >
                        <div className="flex items-center justify-between bg-gray-50 p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleCombination(combo.id)}
                            className="flex flex-1 items-center justify-between text-left"
                          >
                            <span className="font-bold uppercase text-indigo-900">
                              {combo.id.replace("_", " ")}
                            </span>
                            <ChevronDown
                              className={`mr-4 h-5 w-5 text-gray-500 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectCombination(combo.id)}
                              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                            >
                              Select
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCombination(combo.id)}
                              className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="p-5">
                            {Object.keys(combo)
                              .filter((key) => key !== "id")
                              .map((attributeName) => (
                                <AttributeRow
                                  key={attributeName}
                                  comboId={combo.id}
                                  attributeName={attributeName}
                                  values={combo[attributeName]}
                                  onAddValue={handleAddAttributeValue}
                                  onRemoveValue={handleRemoveAttributeValue}
                                  onRemoveAttribute={handleRemoveAttribute}
                                />
                              ))}
                            <AddAttributeForm
                              comboId={combo.id}
                              onAddAttribute={handleAddAttribute}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleAddNewCombination}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-indigo-300 py-3 font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  <Plus className="h-4 w-4" /> Add New Combination
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-400">
                No saved details found for this product yet.
              </p>
            )}
          </div>
        </div>
      )}


      {productDetails && (
        <div className="mb-8 space-y-6">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white transition-colors hover:bg-green-700"
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={3} />
            Save Changes to Database
          </button>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="bg-indigo-900 px-6 py-5 text-white">
              <h2 className="text-lg font-bold">
                Select Combination &amp; Attributes
              </h2>
              <p className="mt-1 text-sm text-indigo-200">
                Choose a combination, then pick a value for each attribute
              </p>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <p className="mb-3 font-medium text-gray-800">Combination</p>
                <div className="flex flex-wrap gap-4">
                  {availableCombinations.map((combo) => (
                    <button
                      type="button"
                      key={combo.id}
                      onClick={() => handleSelectorCombination(combo)}
                      className={`w-56 rounded-lg border-2 px-5 py-4 text-left transition-colors ${
                        selectorCombinationId === combo.id
                          ? "border-indigo-900 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-sm font-bold uppercase tracking-wide text-indigo-950">
                        {combo.id.replaceAll("_", " ")}
                      </p>
                      {Object.entries(combo)
                        .filter(([key]) => key !== "id")
                        .map(([attributeName, values]) => (
                          <p
                            key={attributeName}
                            className="mt-1 text-sm text-gray-500"
                          >
                            {attributeName.replaceAll("_", " ")}: {values.join(", ") || "—"}
                          </p>
                        ))}
                    </button>
                  ))}

                  {availableCombinations.length === 0 && (
                    <p className="text-sm text-gray-400">
                      No available combinations.
                    </p>
                  )}
                </div>
              </div>

              {selectorCombo &&
                Object.entries(selectorCombo)
                  .filter(([key]) => key !== "id")
                  .map(([attributeName, values]) => (
                    <div key={attributeName}>
                      <p className="mb-3 font-medium capitalize text-gray-800">
                        Select {attributeName.replaceAll("_", " ")}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {values.map((value) => {
                          const isDisabled = !selectorAvailableSelections.some(
                            (selection) =>
                              normalizeAttributeValue(
                                selection[attributeName]
                              ) === normalizeAttributeValue(value) &&
                              Object.entries(selectedAttributeValues).every(
                                ([selectedAttribute, selectedValue]) =>
                                  selectedAttribute === attributeName ||
                                  normalizeAttributeValue(
                                    selection[selectedAttribute]
                                  ) ===
                                    normalizeAttributeValue(selectedValue)
                              )
                          );

                          return (
                            <button
                              type="button"
                              key={value}
                              disabled={isDisabled}
                              onClick={() =>
                                handleSelectorAttribute(attributeName, value)
                              }
                              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-colors ${
                                isDisabled
                                  ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 line-through"
                                  : selectedAttributeValues[attributeName] === value
                                    ? "bg-indigo-900 text-white"
                                    : "border border-gray-300 text-gray-800 hover:border-gray-400"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

              {selectorCombo && (
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4">
                  <span className="font-bold text-green-700">Selected:</span>
                  {Object.entries(selectedAttributeValues).map(
                    ([attributeName, value]) => (
                      <span
                        key={attributeName}
                        className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium capitalize text-green-800"
                      >
                        {attributeName.replaceAll("_", " ")}: {value}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {allAttributesSelected && (
        <ProductVariantForm
          combination={selectorCombo}
          selectedAttributes={selectedAttributeValues}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
function ApplyChangesSettings({
  attributeScope,
  valueScope,
  showSettings,
  onAttributeScopeChange,
  onValueScopeChange,
  onShowSettingsChange,
}) {
  if (!showSettings) {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-indigo-950">
          <span>
            <strong>Attributes:</strong>{" "}
            {attributeScope === "all" ? "All combinations" : "Current combination"}
          </span>
          <span>
            <strong>Values:</strong>{" "}
            {valueScope === "all" ? "All combinations" : "Current combination"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onShowSettingsChange(true)}
          className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
        >
          Change Preference
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-indigo-950">Apply Changes</h3>
          <p className="mt-1 text-sm text-indigo-700">
            These choices stay active while editing this product.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onShowSettingsChange(false)}
          className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
        >
          Done
        </button>
      </div>

      <PreferenceRow
        label="Attributes"
        name="attribute-scope"
        value={attributeScope}
        onChange={onAttributeScopeChange}
      />
      <PreferenceRow
        label="Values"
        name="value-scope"
        value={valueScope}
        onChange={onValueScopeChange}
      />
    </div>
  );
}

function PreferenceRow({ label, name, value, onChange }) {
  return (
    <fieldset className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
      <legend className="float-left mr-6 min-w-24 font-semibold text-gray-800">
        {label}:
      </legend>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="radio"
          name={name}
          value="all"
          checked={value === "all"}
          onChange={() => onChange("all")}
          className="h-4 w-4 accent-indigo-700"
        />
        All Combinations
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="radio"
          name={name}
          value="current"
          checked={value === "current"}
          onChange={() => onChange("current")}
          className="h-4 w-4 accent-indigo-700"
        />
        Current Combination
      </label>
    </fieldset>
  );
}

function ProductVariantForm({
  combination,
  selectedAttributes,
  formData,
  onFormChange,
  onSubmit,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      <div className="border-b border-gray-200 bg-indigo-50 px-6 py-5">
        <h2 className="font-bold uppercase text-indigo-950">
          Selected: {combination.id.replaceAll("_", " ")}
        </h2>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex flex-wrap gap-3">
          {Object.entries(selectedAttributes).map(([attributeName, value]) => (
            <span
              key={attributeName}
              className="rounded-xl border border-green-200 bg-green-50 px-5 py-3 capitalize text-green-800"
            >
              <span className="font-medium text-gray-500">
                {attributeName.replaceAll("_", " ")}:{" "}
              </span>
              <span className="font-bold">{value}</span>
            </span>
          ))}
        </div>

        <div>
          <FormField
            label="SKU *"
            value={formData.sku}
            onChange={(value) => onFormChange("sku", value)}
          />
          <p className="mt-2 text-sm text-gray-400">
            Pre-filled with spec_id. Edit to customize.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Price *"
            type="number"
            value={formData.price}
            onChange={(value) => onFormChange("price", value)}
          />
          <FormField
            label="MRP *"
            type="number"
            value={formData.mrp}
            onChange={(value) => onFormChange("mrp", value)}
          />
          <FormField
            label="Sell Price *"
            type="number"
            value={formData.sellPrice}
            onChange={(value) => onFormChange("sellPrice", value)}
          />
          <FormField
            label="Weight (kg) *"
            type="number"
            value={formData.weight}
            onChange={(value) => onFormChange("weight", value)}
          />
          <FormField
            label="Stocks *"
            type="number"
            value={formData.stocks}
            onChange={(value) => onFormChange("stocks", value)}
          />

          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-3">
            <div>
              <p className="font-semibold text-gray-800">Available for Sell</p>
              <p className="text-sm text-gray-400">
                Enable sell for this product
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onFormChange("availableForSell", true)}
                className={`rounded-lg px-5 py-2 font-semibold ${
                  formData.availableForSell
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => onFormChange("availableForSell", false)}
                className={`rounded-lg px-5 py-2 font-semibold ${
                  !formData.availableForSell
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 font-semibold text-gray-800">
            Product Images (URLs)
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {["image1", "image2", "image3", "image4"].map(
              (field, index) => (
                <FormField
                  key={field}
                  label={`Image ${index + 1}`}
                  value={formData[field]}
                  placeholder="https://..."
                  onChange={(value) => onFormChange(field, value)}
                />
              )
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-6">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-10 py-3 font-semibold text-white hover:bg-green-700"
          >
            <CheckCircle2 className="h-5 w-5" />
            Submit Product
          </button>
        </div>
      </div>
    </form>
  );
}
function AttributeRow({
  comboId,
  attributeName,
  values,
  onAddValue,
  onRemoveValue,
  onRemoveAttribute,
}) {
  const [newValue, setNewValue] = useState("");

  function handleAddClick() {
    onAddValue(comboId, attributeName, newValue.trim());
    setNewValue("");
  }

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="font-semibold capitalize">
          {attributeName.replaceAll("_", " ")}
        </p>
        <button
          type="button"
          onClick={() => onRemoveAttribute(comboId, attributeName)}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {values.map((value, index) => (
          <span
            key={index}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm"
          >
            {value}
            <button
              onClick={() => onRemoveValue(comboId, attributeName, index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="New value"
          className="w-28 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1 rounded-lg border border-dashed border-indigo-300 px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-50"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
    </div>
  );
}
function AddAttributeForm({ comboId, onAddAttribute }) {
  const [attributeName, setAttributeName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!attributeName.trim()) return;
    onAddAttribute(comboId, attributeName);
    setAttributeName("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 flex gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3"
    >
      <input
        type="text"
        value={attributeName}
        onChange={(event) => setAttributeName(event.target.value)}
        placeholder="New attribute name (e.g. storage)"
        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-400"
      />
      <button
        type="submit"
        className="flex items-center gap-2 rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800"
      >
        <Plus className="h-4 w-4" /> Add Attribute
      </button>
    </form>
  );
}
function FormField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-400"
      />
    </div>
  );
}
