import UpdateInventory from "./UpdateInventory";

export const metadata = {
  title: "Update Inventory | DACBY",
  description: "Edit inventory images, SKUs, and combination attributes for a listing.",
};

export default async function UpdateInventoryPage({ params }) {
  const { id } = await params;
  return <UpdateInventory id={id} />;
}
