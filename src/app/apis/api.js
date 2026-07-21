import axios from "axios";

const BASE_URL =
  "https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi";

const ADD_PRODUCT_TO_INVENTORY = `${BASE_URL}/addproducttoinventorynew`;
const SEARCH_PRODUCTS = `${BASE_URL}/searchProducts`;
const GET_PRODUCT_DETAIL = `${BASE_URL}/getproductdetails`;
const UPDATE_COMBINATION = `${BASE_URL}/api/specifications/update-combination`;
const ADD_COMBINATION_ITEM = `${BASE_URL}/api/inventory/add-combination-item`;
const ADD_SPECIAL_EDITION = `${BASE_URL}/api/inventory/add-special-edition`;

export async function addProductToInventory(payload) {
  try {
    const { data } = await axios.post(ADD_PRODUCT_TO_INVENTORY, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data?.success === false) {
      throw new Error(data.message || "Failed to save product inventory");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to save product inventory";
    throw new Error(message);
  }
}

export async function searchProducts(query) {
  try {
    const { data } = await axios.get(SEARCH_PRODUCTS, {
      params: { query },
    });

    if (Array.isArray(data)) {
      return data;
    }

    if (data?.success === false) {
      throw new Error(data.message || "Failed to search products");
    }

    if (data?.error) {
      throw new Error(data.error || "Failed to search products");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to search products";
    throw new Error(message);
  }
}

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

export async function updateCombination(payload) {
  try {
    const { data } = await axios.post(UPDATE_COMBINATION, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data?.success === false) {
      throw new Error(data.message || "Failed to update combination");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to update combination");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to update combination";
    throw new Error(message);
  }
}

export async function addCombinationItem(payload) {
  try {
    const { data } = await axios.post(ADD_COMBINATION_ITEM, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data?.success === false) {
      throw new Error(data.message || "Failed to add combination item");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to add combination item");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to add combination item";
    throw new Error(message);
  }
}

export async function addSpecialEdition(payload) {
  try {
    const { data } = await axios.post(ADD_SPECIAL_EDITION, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data?.success === false) {
      throw new Error(data.message || "Failed to add special edition");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to add special edition");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to add special edition";
    throw new Error(message);
  }
}
