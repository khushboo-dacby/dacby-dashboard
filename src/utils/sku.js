import { normalizeAttributeKey } from "./formatters";

function slugify(s) {
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-")
    // collapse hyphen between number and common unit suffixes (e.g. "4-gb" -> "4gb")
    // Prevents collapsing generic spec-id patterns like "2018-a1932"
    .replace(/(\d)-(?=(?:gb|tb|mb|kb|g|m|w|hz|mhz|wh)\b)/g, "$1")
    .replace(/(^-|-$)/g, "");
}

function makeSkuPart(value) {
  if (!value) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSelectedAttribute(attributes, possibleNames) {
  const entries = Object.entries(attributes || {});
  for (const possibleName of possibleNames) {
    const normalizedName = normalizeAttributeKey(possibleName).replaceAll("_", "");
    const match = entries.find(
      ([key]) => normalizeAttributeKey(key).replaceAll("_", "") === normalizedName,
    );
    if (match) return match[1];
  }
  return "";
}

function getAddVariantPhysicalCondition(value) {
  const condition = String(value || "").trim().toLowerCase();
  if (condition.includes("very light mark")) return "no-visible-mark";
  if (condition.includes("light mark")) return "visible-mark";
  return makeSkuPart(value);
}

function getAddVariantBatteryLevel(value) {
  const batteryHealth = String(value || "").trim().toLowerCase();
  if (
    (batteryHealth.includes("90") && batteryHealth.includes("100")) ||
    (batteryHealth.includes("85") && batteryHealth.includes("100"))
  ) {
    return "high";
  }
  if (
    (batteryHealth.includes("80") && batteryHealth.includes("89")) ||
    (batteryHealth.includes("75") && batteryHealth.includes("84"))
  ) {
    return "low";
  }
  return makeSkuPart(value);
}

function getAddVariantShutterLevel(value) {
  const shutterCount = String(value || "").trim().toLowerCase();
  if (shutterCount.includes("less than 10k")) return "low";
  if (shutterCount.includes("10k") && shutterCount.includes("1l")) {
    return "medium";
  }
  if (shutterCount.includes("above 1l")) return "high";
  return makeSkuPart(value);
}

function generateCategorySku(specId, attributes, categoryName, categoryCode) {
  const parts = [makeSkuPart(specId)];
  const storage = getSelectedAttribute(attributes, ["storage"]);
  const ram = getSelectedAttribute(attributes, ["ram"]);
  const color = getSelectedAttribute(attributes, ["color"]);
  const physicalCondition = getSelectedAttribute(attributes, [
    "physical_condition",
    "physicalCondition",
  ]);
  const batteryHealth = getSelectedAttribute(attributes, [
    "battery_health",
    "batteryHealth",
    "battery",
  ]);
  const shutterCount = getSelectedAttribute(attributes, [
    "shutter_count",
    "shutterCount",
    "shuttle_count",
    "shuttleCount",
  ]);
  const add = (value) => {
    const part = makeSkuPart(value);
    if (part) parts.push(part);
  };

  if (categoryCode === "D004Y" || categoryName === "Consoles") {
    add(storage);
    add(color);
  } else if (categoryCode === "D018Y" || categoryName === "Laptops") {
    add(storage);
    add(ram);
    add(getAddVariantPhysicalCondition(physicalCondition));
    add(color);
    add(getAddVariantBatteryLevel(batteryHealth));
  } else if (
    categoryCode === "D014Y" ||
    categoryName === "Cameras" ||
    categoryName === "Camera"
  ) {
    add(color);
    add(getAddVariantShutterLevel(shutterCount));
  } else if (categoryCode === "D019Y" || categoryName === "Smartphones") {
    add(storage);
    const reservedSmartphoneKeys = new Set([
      "storage",
      "battery_health",
      "batteryhealth",
      "battery",
      "physical_condition",
      "physicalcondition",
      "color",
    ]);
    Object.entries(attributes || {}).forEach(([key, value]) => {
      const normalizedKey = normalizeAttributeKey(key);
      const compactKey = normalizedKey.replaceAll("_", "");
      if (
        reservedSmartphoneKeys.has(normalizedKey) ||
        reservedSmartphoneKeys.has(compactKey)
      ) {
        return;
      }
      add(value);
    });
    add(getAddVariantBatteryLevel(batteryHealth));
    add(physicalCondition);
    add(color);
  } else if (["D005Y", "D015Y", "D020Y", "D021Y"].includes(categoryCode)) {
    add(color);
  } else if (["D009Y", "D006Y"].includes(categoryCode)) {
    add(storage);
    add(color);
  } else {
    Object.values(attributes || {}).forEach(add);
  }

  return parts.filter(Boolean).join("-");
}

function getAttributeNumericScore(value) {
  const numbers = String(value || "").match(/\d+(\.\d+)?/g);
  if (!numbers || !numbers.length) return null;
  const parsed = numbers.map(Number);
  return parsed.reduce((sum, n) => sum + n, 0) / parsed.length;
}

function getBatteryHealthSkuValue(value, attributeDefinitions = []) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";

  const batteryAttr = (attributeDefinitions || []).find((attr) => {
    const key = normalizeAttributeKey(attr.key);
    return key === "battery_health" || key.includes("battery");
  });

  const values = Array.from(
    new Set(
      (batteryAttr?.values || [])
        .map((v) => String(v || "").trim())
        .filter(Boolean),
    ),
  );

  const selected = values.find(
    (v) => slugify(v) === slugify(rawValue) || String(v) === rawValue,
  );

  if (!selected || values.length < 2) return rawValue;

  const sortedValues = [...values].sort((a, b) => {
    const aScore = getAttributeNumericScore(a);
    const bScore = getAttributeNumericScore(b);
    if (aScore === null && bScore === null)
      return values.indexOf(a) - values.indexOf(b);
    if (aScore === null) return 1;
    if (bScore === null) return -1;
    return aScore - bScore;
  });
  const rank = sortedValues.findIndex((v) => v === selected);

  if (values.length === 2) return rank === 0 ? "low" : "high";
  if (values.length === 3) return ["low", "medium", "high"][rank] || rawValue;

  if (rank <= 0) return "low";
  if (rank >= values.length - 1) return "high";
  return "medium";
}

