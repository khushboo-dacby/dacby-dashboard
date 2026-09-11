import axios from "axios";

const BASE_URL =
  "https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi";

const ADD_PRODUCT_TO_INVENTORY = `${BASE_URL}/addproducttoinventorynew`;
const SEARCH_PRODUCTS = `${BASE_URL}/searchProducts`;
const GET_PRODUCT_DETAIL = `${BASE_URL}/getproductdetails`;
const UPDATE_COMBINATION = `${BASE_URL}/api/specifications/update-combination`;
const ADD_COMBINATION_ITEM = `${BASE_URL}/api/inventory/add-combination-item`;
const ADD_SPECIAL_EDITION = `${BASE_URL}/api/inventory/add-special-edition`;
const FETCH_INVENTORY = `${BASE_URL}/fetchInventory`;
const ADD_WARRANTY= `${BASE_URL}/api/warranties`;

const PRODUCT_FULL_JSON = (productId) =>
  `${BASE_URL}/api/products/${encodeURIComponent(productId)}/full-json`;
const UPDATE_INVENTORY_DOC = (productId) =>
  `${BASE_URL}/updateinventorydoc/${encodeURIComponent(productId)}`;
const UPDATE_SPEC_DOC = (specId) =>
  `${BASE_URL}/updatespecdoc/${encodeURIComponent(specId)}`;

// Loads the complete product record used by the Update Inventory screen.
// Returns { success, productId, spec_id, inventory_json, spec_json }.
export async function getProductFullJson(productId) {
  try {
    const { data } = await axios.get(PRODUCT_FULL_JSON(productId));

    if (data?.success === false) {
      throw new Error(data.message || "Failed to load product");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to load product");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to load product";
    throw new Error(message);
  }
}

// Full-document replace of the Inventory doc. `inventoryJson` must be the
// complete inventory_json object (the backend replaces the whole document and
// preserves created_at). Never send a partial payload.
export async function updateInventoryDoc(productId, inventoryJson) {
  try {
    const { data } = await axios.put(UPDATE_INVENTORY_DOC(productId), inventoryJson, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data?.success === false) {
      throw new Error(data.message || "Failed to update inventory");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to update inventory");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to update inventory";
    throw new Error(message);
  }
}

// Full-document replace of the Specifications doc. `specJson` must be the
// complete spec_json object. Never send a partial payload.
export async function updateSpecDoc(specId, specJson) {
  try {
    const { data } = await axios.put(UPDATE_SPEC_DOC(specId), specJson, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data?.success === false) {
      throw new Error(data.message || "Failed to update specification");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to update specification");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to update specification";
    throw new Error(message);
  }
}
export async function addWarranty(payload){
try {
    const { data } = await axios.post(ADD_WARRANTY, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data?.success === false) {
      throw new Error(data.message || "Failed to add warranty");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to add warranty");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to add warranty";
    throw new Error(message);
  }
}
export async function deleteProduct(productId) {
  const url = `${BASE_URL}/api/inventory/${productId}`;

  try {
    const { data } = await axios.delete(url);

    if (data?.success === false) {
      throw new Error(data.message || "Failed to delete product");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to delete product");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to delete product";
    throw new Error(message);
  }
}

export async function updateSkuImages(productId, sku, images) {
  const url = `${BASE_URL}/api/inventory/${productId}/skus/${sku}/images`;

  try {
    const { data } = await axios.patch(
      url,
      { images },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data?.success === false) {
      throw new Error(data.message || "Failed to update SKU images");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to update SKU images");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to update SKU images";
    throw new Error(message);
  }
}

export async function fetchInventory(payload = {}) {
  try {
    const { data } = await axios.post(FETCH_INVENTORY, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data?.success === false) {
      throw new Error(data.message || "Failed to fetch inventory");
    }
    if (data?.error) {
      throw new Error(data.error || "Failed to fetch inventory");
    }

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch inventory";
    throw new Error(message);
  }
}

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
