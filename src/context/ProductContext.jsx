"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ProductContext = createContext(null);

export function normalizeProductResponse(productId, response) {
  const product = Array.isArray(response) ? response[0] : response;
  const inventory = product?.inventory_json ?? product?.details ?? {};
  const spec = product?.spec_json ?? product?.specifications ?? {};

  return {
    response: product,
    productId: product?.productId ?? product?.id ?? inventory?.id ?? productId,
    spec_id: product?.spec_id ?? inventory?.spec_id ?? spec?.spec_id ?? "",
    inventory_json: inventory,
    spec_json: spec,
  };
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState({});
  const productsRef = useRef(products);
  productsRef.current = products;

  const setProduct = useCallback((productId, response) => {
    setProducts((current) => ({
      ...current,
      [String(productId)]: normalizeProductResponse(productId, response),
    }));
  }, []);

  const getProduct = useCallback(
    (productId) => productsRef.current[String(productId)] ?? null,
    [],
  );

  const value = useMemo(
    () => ({
      setProduct,
      getProduct,
    }),
    [getProduct, setProduct],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return context;
}
