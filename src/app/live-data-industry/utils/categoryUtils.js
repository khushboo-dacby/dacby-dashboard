/**
 * Clean Category Filter List containing ONLY category name and inventory code.
 * Matches the canonical standard used at the time of Add Product (src/constants/inventory.js).
 */
export const categories = [
  { name: "All Categories", code: "ALL" },
  { name: "PS5 CDs", code: "D001Y" },
  { name: "PS4 CDs", code: "D002Y" },
  { name: "Pre Orders", code: "D003Y" },
  { name: "Consoles", code: "D004Y" },
  { name: "Controllers", code: "D005Y" },
  { name: "Accessories", code: "D006Y" },
  { name: "PC Components", code: "D009Y" },
  { name: "Cameras", code: "D014Y" },
  { name: "Camera Lens", code: "D015Y" },
  { name: "Laptops", code: "D018Y" },
  { name: "Smartphones", code: "D019Y" },
  { name: "Smart Devices", code: "D020Y" },
  { name: "Audio Devices", code: "D021Y" },
];

export const CATEGORIES_WITH_CODE = categories;

/**
 * Structured dummy analytics data organized by category code.
 * Contains revenue profiles, B2C/B2B ratios, average ticket sizes, and daily sales trends.
 */
export const categoryDummyData = {
  ALL: {
    categoryName: "All Categories",
    code: "ALL",
    baselineLakhs: 28.5,
    b2cShare: 0.42,
    b2bShare: 0.58,
    b2cAvgTicket: 7800,
    b2bAvgTicket: 32000,
    weekendBoost: 1.25,
    dailyTrend: [
      18.5, 21.2, 19.8, 24.6, 26.8, 38.4, 42.1, 23.5, 22.1, 25.4,
      27.2, 29.5, 41.2, 44.8, 24.2, 23.8, 26.5, 28.1, 31.4, 45.6,
      48.2, 25.1, 24.6, 28.4, 30.2, 33.5, 46.8, 50.4, 27.5, 26.8,
    ],
  },
  D019Y: {
    categoryName: "Smartphones",
    code: "D019Y",
    baselineLakhs: 16.2,
    b2cShare: 0.54,
    b2bShare: 0.46,
    b2cAvgTicket: 14500,
    b2bAvgTicket: 42000,
    weekendBoost: 1.2,
    dailyTrend: [
      10.4, 11.8, 11.2, 13.5, 14.8, 21.2, 23.5, 12.8, 12.4, 14.1,
      15.2, 16.5, 22.8, 24.6, 13.2, 13.0, 14.6, 15.8, 17.4, 25.2,
      26.8, 13.8, 13.5, 15.6, 16.8, 18.5, 25.8, 27.6, 15.2, 14.8,
    ],
  },
  D004Y: {
    categoryName: "Consoles",
    code: "D004Y",
    baselineLakhs: 4.8,
    b2cShare: 0.65,
    b2bShare: 0.35,
    b2cAvgTicket: 34000,
    b2bAvgTicket: 48000,
    weekendBoost: 1.45,
    dailyTrend: [
      2.8, 3.2, 3.0, 3.8, 4.2, 7.5, 8.4, 3.5, 3.2, 3.9,
      4.2, 4.8, 7.8, 8.9, 3.6, 3.4, 4.1, 4.5, 5.2, 8.4,
      9.2, 3.8, 3.6, 4.4, 4.8, 5.6, 8.8, 9.6, 4.2, 3.9,
    ],
  },
  D001Y: {
    categoryName: "PS5 CDs",
    code: "D001Y",
    baselineLakhs: 3.9,
    b2cShare: 0.72,
    b2bShare: 0.28,
    b2cAvgTicket: 3800,
    b2bAvgTicket: 18000,
    weekendBoost: 1.55,
    dailyTrend: [
      2.1, 2.4, 2.2, 2.9, 3.4, 6.2, 7.1, 2.6, 2.5, 3.1,
      3.4, 3.9, 6.8, 7.5, 2.8, 2.6, 3.2, 3.6, 4.2, 7.2,
      7.8, 2.9, 2.8, 3.5, 3.8, 4.5, 7.6, 8.2, 3.2, 3.0,
    ],
  },
  D018Y: {
    categoryName: "Laptops",
    code: "D018Y",
    baselineLakhs: 3.2,
    b2cShare: 0.38,
    b2bShare: 0.62,
    b2cAvgTicket: 42000,
    b2bAvgTicket: 68000,
    weekendBoost: 0.85,
    dailyTrend: [
      3.4, 3.8, 3.6, 4.1, 3.9, 2.4, 2.1, 3.6, 3.8, 4.2,
      4.4, 4.2, 2.6, 2.2, 3.8, 3.9, 4.4, 4.6, 4.3, 2.8,
      2.4, 3.9, 4.1, 4.5, 4.8, 4.6, 2.9, 2.5, 4.2, 4.0,
    ],
  },
  D002Y: {
    categoryName: "PS4 CDs",
    code: "D002Y",
    baselineLakhs: 2.2,
    b2cShare: 0.75,
    b2bShare: 0.25,
    b2cAvgTicket: 2200,
    b2bAvgTicket: 12000,
    weekendBoost: 1.4,
    dailyTrend: [
      1.2, 1.4, 1.3, 1.7, 1.9, 3.5, 4.1, 1.5, 1.4, 1.8,
      1.9, 2.2, 3.8, 4.3, 1.6, 1.5, 1.9, 2.1, 2.4, 4.1,
      4.6, 1.7, 1.6, 2.0, 2.2, 2.5, 4.3, 4.8, 1.9, 1.8,
    ],
  },
  D003Y: {
    categoryName: "Pre Orders",
    code: "D003Y",
    baselineLakhs: 1.8,
    b2cShare: 0.68,
    b2bShare: 0.32,
    b2cAvgTicket: 4500,
    b2bAvgTicket: 22000,
    weekendBoost: 1.15,
    dailyTrend: [
      1.1, 1.3, 1.2, 1.5, 1.6, 2.4, 2.7, 1.3, 1.2, 1.5,
      1.6, 1.8, 2.6, 2.9, 1.4, 1.3, 1.6, 1.7, 2.0, 2.8,
      3.1, 1.4, 1.4, 1.7, 1.8, 2.1, 2.9, 3.2, 1.5, 1.4,
    ],
  },
  D009Y: {
    categoryName: "PC Components",
    code: "D009Y",
    baselineLakhs: 1.4,
    b2cShare: 0.42,
    b2bShare: 0.58,
    b2cAvgTicket: 12000,
    b2bAvgTicket: 28000,
    weekendBoost: 1.1,
    dailyTrend: [
      0.9, 1.1, 1.0, 1.2, 1.3, 1.8, 2.0, 1.1, 1.0, 1.2,
      1.3, 1.4, 2.0, 2.2, 1.1, 1.1, 1.3, 1.4, 1.5, 2.1,
      2.3, 1.2, 1.1, 1.3, 1.4, 1.6, 2.2, 2.4, 1.3, 1.2,
    ],
  },
  D005Y: {
    categoryName: "Controllers",
    code: "D005Y",
    baselineLakhs: 1.2,
    b2cShare: 0.7,
    b2bShare: 0.3,
    b2cAvgTicket: 4800,
    b2bAvgTicket: 16000,
    weekendBoost: 1.35,
    dailyTrend: [
      0.8, 0.9, 0.8, 1.0, 1.1, 1.8, 2.1, 0.9, 0.9, 1.1,
      1.2, 1.3, 2.0, 2.2, 1.0, 0.9, 1.1, 1.2, 1.4, 2.1,
      2.3, 1.0, 1.0, 1.2, 1.3, 1.5, 2.2, 2.4, 1.1, 1.0,
    ],
  },
  D014Y: {
    categoryName: "Cameras",
    code: "D014Y",
    baselineLakhs: 1.1,
    b2cShare: 0.48,
    b2bShare: 0.52,
    b2cAvgTicket: 42000,
    b2bAvgTicket: 65000,
    weekendBoost: 1.1,
    dailyTrend: [
      0.7, 0.9, 0.8, 1.0, 1.1, 1.4, 1.6, 0.9, 0.8, 1.0,
      1.1, 1.2, 1.5, 1.7, 0.9, 0.9, 1.1, 1.2, 1.3, 1.6,
      1.8, 1.0, 0.9, 1.1, 1.2, 1.4, 1.7, 1.9, 1.0, 0.9,
    ],
  },
  D020Y: {
    categoryName: "Smart Devices",
    code: "D020Y",
    baselineLakhs: 0.9,
    b2cShare: 0.62,
    b2bShare: 0.38,
    b2cAvgTicket: 8500,
    b2bAvgTicket: 18000,
    weekendBoost: 1.15,
    dailyTrend: [
      0.6, 0.7, 0.6, 0.8, 0.9, 1.3, 1.5, 0.7, 0.7, 0.8,
      0.9, 1.0, 1.4, 1.6, 0.8, 0.7, 0.9, 1.0, 1.1, 1.5,
      1.7, 0.8, 0.8, 0.9, 1.0, 1.2, 1.6, 1.8, 0.9, 0.8,
    ],
  },
  D021Y: {
    categoryName: "Audio Devices",
    code: "D021Y",
    baselineLakhs: 0.8,
    b2cShare: 0.68,
    b2bShare: 0.32,
    b2cAvgTicket: 4500,
    b2bAvgTicket: 12000,
    weekendBoost: 1.2,
    dailyTrend: [
      0.5, 0.6, 0.5, 0.7, 0.8, 1.2, 1.4, 0.6, 0.6, 0.7,
      0.8, 0.9, 1.3, 1.5, 0.7, 0.6, 0.8, 0.9, 1.0, 1.4,
      1.6, 0.7, 0.7, 0.8, 0.9, 1.1, 1.5, 1.7, 0.8, 0.7,
    ],
  },
  D015Y: {
    categoryName: "Camera Lens",
    code: "D015Y",
    baselineLakhs: 0.6,
    b2cShare: 0.45,
    b2bShare: 0.55,
    b2cAvgTicket: 28000,
    b2bAvgTicket: 45000,
    weekendBoost: 1.05,
    dailyTrend: [
      0.4, 0.5, 0.4, 0.5, 0.6, 0.8, 0.9, 0.5, 0.4, 0.5,
      0.6, 0.7, 0.9, 1.0, 0.5, 0.5, 0.6, 0.7, 0.8, 1.0,
      1.1, 0.5, 0.5, 0.6, 0.7, 0.8, 1.0, 1.2, 0.6, 0.5,
    ],
  },
  D006Y: {
    categoryName: "Accessories",
    code: "D006Y",
    baselineLakhs: 0.4,
    b2cShare: 0.78,
    b2bShare: 0.22,
    b2cAvgTicket: 1800,
    b2bAvgTicket: 6500,
    weekendBoost: 1.3,
    dailyTrend: [
      0.3, 0.3, 0.3, 0.4, 0.4, 0.6, 0.7, 0.3, 0.3, 0.4,
      0.4, 0.5, 0.7, 0.8, 0.4, 0.3, 0.4, 0.4, 0.5, 0.7,
      0.8, 0.4, 0.4, 0.4, 0.5, 0.5, 0.8, 0.9, 0.4, 0.4,
    ],
  },
};

