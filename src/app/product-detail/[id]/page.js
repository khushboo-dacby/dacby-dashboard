import ProductDetail from "./ProductDetail";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
