"use client";
import React, { useEffect, useRef, useState } from "react";
import DescriptionEditor from "@/components/inventory/DescriptionEditor";
import FormActions from "@/components/inventory/FormActions";
import ProductFields from "@/components/inventory/ProductFields";
import QuestionsSection from "@/components/inventory/QuestionsSection";
import ResponsePreview from "@/components/inventory/ResponsePreview";
import SpecificationSection from "@/components/inventory/SpecificationSection";
import VendorsSection from "@/components/inventory/VendorsSection";
import WhatsInTheBoxSection from "@/components/inventory/WhatsInTheBoxSection";
import { emptyItem,phoneOptionsDesc,laptopOptionsDesc,configurationIcons,cameraConfigurationIcons,androidQuestions} from "@/constants/inventory";
import {
  formatAttributeDisplayName,
  formatAttributeValue,
  formatDescriptionKey,
  normalizeAttributeKey,
  normalizeAttributeKeyInput,
  toCDN,
} from "@/utils/formatters";
import useDescriptionState from "@/hooks/useDescriptionState";
import useOptionDescriptionsState from "@/hooks/useOptionDescriptionsState";
import useQuestionsState from "@/hooks/useQuestionsState";
import useWhatsInTheBoxState from "@/hooks/useWhatsInTheBoxState";
import { keepPayloadKeys, parseNumberIfPossible } from "@/utils/payload";
import { generateSKUForItem } from "@/utils/sku";
import { addProductToInventory } from "@/app/apis/api";
import { toast } from "sonner";
function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getPreOrderSku(productTitle, specId) {
  return [productTitle, specId].map(slugify).filter(Boolean).join("-");
}

function normalizeHexColor(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("#")) return trimmed;
  return trimmed.length === 3 || trimmed.length === 6 ? `#${trimmed}` : trimmed;
}

function isCdCategory(categoryName) {
  return categoryName === "PS5 CDs" || categoryName === "PS4 CDs";
}

function getCdSku(productTitle) {
  return slugify(productTitle);
}

function isValidImageUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function generateVisibleSku(fields, item, attributeDefinitions = []) {
  if (fields.category_name === "Pre Orders") {
    return getPreOrderSku(fields.product_title, fields.spec_id);
  }

  if (isCdCategory(fields.category_name)) {
    return getCdSku(fields.product_title);
  }

  return generateSKUForItem(fields.spec_id, item, attributeDefinitions, {
    categoryName: fields.category_name,
    categoryCode: fields.code,
  });
}

function removeEmptyDescriptionSections(description) {
  return Object.keys(description || {}).reduce((acc, key) => {
    const value = description[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (Object.keys(value).length) acc[key] = value;
      return acc;
    }

    if (value !== undefined && value !== "") acc[key] = value;
    return acc;
  }, {});
}

function hasValidCombinationAttributes(combination) {
  return (combination?.attributes || []).some((attribute) => {
    const key = normalizeAttributeKey(attribute?.key);
    const values = Array.isArray(attribute?.values)
      ? attribute.values.filter((value) => String(value ?? "").trim())
      : [];
    return Boolean(key && values.length);
  });
}