function getPhysicalConditionSkuValue(value) {
  const slug = slugify(value);
  const conditionSkuValues = {
    "very-light-mark": "no-visible-mark",
    "very-light-marks": "no-visible-mark",
    "no-visible-mark": "no-visible-mark",
    "no-visible-marks": "no-visible-mark",
    "light-mark": "visible-mark",
    "light-marks": "visible-mark",
    "visible-mark": "visible-mark",
    "visible-marks": "visible-mark",
  };

  return conditionSkuValues[slug] || value;
}

function getSkuAttributeOrder(key, definitionIndex) {
  const normalizedKey = normalizeAttributeKey(key);
  const preferredOrder = [
    ["storage", "capacity"],
    ["ram", "memory"],
    ["battery_health", "battery"],
    ["physical_condition", "condition"],
  ];
  const preferredIndex = preferredOrder.findIndex((keys) =>
    keys.some((preferredKey) => normalizedKey === preferredKey),
  );

  if (normalizedKey === "color" || normalizedKey === "colour") return 9999;

  return preferredIndex >= 0
    ? preferredIndex
    : preferredOrder.length + definitionIndex;
}

function getSkuValueForKey(key, value, attributeDefinitions = []) {
  const normalizedKey = normalizeAttributeKey(key);

  if (normalizedKey === "battery_health" || normalizedKey === "battery") {
    return getBatteryHealthSkuValue(value, attributeDefinitions);
  }

  if (normalizedKey === "physical_condition" || normalizedKey === "condition") {
    return getPhysicalConditionSkuValue(value);
  }

  return value;
}

export function generateSKUForItem(
  specId,
  item,
  attributeDefinitions = [],
  product = {},
) {
  if (product.categoryName || product.categoryCode) {
    return generateCategorySku(
      specId,
      item.attributes || {},
      product.categoryName,
      product.categoryCode,
    );
  }

  const parts = [];
  if (specId) parts.push(slugify(specId));

  if (item.attributes && typeof item.attributes === "object") {
    const definitionOrder = (attributeDefinitions || []).reduce(
      (acc, attr, index) => {
        const key = normalizeAttributeKey(attr.key);
        if (key && acc[key] === undefined) acc[key] = index;
        return acc;
      },
      {},
    );

    Object.keys(item.attributes)
      .sort((a, b) => {
        const aKey = normalizeAttributeKey(a);
        const bKey = normalizeAttributeKey(b);
        const aDefinitionIndex =
          definitionOrder[aKey] === undefined ? 999 : definitionOrder[aKey];
        const bDefinitionIndex =
          definitionOrder[bKey] === undefined ? 999 : definitionOrder[bKey];
        const aOrder = getSkuAttributeOrder(aKey, aDefinitionIndex);
        const bOrder = getSkuAttributeOrder(bKey, bDefinitionIndex);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return aDefinitionIndex - bDefinitionIndex;
      })
      .forEach((k) => {
        const v = item.attributes[k];
        if (!v) return;
        const value = getSkuValueForKey(k, v, attributeDefinitions);
        if (value) parts.push(slugify(value));
      });
  }

  if (item.storage) parts.push(slugify(item.storage));
  if (item.battery_health) {
    parts.push(
      slugify(
        getSkuValueForKey(
          "battery_health",
          item.battery_health,
          attributeDefinitions,
        ),
      ),
    );
  }
  if (item.physical_condition) {
    parts.push(
      slugify(
        getSkuValueForKey(
          "physical_condition",
          item.physical_condition,
          attributeDefinitions,
        ),
      ),
    );
  }
  if (item.color) parts.push(slugify(item.color));
  return parts.filter(Boolean).join("-");
}
