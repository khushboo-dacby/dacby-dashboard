import axios from "axios";

const BASE_URL =
  "https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi";

  const GET_PRODUCT_DETAIL = `${BASE_URL}/getproductdetails`;
  
  export async function getProductDetail(id) {
    try {
      const { data } = await axios.get(GET_PRODUCT_DETAIL, {
        params: { id },
      });
  
      if (Array.isArray(data)) {
        return data;
      }
  
      if (data?.success === false) {
        throw new Error(data.message || "Failed to fetch product details");
      }
  
      if (data?.error) {
        throw new Error(data.error || "Failed to fetch product details");
      }
  
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch product details";
      throw new Error(message);
    }
  }

const LEDGER_BY_SKU = (sku) =>
  `${BASE_URL}/api/ledger/bySku?sku=${encodeURIComponent(sku)}`;

export async function getLedgerBySku(sku) {
  try {
    const { data } = await axios.get(LEDGER_BY_SKU(sku));

    if (data?.success === false) {
      throw new Error(data.message || "Failed to load ledger details");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to load ledger details");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to load ledger details";
    throw new Error(message);
  }
}