export default function InventoryForm() {
  
  const [resp, setResp] = useState(null);
  const [previewPayload, setPreviewPayload] = useState(null);
  const [sending, setSending] = useState(false);
  const [variantImagesByColor, setVariantImagesByColor] = useState({});
  const [confirmedImageColors, setConfirmedImageColors] = useState([]);

  const fieldsRef = useRef(null);
  const vendorsRef = useRef(null);
  const specificationRef = useRef(null);
  const questionsRef = useRef(null);
  const whatsInTheBoxRef = useRef(null);
  const optionDescriptionsRef = useRef(null);
  const descriptionRef = useRef(null);

  const [fields, setFields] = useState({
    brand: "",
    category_name: "",
    code: "",
    condition: "",
    mrp: "",
    price: "",
    product_title: "",
    rating: "",
    rating_count: "",
    sell: false,
    sell_max_price: "",
    minimum_price: "",
    spec_id: "",
    release_date: "",
    yt_iframe: "",
    imagesText: "",
    type: "",
  });

  const [vendors, setVendors] = useState([
    {
      name: "Dacby Technologies Pvt. Ltd.",
      vendor_note: "",
      items: [emptyItem()],
    },
  ]);

  const [specification, setSpecification] = useState({
    color_codes: [],
    combinations: [],
    attributeDefinitions: [],
  });

  const {
    questions,
    resetQuestions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
  } = useQuestionsState();

  const {
    whatsInTheBox,
    resetWhatsInTheBox,
    addBoxItem,
    updateBoxItem,
    removeBoxItem,
  } = useWhatsInTheBoxState();

  const {
    optionDescriptions,
    resetOptionDescriptions,
    getOptionDescription,
    updateOptionDescriptionForValue,
    removeOptionDescriptionForValue,
    removeOptionDescriptionsForValues,
  } = useOptionDescriptionsState();

  const {
    description,
    setDescription,
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
    updateDescriptionTopLevelField,
    removeDescriptionTopLevelField,
  } = useDescriptionState();

  useEffect(() => {
    fieldsRef.current = fields;
    vendorsRef.current = vendors;
    specificationRef.current = specification;
    questionsRef.current = questions;
    whatsInTheBoxRef.current = whatsInTheBox;
    optionDescriptionsRef.current = optionDescriptions;
    descriptionRef.current = description;
  }, [
    fields,
    vendors,
    specification,
    questions,
    whatsInTheBox,
    optionDescriptions,
    description,
  ]);

  function setField(key, value) {
    setFields((prevFields) => {
      const nextFields = { ...prevFields, [key]: value };

      if (
        key === "spec_id" ||
        key === "product_title" ||
        key === "category_name"
      ) {
        // regenerate SKU for all items when SKU-driving product fields change
        setVendors((prev) =>
          prev.map((v) => ({
            ...v,
            items: v.items.map((it) => ({
              ...it,
              sku: generateVisibleSku(
                nextFields,
                it,
                specification.attributeDefinitions,
              ),
            })),
          })),
        );
      }

      return nextFields;
    });
  }

  function addVendor() {
    setVendors((prev) => [
      ...prev,
      { name: "", vendor_note: "", items: [emptyItem()] },
    ]);
  }

  function updateVendor(idx, key, value) {
    setVendors((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [key]: value } : v)),
    );
  }

  function addItemToVendor(vIdx) {
    setVendors((prev) =>
      prev.map((v, i) =>
        i === vIdx
          ? {
              ...v,
              items: [
                ...v.items,
                (() => {
                  const it = emptyItem();
                  it.sku = generateVisibleSku(
                    fields,
                    it,
                    specification.attributeDefinitions,
                  );
                  return it;
                })(),
              ],
            }
          : v,
      ),
    );
  }

  function saveCombinationVariant(vendorIndex, row, item, applyImagesToAll) {
    const savedItem = {
      ...item,
      _variantKey: row.key,
      combination_name: row.combinationName,
      attributes: { ...row.attributes },
    };
    const images = (item.images || []).filter((image) => String(image || "").trim());
    const matchingColor = String(row.attributes.color || "").trim().toLowerCase();

    setVendors((currentVendors) =>
      currentVendors.map((vendor, currentVendorIndex) => {
        const shouldApplyImages =
          applyImagesToAll && images.length > 0 && matchingColor;
        let found = false;
        const sourceItems = currentVendorIndex === vendorIndex
          ? vendor.items.filter(
              (currentItem) => currentItem._variantKey || currentItem.combination_name
            )
          : vendor.items;
        const items = sourceItems.map((currentItem) => {
          const matches =
            currentVendorIndex === vendorIndex &&
            (currentItem._variantKey === row.key ||
              (currentItem.combination_name === row.combinationName &&
                Object.entries(row.attributes).every(
                  ([key, value]) => String(currentItem.attributes?.[key] ?? "") === String(value)
                )));

          if (matches) {
            found = true;
            return savedItem;
          }
          const itemColor = String(currentItem.attributes?.color || "")
            .trim()
            .toLowerCase();
          return shouldApplyImages && itemColor === matchingColor
            ? { ...currentItem, images: [...images] }
            : currentItem;
        });

        if (currentVendorIndex === vendorIndex && !found) items.push(savedItem);
        return { ...vendor, items };
      })
    );

    if (applyImagesToAll && images.length > 0 && matchingColor) {
      setVariantImagesByColor((current) => ({
        ...current,
        [matchingColor]: images,
      }));
      setConfirmedImageColors((current) =>
        current.includes(matchingColor) ? current : [...current, matchingColor]
      );
    }
    toast.success(
      applyImagesToAll && matchingColor
        ? `Variant saved and images applied to ${row.attributes.color} variants`
        : "Variant saved"
    );
  }

  function updateItem(vIdx, itemIdx, key, value) {
    setVendors((prev) =>
      prev.map((v, i) => {
        if (i !== vIdx) return v;
        const items = v.items.map((it, j) => {
          if (j !== itemIdx) return it;
          let updated = { ...it, [key]: value };
          if (key === "sku") updated.skuManuallyEdited = true;
          // when changing combination_name, initialize attributes for that combination
          if (key === "combination_name") {
            const comb =
              (specification.combinations || []).find(
                (c) => c.name === value,
              ) || null;
            const attrs = {};
            ((comb && comb.attributes) || []).forEach((a) => {
              if (!a.key) return;
              const key = normalizeAttributeKey(a.key);
              const currentValue = it.attributes?.[key];
              attrs[key] = (a.values || []).includes(currentValue)
                ? currentValue
                : "";
            });
            updated = { ...updated, attributes: attrs };
          }
          if (key !== "sku" && !updated.skuManuallyEdited) {
            updated.sku = generateVisibleSku(
              fields,
              updated,
              specification.attributeDefinitions,
            );
          }
          return updated;
        });
        return { ...v, items };
      }),
    );
  }

  function findMatchingCombinationName(attributes, combinations, attributeDefinitions) {
    const defs = (attributeDefinitions || []).filter((attr) => {
      const key = String(attr.key || "").trim();
      const values = Array.isArray(attr.values) ? attr.values : [];
      return key && key.toLowerCase() !== "color" && values.length > 0;
    });

    if (!defs.length) return "";

    const hasAllValues = defs.every((attr) => {
      const value = attributes?.[attr.key];
      return value !== undefined && value !== null && String(value).trim();
    });

    if (!hasAllValues) return "";

    const match = (combinations || []).find((comb) =>
      defs.every((attr) => {
        const selected =
          comb.selectedValues && comb.selectedValues[attr.key] !== undefined
            ? comb.selectedValues[attr.key]
            : (comb.attributes || []).find((a) => a.key === attr.key)
                ?.values?.[0];

        return String(selected || "") === String(attributes[attr.key] || "");
      }),
    );

    return match?.name || "";
  }

  function updateItemAttribute(
    vIdx,
    itemIdx,
    attrKey,
    val,
    nextCombinations = specification.combinations,
    nextAttributeDefinitions = specification.attributeDefinitions,
  ) {
    setVendors((prev) =>
      prev.map((v, i) => {
        if (i !== vIdx) return v;

        const items = v.items.map((it, j) => {
          if (j !== itemIdx) return it;
          const formattedValue = formatAttributeValue(val);

          const attributes = {
            ...(it.attributes || {}),
            [attrKey]: formattedValue,
          };

          const updated = {
            ...it,
            attributes,
          };

          const matchingCombination = findMatchingCombinationName(
            attributes,
            nextCombinations,
            nextAttributeDefinitions,
          );

          updated.combination_name = it.combination_name || matchingCombination;

          updated.sku = generateVisibleSku(
            fields,
            updated,
            nextAttributeDefinitions,
          );

          return updated;
        });

        return {
          ...v,
          items,
        };
      }),
    );
  }

  function getAttributeDefinitionsWithValue(attributeDefinitions, attrKey, newValue) {
    const normalizedKey = normalizeAttributeKey(attrKey);
    const value = formatAttributeValue(newValue);

    if (!normalizedKey || !value) return attributeDefinitions || [];

    const defs = Array.from(attributeDefinitions || []);
    const idx = defs.findIndex(
      (attr) => normalizeAttributeKey(attr.key) === normalizedKey,
    );

    if (idx >= 0) {
      const existing = Array.isArray(defs[idx].values) ? defs[idx].values : [];
      defs[idx] = {
        ...defs[idx],
        key: defs[idx].key || normalizedKey,
        values: Array.from(new Set([...existing, value])),
        input: "",
      };
      return defs;
    }

    return [...defs, { key: normalizedKey, icon: "", values: [value], input: "" }];
  }

  function addSpecificationValueFromItem(vIdx, itemIdx, attrKey, newValue) {
    const value = formatAttributeValue(newValue);
    if (!attrKey || !value) return;

    const nextAttributeDefinitions = getAttributeDefinitionsWithValue(
      specification.attributeDefinitions || [],
      attrKey,
      value,
    );
    const validDefs = nextAttributeDefinitions.filter((attr) => {
      const key = String(attr.key || "").trim();
      const values = Array.isArray(attr.values) ? attr.values : [];
      return key && values.length > 0;
    });
    const nextCombinations = validDefs.length
      ? buildGeneratedCombinations(validDefs)
      : [];

    setSpecification((prev) => ({
      ...prev,
      attributeDefinitions: nextAttributeDefinitions,
      combinations: nextCombinations,
    }));

    updateItemAttribute(
      vIdx,
      itemIdx,
      normalizeAttributeKey(attrKey),
      value,
      nextCombinations,
      nextAttributeDefinitions,
    );
  }
  function saveItemAttributeValue(vIdx, itemIdx, attrKey) {
    const item = vendors?.[vIdx]?.items?.[itemIdx];
    if (!item) return;

    const combName = item.combination_name;
    const val = item.attributes?.[attrKey];

    if (!combName || !attrKey || !val) return;

    addValueToCombination(combName, attrKey, val);
  }

  function addValueToCombination(combName, attrKey, newValue) {
    const value = formatAttributeValue(newValue);
    if (!combName || !attrKey || !value) return;
    setSpecification((prev) => {
      const combos = Array.from(prev.combinations || []);
      let found = false;
      const next = combos.map((c) => {
        if (c.name !== combName) return c;
        found = true;
        const attrs = Array.from(c.attributes || []);
        const ai = attrs.findIndex((a) => a.key === attrKey);
        if (ai >= 0) {
          const vals = Array.from(
            new Set([...(attrs[ai].values || []), value]),
          );
          attrs[ai] = { ...attrs[ai], values: vals };
        } else {
          attrs.push({ key: attrKey, values: [value] });
        }
        return { ...c, attributes: attrs };
      });
      if (!found) {
        // create the combination if it doesn't exist
        next.push({
          name: combName,
          attributes: [{ key: attrKey, values: [value] }],
          include_colors: false,
        });
      }
      return { ...prev, combinations: next };
    });
  }

  function addColorCodeFromVariant(name, hex) {
    const colorName = formatAttributeValue(name);
    if (!colorName) return;
    setSpecification((prev) => {
      const exists = (prev.color_codes || []).some(
        (cc) => formatAttributeValue(cc.name) === colorName,
      );
      const color_codes = exists
        ? prev.color_codes
        : [
            ...(prev.color_codes || []),
            { name: colorName, hex: hex || "#000000", description: "" },
          ];
      return { ...prev, color_codes };
    });
  }

  function addItemAttribute(vIdx, itemIdx) {
    setVendors((prev) =>
      prev.map((v, i) => {
        if (i !== vIdx) return v;
        const items = v.items.map((it, j) => {
          if (j !== itemIdx) return it;
          const nextKey = `custom_${Date.now().toString(36).slice(2, 8)}`;
          const attributes = { ...(it.attributes || {}), [nextKey]: "" };
          const updated = { ...it, attributes };
          updated.sku = generateVisibleSku(
            fields,
            updated,
            specification.attributeDefinitions,
          );
          return updated;
        });
        return { ...v, items };
      }),
    );
  }

  function updateItemAttributeKey(vIdx, itemIdx, oldKey, newKey) {
    const normalizedNewKey = normalizeAttributeKeyInput(newKey);
    if (!normalizedNewKey) return; // don't allow empty
    setVendors((prev) =>
      prev.map((v, i) => {
        if (i !== vIdx) return v;
        const items = v.items.map((it, j) => {
          if (j !== itemIdx) return it;
          const attrs = { ...(it.attributes || {}) };
          if (!(oldKey in attrs)) return it;
          const val = attrs[oldKey];
          delete attrs[oldKey];
          attrs[normalizedNewKey] = val;
          const updated = { ...it, attributes: attrs };
          updated.sku = generateVisibleSku(
            fields,
            updated,
            specification.attributeDefinitions,
          );
          return updated;
        });
        return { ...v, items };
      }),
    );
    // add new key/value to specification if applicable
    const combName =
      (vendors[vIdx] &&
        vendors[vIdx].items &&
        vendors[vIdx].items[itemIdx] &&
        vendors[vIdx].items[itemIdx].combination_name) ||
      null;
    const val =
      (vendors[vIdx] &&
        vendors[vIdx].items &&
        vendors[vIdx].items[itemIdx] &&
        vendors[vIdx].items[itemIdx].attributes &&
        vendors[vIdx].items[itemIdx].attributes[oldKey]) ||
      undefined;
    if (combName && val) addValueToCombination(combName, newKey, val);
  }

  function finalizeItemAttributeKey(vIdx, itemIdx, oldKey) {
    const normalizedNewKey = normalizeAttributeKey(oldKey);
    if (!normalizedNewKey || normalizedNewKey === oldKey) return;
    updateItemAttributeKey(vIdx, itemIdx, oldKey, normalizedNewKey);
  }

  function removeItemAttribute(vIdx, itemIdx, key) {
    setVendors((prev) =>
      prev.map((v, i) => {
        if (i !== vIdx) return v;
        const items = v.items.map((it, j) => {
          if (j !== itemIdx) return it;
          const attrs = { ...(it.attributes || {}) };
          delete attrs[key];
          const updated = { ...it, attributes: attrs };
          updated.sku = generateVisibleSku(
            fields,
            updated,
            specification.attributeDefinitions,
          );
          return updated;
        });
        return { ...v, items };
      }),
    );
  }

  function removeVendor(idx) {
    setVendors((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeItem(vIdx, itemIdx) {
    setVendors((prev) =>
      prev.map((v, i) => {
        if (i !== vIdx) return v;
        const items = v.items.filter((_, j) => j !== itemIdx);
        return { ...v, items: items.length ? items : [emptyItem()] };
      }),
    );
  }

  function addColorCode() {
    setSpecification((prev) => ({
      ...prev,
      color_codes: [...prev.color_codes, { name: "", hex: "", description: "" }],
    }));
  }

  function updateColorCode(idx, key, value) {
    setSpecification((prev) => ({
      ...prev,
      color_codes: prev.color_codes.map((c, i) => {
        if (i !== idx) return c;

        const updatedColor = {
          ...c,
          [key]: value,
        };

        if (!updatedColor.hex) {
          updatedColor.hex = "#000000";
        }

        return updatedColor;
      }),
    }));
  }

  function removeColorCode(idx) {
    setSpecification((prev) => ({
      ...prev,
      color_codes: prev.color_codes.filter((_, i) => i !== idx),
    }));
  }

  function addColorCodesFromText(rawValue) {
    const trimmed = (rawValue || "").trim();
    if (!trimmed) return;

    const normalizedValue = trimmed.startsWith("color_codes")
      ? trimmed.replace(/^color_codes\s*:\s*/, "")
      : trimmed;

    try {
      const parsed = JSON.parse(normalizedValue);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return;
      }

      const nextColorCodes = Object.entries(parsed)
        .filter(([, value]) => typeof value === "string")
        .map(([name, hex]) => ({
          name: String(name).trim(),
          hex: normalizeHexColor(hex),
          description: "",
        }));

      if (!nextColorCodes.length) return;

      setSpecification((prev) => ({
        ...prev,
        color_codes: [...(prev.color_codes || []), ...nextColorCodes],
      }));
    } catch {
      // ignore invalid input
    }
  }

  function buildGeneratedCombinations(attributeDefinitions = []) {
    const defs = (attributeDefinitions || []).filter((attr) => {
      const key = String(attr.key || "").trim();
      const values = Array.isArray(attr.values) ? attr.values : [];
      return key && values.length > 0;
    });

    if (!defs.length) return [];

    const colorAttribute = defs.find(
      (attr) => normalizeAttributeKey(attr.key) === "color",
    );
    const commonAttribute =
      colorAttribute && colorAttribute.values.length >= 2
        ? colorAttribute
        : defs.reduce((largest, attribute) =>
            attribute.values.length > largest.values.length
              ? attribute
              : largest,
          );
    const combinationDefs = defs.filter(
      (attribute) => attribute !== commonAttribute,
    );
    const valueGroups = combinationDefs.map((attribute) =>
      attribute.values
        .map((value) => String(value).trim())
        .filter(Boolean),
    );
    const generated = [];

    const walk = (prefix = [], depth = 0) => {
      if (depth === valueGroups.length) {
        generated.push(prefix);
        return;
      }

      valueGroups[depth].forEach((value) =>
        walk([...prefix, value], depth + 1),
      );
    };

    walk();

    return generated.map((values, index) => {
      const attributes = [
        {
          key: commonAttribute.key,
          values: [...commonAttribute.values],
        },
      ];

      combinationDefs.forEach((attribute, attributeIndex) => {
        attributes.push({
          key: attribute.key,
          values: [values[attributeIndex]],
        });
      });

      const selectedValues = {};
      attributes.forEach((attribute) => {
        selectedValues[attribute.key] =
          attribute === attributes[0]
            ? [...attribute.values]
            : attribute.values[0];
      });

      return {
        name: `combination_${index + 1}`,
        attributes,
        selectedValues,
        include_colors: false,
      };
    });
  }

  function updateAttributeDefinitions(updater) {
    setSpecification((prev) => {
      const nextAttributeDefinitions = updater(prev.attributeDefinitions || []);

      return {
        ...prev,
        attributeDefinitions: nextAttributeDefinitions || [],
      };
    });
  }

  function updateCombinations(updater) {
    setSpecification((prev) => {
      const previousCombinations = prev.combinations || [];
        const combinations = updater(previousCombinations) || [];
      const previousNames = new Set(
        previousCombinations
          .map((combination) => combination?.name)
          .filter(Boolean),
      );
      const nextNames = new Set(
        combinations.map((combination) => combination?.name).filter(Boolean),
      );
      const removedCombinationNames = Array.from(previousNames).filter(
        (name) => !nextNames.has(name),
      );

      if (removedCombinationNames.length) {
        setVendors((currentVendors) =>
          currentVendors.map((vendor) => ({
            ...vendor,
            items: (vendor.items || []).filter(
              (item) => !removedCombinationNames.includes(item?.combination_name),
            ),
          })),
        );
      }

      const valuesByKey = combinations.reduce((acc, combination) => {
        (combination.attributes || []).forEach((attribute) => {
          const key = normalizeAttributeKey(attribute.key);
          if (!key) return;
          if (!acc[key]) acc[key] = new Set();
          (attribute.values || []).forEach((value) => {
            const formattedValue = formatAttributeValue(value);
            if (formattedValue) acc[key].add(formattedValue);
          });
        });
        return acc;
      }, {});
      const existingDefinitions = prev.attributeDefinitions || [];
      const existingKeys = new Set(
        existingDefinitions.map((attribute) =>
          normalizeAttributeKey(attribute.key),
        ),
      );
      const addedDefinitions = Object.entries(valuesByKey)
        .filter(([key]) => !existingKeys.has(key))
        .map(([key, values]) => ({
          key,
          icon: "",
          values: Array.from(values),
          input: "",
        }));
      const attributeDefinitions = existingDefinitions.map((attribute) => {
        const key = normalizeAttributeKey(attribute.key);
        const combinationValues = valuesByKey[key];
        if (!combinationValues) return attribute;
        return {
          ...attribute,
          values: Array.from(
            new Set([...(attribute.values || []), ...combinationValues]),
          ),
        };
      });

      return {
        ...prev,
        combinations,
        attributeDefinitions: [...attributeDefinitions, ...addedDefinitions],
      };
    });
  }

  function addCombinationsFromAttributes() {
    const generated = buildGeneratedCombinations(
      specification.attributeDefinitions || [],
    );

    if (!generated.length) {
      toast.error("Add attributes and values before generating combinations");
      return;
    }

    updateCombinations(() => generated);
    toast.success(
      `${generated.length} combination${generated.length === 1 ? "" : "s"} regenerated from scratch`,
    );
  }

  function addAttributeDefinition() {
    updateAttributeDefinitions((prev) => [
      ...(prev || []),
      { key: "", icon: "", values: [], input: "" },
    ]);
  }

  function updateAttributeDefinitionKey(idx, newKey) {
    const normalizedKey = normalizeAttributeKeyInput(newKey);
    updateAttributeDefinitions((prev) =>
      (prev || []).map((attr, i) =>
        i === idx ? { ...attr, key: normalizedKey } : attr,
      ),
    );
  }

  function finalizeAttributeDefinitionKey(idx, key) {
    updateAttributeDefinitions((prev) =>
      (prev || []).map((attr, i) =>
        i === idx ? { ...attr, key: normalizeAttributeKey(key) } : attr,
      ),
    );
  }

  function updateAttributeDefinitionInput(idx, inputValue) {
    updateAttributeDefinitions((prev) =>
      (prev || []).map((attr, i) =>
        i === idx ? { ...attr, input: inputValue } : attr,
      ),
    );
  }

  function updateAttributeDefinitionIcon(idx, icon) {
    updateAttributeDefinitions((prev) =>
      (prev || []).map((attr, i) =>
        i === idx ? { ...attr, icon } : attr,
      ),
    );
  }

  function addAttributeDefinitionValue(idx, explicitValue) {
    updateAttributeDefinitions((prev) =>
      (prev || []).map((attr, i) => {
        if (i !== idx) return attr;
        const source = explicitValue !== undefined ? explicitValue : attr.input || "";
        const parts = String(source)
          .split(/,|\n/)
          .map((s) => formatAttributeValue(s))
          .filter(Boolean);
        const existing = Array.isArray(attr.values) ? attr.values : [];
        const merged = Array.from(new Set([...existing, ...parts]));
        return { ...attr, values: merged, input: "" };
      }),
    );
  }

  function removeAttributeDefinitionValue(idx, valueIdx) {
    const value = specification.attributeDefinitions?.[idx]?.values?.[valueIdx];
    if (value) removeOptionDescriptionForValue(value);
    updateAttributeDefinitions((prev) =>
      (prev || []).map((attr, i) => {
        if (i !== idx) return attr;
        const values = (attr.values || []).filter((_, currentIdx) => currentIdx !== valueIdx);
        return { ...attr, values };
      }),
    );
  }

  function removeAttributeDefinition(idx) {
    removeOptionDescriptionsForValues(
      specification.attributeDefinitions?.[idx]?.values || [],
    );
    updateAttributeDefinitions((prev) => (prev || []).filter((_, i) => i !== idx));
  }
const isEmptyObject = (obj) =>
  !obj || Object.keys(obj).length === 0;

const isEmptyArray = (arr) =>
  !arr || arr.length === 0;
  function buildPreviewPayload() {
    const fields = fieldsRef.current;
    const vendors = vendorsRef.current;
    const specification = specificationRef.current;
    const questions = questionsRef.current;
    const whatsInTheBox = whatsInTheBoxRef.current;
    const optionDescriptions = optionDescriptionsRef.current;
    const description = descriptionRef.current;

    const vendorsNormalized = vendors.map((v) => ({
      name: v.name || undefined,
      vendor_note: v.vendor_note || undefined,
      items: v.items.map((it) => ({
        sku: it.sku || undefined,
        combination_name: it.combination_name || undefined,
        attributes:
          it.attributes && Object.keys(it.attributes || {}).length
            ? it.attributes
            : undefined,
        weight: it.weight ? Number(it.weight) : undefined,
        stocks: it.stocks ? Number(it.stocks) : undefined,
        mrp: it.mrp ? Number(it.mrp) : undefined,
        price: it.price ? Number(it.price) : undefined,
        sell_price: it.sell_price ? Number(it.sell_price) : undefined,
        rating: it.rating ? Number(it.rating) : undefined,
        rating_count: it.rating_count ? Number(it.rating_count) : undefined,
        sell: !!it.sell,
        yt_iframe: it.yt_iframe || undefined,
        images: Array.isArray(it.images) && it.images.some(isValidImageUrl)
          ? it.images
              .map((url) => String(url || "").trim())
              .filter(isValidImageUrl)
          : undefined,
      })),
    }));
    const hasSellableItem = vendorsNormalized.some((vendor) =>
      (vendor.items || []).some((item) => !!item.sell),
    );

    const makeObjFromArr = (arr) =>
      (arr || []).reduce((acc, f) => {
        const key = formatDescriptionKey(f?.key);
        if (key) {
          if (f.valueType === "multiple") {
            acc[key] = String(f.value || "")
              .split(/\r?\n/)
              .map((value) => parseNumberIfPossible(value))
              .filter((value) => value !== "");
          } else {
            acc[key] = parseNumberIfPossible(f.value);
          }
        }
        return acc;
      }, {});

    const descriptionNormalized = {
      summary: description.summary || undefined,
    };
    Object.keys(description).forEach((k) => {
      if (k === "summary") return;
      descriptionNormalized[formatDescriptionKey(k)] = makeObjFromArr(description[k]);
    });

    const images = fields.imagesText
      ? fields.imagesText
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const whatsInTheBoxNormalized = (whatsInTheBox || [])
      .map((item) => ({
        image_url: String(item.image_url || "").trim(),
        label: String(item.label || "").trim(),
      }))
      .filter((item) => item.image_url || item.label);
    const currentAttributeValues = new Set(
      (specification.attributeDefinitions || []).flatMap((attr) =>
        (attr.values || []).map((value) => formatAttributeValue(value)),
      ),
    );
    const optionDescriptionsNormalized = (optionDescriptions || []).reduce(
      (acc, item) => {
        const option = formatAttributeValue(item.option);
        const descriptionText = String(item.description || "").trim();
        if (option && currentAttributeValues.has(option) && descriptionText) {
          acc[option] = descriptionText;
        }
        return acc;
      },
      {},
    );
    const configurationIconsNormalized = (
      specification.attributeDefinitions || []
    ).reduce((acc, attr) => {
      const key = formatAttributeDisplayName(attr.key);
      const icon = String(attr.icon || "").trim();
      if (key && icon) acc[key] = icon;
      return acc;
    }, {});
    const isPreOrder = fields.category_name === "Pre Orders";
    const isCd = isCdCategory(fields.category_name);

    const vendorsTransformed = (vendorsNormalized || []).reduce(
      (acc, vendor, vi) => {
        const vendorKey = `VENDOR_${String(vi + 1).padStart(3, "0")}`;
        const combination_offered = (vendor.items || []).reduce(
          (cAcc, it) => {
            const combName = it.combination_name || "combination_1";
            if (!cAcc[combName]) cAcc[combName] = {};
            const itemIndex = Object.keys(cAcc[combName]).length + 1;
            const itemKey = `item_${itemIndex}`;
            const itemObj = {
              sell_price: it.sell_price || 0,
              sell: !!it.sell,
              sku: it.sku || undefined,
              weight: it.weight || 0,
              mrp: it.mrp || 0,
              price: it.price || 0,
              rating: it.rating || 0,
              rating_count: it.rating_count || 0,
              yt_iframe: it.yt_iframe || undefined,
              images: (it.images || []).map(toCDN),
              stocks: it.stocks || 0,
            };
            if (it.attributes && Object.keys(it.attributes || {}).length) {
              Object.keys(it.attributes).forEach((attrKey) => {
                if (!(attrKey in itemObj)) {
                  itemObj[normalizeAttributeKey(attrKey)] = it.attributes[attrKey];
                }
              });
            }
            cAcc[combName][itemKey] = itemObj;
            return cAcc;
          },
          {},
        );

        acc[vendorKey] = {
          vendor_id: vendorKey,
          name: vendor.name || undefined,
          ratings: 0,
          total_sales: 0,
          combination_offered,
          vendor_note: vendor.vendor_note || undefined,
        };
        return acc;
      },
      {},
    );
    const cdVendorsTransformed = (vendorsNormalized || []).reduce(
      (acc, vendor, vi) => {
        const vendorKey = `VENDOR_${String(vi + 1).padStart(3, "0")}`;
        const combination_offered = (vendor.items || []).reduce(
          (cAcc, it) => {
            if (!cAcc.combination_1) cAcc.combination_1 = {};
            const itemKey = `item_${Object.keys(cAcc.combination_1).length + 1}`;

            cAcc.combination_1[itemKey] = {
              sell_price: it.sell_price || 0,
              sell: !!it.sell,
              sku: getCdSku(fields.product_title),
              weight: it.weight || 0,
              mrp: it.mrp || (fields.mrp ? Number(fields.mrp) : 0),
              price: it.price || (fields.price ? Number(fields.price) : 0),
              rating: it.rating || 0,
              rating_count: it.rating_count || 0,
              yt_iframe: it.yt_iframe || undefined,
              images: (it.images || []).map(toCDN),
              stocks: it.stocks || 0,
            };
            return cAcc;
          },
          {},
        );

        acc[vendorKey] = {
          vendor_id: vendorKey,
          name: vendor.name || undefined,
          ratings: 0,
          total_sales: 0,
          combination_offered,
          vendor_note: vendor.vendor_note || undefined,
        };
        return acc;
      },
      {},
    );
    const inStock = (vendorsNormalized || []).some((vendor) =>
      (vendor.items || []).some((item) => Number(item.stocks) > 0),
    );
    const preOrderVendorsTransformed = (vendorsNormalized || []).reduce(
      (acc, vendor, vi) => {
        const vendorKey = `VENDOR_${String(vi + 1).padStart(3, "0")}`;
        const combination_offered = (vendor.items || []).reduce(
          (cAcc, it) => {
            if (!cAcc.combination_1) cAcc.combination_1 = {};
            const itemKey = `item_${Object.keys(cAcc.combination_1).length + 1}`;

            cAcc.combination_1[itemKey] = {
              sku: getPreOrderSku(fields.product_title, fields.spec_id),
              mrp: it.mrp || (fields.mrp ? Number(fields.mrp) : 0),
              price: it.price || (fields.price ? Number(fields.price) : 0),
              sell: !!it.sell,
              sell_price: it.sell_price || 0,
              weight: it.weight || 0,
              stocks: it.stocks || 0,
              rating: 0,
              rating_count: 0,
              images: (it.images || []).map(toCDN),
            };
            return cAcc;
          },
          {},
        );

        acc[vendorKey] = {
          vendor_id: vendorKey,
          name: vendor.name || undefined,
          ratings: 0,
          total_sales: 0,
          vendor_note: vendor.vendor_note || "",
          combination_offered,
        };
        return acc;
      },
      {},
    );
    let finalOptionDescriptions = optionDescriptionsNormalized;
    let finalConfigurationIcons = configurationIconsNormalized;
    if (isEmptyObject(finalOptionDescriptions)) {
      switch (fields.category_name) {
        case "Smartphones":
          finalOptionDescriptions = phoneOptionsDesc;
          break;

        case "Laptops":
          finalOptionDescriptions = laptopOptionsDesc;
          break;

        default:
          finalOptionDescriptions = {};
      }
    }
    if (isEmptyObject(finalConfigurationIcons)) {
      switch (fields.category_name) {
        case "Cameras":
          finalConfigurationIcons = cameraConfigurationIcons;
          break;

        default:
          finalConfigurationIcons = configurationIcons;
      }
    }

    const payload = {
      spec_id: fields.spec_id || undefined,
      specifications_doc: {
        spec_id: fields.spec_id || undefined,
        whats_in_the_box: isEmptyArray(whatsInTheBoxNormalized)
          ? []
          : whatsInTheBoxNormalized,
        option_descriptions: finalOptionDescriptions,
        configuration_icons: finalConfigurationIcons,
        color_codes: (specification.color_codes || []).reduce((acc, color) => {
          const colorName = formatAttributeValue(color?.name);
          if (colorName) {
            acc[colorName] = color.hex || "#000000";
          }
          return acc;
        }, {}),
        combination: (specification.combinations || [])
          .filter(hasValidCombinationAttributes)
          .reduce((acc, c) => {
            const key =
              c.name || `combination_${Math.random().toString(36).slice(2, 8)}`;
            const obj = {};
            (c.attributes || []).forEach((a) => {
              if (!a.key) return;
              obj[normalizeAttributeKey(a.key)] = a.values || [];
            });
            if (c.include_colors)
              obj.color = (specification.color_codes || []).map((cc) => ({
                name: formatAttributeValue(cc.name),
                hex: cc.hex,
              }));
            acc[key] = obj;
            return acc;
          }, {}),
        description: descriptionNormalized,
        minimum_price: fields.minimum_price ? Number(fields.minimum_price) : 0,
        questions: (function () {
          return (questions || []).reduce((acc, q, i) => {
            const key = `q${i + 1}`;
            if (q.type === "radio" || q.type === "dropdown") {
              acc[key] = {
                question: q.question || "",
                type: q.type,
                isRequired: !!q.isRequired,
                description: q.description || "",
                deduction: Number(q.deduction) || 0,
                options: (q.options || []).map((o) =>
                  typeof o === "string" ? o : o.label,
                ),
              };
            } else {
              acc[key] = {
                question: q.question || "",
                type: q.type,
                isRequired: !!q.isRequired,
                description: q.description || "",
                options: (q.options || []).map((o) =>
                  typeof o === "string"
                    ? { label: o }
                    : {
                        label: o.label,
                        deduction: Number(o.deduction) || 0,
                        icon: o.icon || undefined,
                      },
                ),
              };
            }
            return acc;
          }, {});
        })(),
      },
      inventory_doc: {
        spec_id: fields.spec_id || undefined,
        product_title: fields.product_title || undefined,
        code: fields.code || undefined,
        ...(fields.brand?.trim() && { brand: fields.brand.trim() }),
        category_name: fields.category_name || undefined,
        condition: fields.condition || undefined,
        mrp: fields.mrp ? Number(fields.mrp) : 0,
        price: fields.price ? Number(fields.price) : 0,
        rating: fields.rating ? Number(fields.rating) : 0,
        rating_count: fields.rating_count ? Number(fields.rating_count) : 0,
        sell: !!fields.sell || hasSellableItem,
        sell_max_price: fields.sell_max_price ? Number(fields.sell_max_price) : 0,
        ...(fields.type?.trim() && { type: fields.type.trim() }),
        in_stock: inStock,
        yt_iframe: fields.yt_iframe || undefined,
        vendors: vendorsTransformed,
      },
    };
    const preOrderPayload = {
      spec_id: fields.spec_id || undefined,
      inventory_doc: {
        spec_id: fields.spec_id || undefined,
        product_title: fields.product_title || undefined,
        code: fields.code || undefined,
        ...(fields.brand?.trim() && { brand: fields.brand.trim() }),
        category_name: "Pre Order",
        condition: "Pre Order",
        mrp: fields.mrp ? Number(fields.mrp) : 0,
        price: fields.price ? Number(fields.price) : 0,
        sell: !!fields.sell || hasSellableItem,
        sell_max_price: fields.sell_max_price ? Number(fields.sell_max_price) : 0,
        release_date: fields.release_date || undefined,
        in_stock: inStock,
        yt_iframe: fields.yt_iframe || undefined,
        description: removeEmptyDescriptionSections(descriptionNormalized),
        vendors: preOrderVendorsTransformed,
      },
    };
    const cdPayload = {
      spec_id: fields.spec_id || undefined,
      inventory_doc: {
        spec_id: fields.spec_id || undefined,
        product_title: fields.product_title || undefined,
        code: fields.code || undefined,
        category_name: fields.category_name || undefined,
        condition: fields.condition || undefined,
        mrp: fields.mrp ? Number(fields.mrp) : 0,
        price: fields.price ? Number(fields.price) : 0,
        sell: !!fields.sell || hasSellableItem,
        sell_max_price: fields.sell_max_price ? Number(fields.sell_max_price) : 0,
        in_stock: inStock,
        yt_iframe: fields.yt_iframe || undefined,
        description: removeEmptyDescriptionSections(descriptionNormalized),
        vendors: cdVendorsTransformed,
      },
    };

    return keepPayloadKeys(
      isPreOrder ? preOrderPayload : isCd ? cdPayload : payload,
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const payloadWithAllKeys = buildPreviewPayload();
      console.log("Inventory payload preview:", payloadWithAllKeys);
      setPreviewPayload(payloadWithAllKeys);
      setResp(payloadWithAllKeys);
      toast.success("Inventory preview generated successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add product";
      setResp({ error: message });
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  function handlePreview(e) {
    e.preventDefault();
    void handleSubmit(e);
  }

  async function handleFinalSubmit() {
    if (!previewPayload) return;

    setSending(true);
    try {
      // const response = await addProductToInventory(previewPayload);
      // setResp(response);
      setPreviewPayload(null);
      toast.success("Product added successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add product";
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  function handleReset() {
    setFields({
      brand: "",
      category_name: "",
      code: "",
      condition: "",
      mrp: "",
      price: "",
      product_title: "",
      rating: "",
      rating_count: "",
      sell: false,
      sell_max_price: "",
      minimum_price: "",
      spec_id: "",
      release_date: "",
      yt_iframe: "",
      type: "",
      imagesText: "",
    });
    setVendors([
      {
        name: "Dacby Technologies Pvt. Ltd.",
        vendor_note: "",
        items: [emptyItem()],
      },
    ]);
    setSpecification({
      color_codes: [],
      combinations: [],
      attributeDefinitions: [],
    });
    setVariantImagesByColor({});
    setConfirmedImageColors([]);
    resetQuestions();
    resetWhatsInTheBox();
    resetOptionDescriptions();
    resetDescription();
    setResp(null);
    setPreviewPayload(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 [color-scheme:light]">
      <style jsx global>{`
        select,
        select option,
        select optgroup {
          background-color: #ffffff !important;
          color: #0f172a !important;
          color-scheme: light !important;
        }
      `}</style>
      <div className="mx-auto max-w-6xl rounded-2xl border border-cyan-100 bg-white p-6 shadow-xl shadow-cyan-100/60 [&_.bg-indigo-50]:!bg-cyan-50 [&_.bg-indigo-100]:!bg-cyan-100 [&_.bg-slate-50]:!bg-slate-50 [&_.bg-slate-100]:!bg-slate-100 [&_.bg-slate-200]:!bg-slate-200 [&_.bg-white]:!bg-white [&_.border-indigo-200]:!border-cyan-200 [&_.border-rose-200]:!border-pink-200 [&_.border-slate-200]:!border-slate-200 [&_.text-indigo-700]:!text-cyan-700 [&_.text-indigo-800]:!text-cyan-800 [&_.text-indigo-900]:!text-cyan-900 [&_.text-rose-700]:!text-pink-700 [&_.text-slate-500]:!text-slate-500 [&_.text-slate-700]:!text-slate-700 [&_.text-slate-800]:!text-slate-800 [&_.text-slate-900]:!text-slate-900 [&_.text-slate-950]:!text-slate-950 [&_button:hover]:!bg-cyan-50">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-950">
          Add Product
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 [color-scheme:light] [&_*]:[color-scheme:light] [&_button]:transition [&_input:not([type='checkbox']):not([type='color'])]:rounded-lg [&_input:not([type='checkbox']):not([type='color'])]:!border-slate-200 [&_input:not([type='checkbox']):not([type='color'])]:!bg-white [&_input:not([type='checkbox']):not([type='color'])]:text-sm [&_input:not([type='checkbox']):not([type='color'])]:!text-slate-900 [&_input:not([type='checkbox']):not([type='color'])]:shadow-sm [&_input:not([type='checkbox']):not([type='color'])]:transition [&_input:not([type='checkbox']):not([type='color'])]:placeholder:text-slate-400 [&_input:not([type='checkbox']):not([type='color'])]:focus:!border-cyan-500 [&_input:not([type='checkbox']):not([type='color'])]:focus:outline-none [&_input:not([type='checkbox']):not([type='color'])]:focus:ring-2 [&_input:not([type='checkbox']):not([type='color'])]:focus:ring-cyan-100 [&_label]:!text-slate-700 [&_option]:!bg-white [&_option]:!text-slate-900 [&_optgroup]:!bg-white [&_optgroup]:!text-slate-900 [&_select]:[color-scheme:light] [&_select]:rounded-lg [&_select]:!border-slate-200 [&_select]:!bg-white [&_select]:text-sm [&_select]:!text-slate-900 [&_select]:shadow-sm [&_select]:transition [&_select]:focus:!border-cyan-500 [&_select]:focus:outline-none [&_select]:focus:ring-2 [&_select]:focus:ring-cyan-100 [&_textarea]:rounded-lg [&_textarea]:!border-slate-200 [&_textarea]:!bg-white [&_textarea]:text-sm [&_textarea]:!text-slate-900 [&_textarea]:shadow-sm [&_textarea]:transition [&_textarea]:placeholder:text-slate-400 [&_textarea]:focus:!border-cyan-500 [&_textarea]:focus:outline-none [&_textarea]:focus:ring-2 [&_textarea]:focus:ring-cyan-100"
        >
          <ProductFields fields={fields} setField={setField} />

          {/* vendors moved below specification (rendered after Specification section) */}

          <QuestionsSection
            questions={questions}
            addQuestion={addQuestion}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
            addOption={addOption}
            updateOption={updateOption}
            removeOption={removeOption}
          />

          <DescriptionEditor
            description={description}
            value={description}
            onChange={setDescription}
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

          <WhatsInTheBoxSection
            whatsInTheBox={whatsInTheBox}
            addBoxItem={addBoxItem}
            updateBoxItem={updateBoxItem}
            removeBoxItem={removeBoxItem}
          />

          <SpecificationSection
            specification={specification}
            addColorCode={addColorCode}
            updateColorCode={updateColorCode}
            removeColorCode={removeColorCode}
            addColorCodesFromText={addColorCodesFromText}
            addAttributeDefinition={addAttributeDefinition}
            updateAttributeDefinitionKey={updateAttributeDefinitionKey}
            finalizeAttributeDefinitionKey={finalizeAttributeDefinitionKey}
            updateAttributeDefinitionIcon={updateAttributeDefinitionIcon}
            removeAttributeDefinition={removeAttributeDefinition}
            removeAttributeDefinitionValue={removeAttributeDefinitionValue}
            getOptionDescription={getOptionDescription}
            updateOptionDescriptionForValue={updateOptionDescriptionForValue}
            updateAttributeDefinitionInput={updateAttributeDefinitionInput}
            addAttributeDefinitionValue={addAttributeDefinitionValue}
            updateCombinations={updateCombinations}
            addCombinationsFromAttributes={addCombinationsFromAttributes}
          />

          <VendorsSection
            vendors={vendors}
            specification={specification}
            addVendor={addVendor}
            updateVendor={updateVendor}
            removeVendor={removeVendor}
            addItemToVendor={addItemToVendor}
            removeItem={removeItem}
            updateItem={updateItem}
            updateItemAttribute={updateItemAttribute}
            addSpecificationValueFromItem={addSpecificationValueFromItem}
            addColorCodeFromVariant={addColorCodeFromVariant}
            addValueToCombination={addValueToCombination}
            updateItemAttributeKey={updateItemAttributeKey}
            finalizeItemAttributeKey={finalizeItemAttributeKey}
            saveItemAttributeValue={saveItemAttributeValue}
            removeItemAttribute={removeItemAttribute}
            addItemAttribute={addItemAttribute}
            fields={fields}
            sharedImagesByColor={variantImagesByColor}
            confirmedImageColors={confirmedImageColors}
            onSaveVariant={saveCombinationVariant}
          />

          <FormActions sending={sending} onPreview={handlePreview} onReset={handleReset} />
        </form>

        <ResponsePreview
          resp={resp}
          isPreview={Boolean(previewPayload)}
          sending={sending}
          onFinalSubmit={handleFinalSubmit}
        />
      </div>
    </div>
  );
}
