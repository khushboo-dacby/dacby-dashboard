export const ADD_PRODUCT_TO_INVENTORY =
  "https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi/addproducttoinventorynew";

export async function addProductToInventory(payload) {
  const response = await fetch(ADD_PRODUCT_TO_INVENTORY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok || responseData.success === false) {
    const errorMessage =
      responseData.message || "Failed to save product inventory";
    throw new Error(errorMessage);
  }

  return responseData;
}