/**
 * Get category item from the clean categories array
 */
export function getCategoryByCode(code = "ALL") {
  return categories.find((c) => c.code === code) || categories[0];
}

/**
 * Get category-specific dummy profile data
 */
export function getCategoryDummyProfile(code = "ALL") {
  return categoryDummyData[code] || categoryDummyData.ALL;
}

/**
 * Format raw currency number to Indian Rupee format (e.g. ₹32,45,000)
 */
export function formatRupeesINR(amount) {
  if (!amount && amount !== 0) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Safely parse a date string into a valid Date object without throwing RangeError
 */
export function safeParseDate(value, fallback = new Date("2026-10-17T00:00:00")) {
  if (!value) return fallback;
  if (value instanceof Date && !isNaN(value.getTime())) return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const d = new Date(`${trimmed}T00:00:00`);
      if (!isNaN(d.getTime())) return d;
    }

    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  }

  return fallback;
}

/**
 * Generate daily sales data for a date range using the category's dummy dataset
 */
export function generateDailySalesData(
  period,
  customDates,
  categoryCode = "ALL"
) {
  const fallbackStart = new Date("2026-09-18T00:00:00");
  const fallbackEnd = new Date("2026-10-17T00:00:00");

  let startDate =
    period === "custom"
      ? safeParseDate(customDates?.start, fallbackStart)
      : fallbackStart;
  let endDate =
    period === "custom"
      ? safeParseDate(customDates?.end, fallbackEnd)
      : fallbackEnd;

  if (startDate.getTime() > endDate.getTime()) {
    const temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  const categoryMeta = getCategoryByCode(categoryCode);
  const dummyProfile = getCategoryDummyProfile(categoryCode);

  const daysCount = Math.max(
    1,
    Math.min(
      90,
      Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1
    )
  );
  const data = [];

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const dayOfMonth = d.getDate();
    const monthName = d.toLocaleDateString("en-IN", { month: "short" });

    // Grab daily trend value from category dummy data array (wrapping index if range > 30)
    const trendIndex = i % dummyProfile.dailyTrend.length;
    let totalSales = dummyProfile.dailyTrend[trendIndex];

    // Minor deterministic wave for custom ranges beyond 30 days
    if (i >= 30) {
      const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + dayOfMonth;
      const variation = 1 + (Math.sin(seed * 0.25) * 0.1);
      totalSales = Number((totalSales * variation).toFixed(2));
    }

    const b2cSales = Number((totalSales * dummyProfile.b2cShare).toFixed(2));
    const b2bSales = Number((totalSales - b2cSales).toFixed(2));

    // Unit counts based on ticket size
    const b2cUnits = Math.max(
      1,
      Math.round((b2cSales * 100000) / dummyProfile.b2cAvgTicket)
    );
    const b2bUnits = Math.max(
      1,
      Math.round((b2bSales * 100000) / dummyProfile.b2bAvgTicket)
    );
    const totalUnits = b2cUnits + b2bUnits;

    data.push({
      dateKey: d.toISOString().split("T")[0],
      day: `${String(dayOfMonth).padStart(2, "0")} ${monthName}`,
      fullDate: d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      categoryName: categoryMeta.name,
      categoryCode: categoryMeta.code,
      categoryLabel:
        categoryMeta.code === "ALL"
          ? "All Categories"
          : `${categoryMeta.name} (${categoryMeta.code})`,
      b2cSales,
      b2bSales,
      totalSales,
      b2cUnits,
      b2bUnits,
      units: totalUnits,
      totalSalesRupees: Math.round(totalSales * 100000),
      b2cSalesRupees: Math.round(b2cSales * 100000),
      b2bSalesRupees: Math.round(b2bSales * 100000),
    });
  }

  return data;
}
