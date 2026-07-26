"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, LoaderCircle, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deleteProduct as deleteProductApi, fetchInventory, searchProducts } from "../apis/api";
import { toast } from "sonner";
import { categories } from "../../constants/inventory";
import AddNewProduct from "./AddNewProduct";
import DeletePop from "../../components/confirmation-modal/DeletePop";

function getVariantItems(product) {
  return Object.values(product.vendors ?? {}).flatMap((vendor) =>
    Object.values(vendor.combination_offered ?? {}).flatMap((combination) =>
      Object.values(combination ?? {})
    )
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function getDiscount(mrp, price) {
  return Number(mrp) > Number(price)
    ? Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)
    : 0;
}

function getProductsFromResponse(response) {
  const products = Array.isArray(response)
    ? response
    : response?.inventory ?? response?.data?.inventory ?? response?.data ?? [];

  if (!Array.isArray(products)) {
    throw new Error("Inventory API returned an invalid product list");
  }

  return products;
}

function ProductRow({ product, onDelete }) {
  const [showDeletePop, setShowDeletePop] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const variants = getVariantItems(product);
  const thumbnail = variants.find((variant) => variant.images?.[0])?.images?.[0];
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <>
    <tr className="border-t border-slate-200 bg-white transition-colors hover:bg-slate-50/70">
      <td className="px-5 py-5">
        <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.product_title}
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
          )}
        </div>
      </td>
      <td className="min-w-72 px-5 py-5">
        <p className="font-semibold text-slate-900">{product.product_title}</p>
        <p className="mt-1 text-sm text-slate-500">
          {variants.length} {variants.length === 1 ? "variant" : "variants"}
        </p>
        <p className="mt-1 text-sm text-slate-700">{product.code}</p>
      </td>
      <td className="min-w-40 px-5 py-5 font-medium text-slate-800">{product.category_name}</td>
      <td className="min-w-32 px-5 py-5">
        <p className="font-semibold text-slate-900">{formatPrice(product.price)}</p>
        {product.mrp > product.price && (
          <>
            <p className="mt-1 text-sm text-slate-500 line-through">{formatPrice(product.mrp)}</p>
            <p className="mt-1 text-xs font-medium text-slate-700">{discount}% OFF</p>
          </>
        )}
      </td>
      <td className="min-w-28 px-5 py-5">
        <span className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${
          product.in_stock && !product.outofstock
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-rose-200 bg-rose-50 text-rose-700"
        }`}>
          {product.in_stock && !product.outofstock ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td className="min-w-48 px-5 py-5">
        <div className="flex items-center gap-2">
          <Link href={`/product-detail/${product.id}`} aria-label={`View ${product.product_title}`} title="View" className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
            <Eye className="h-4 w-4" />
          </Link>
          <button type="button" onClick={() => setShowDeletePop(true)} aria-label={`Delete ${product.product_title}`} title="Delete" className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
    {showDeletePop && (
        <DeletePop
          productName={product.product_title}
          isDeleting={isDeleting}
          onCancel={() => setShowDeletePop(false)}
          onConfirm={async () => {
            setIsDeleting(true);
            const deleted = await onDelete(product);
            setIsDeleting(false);
            if (deleted) setShowDeletePop(false);
          }}
        />
    )}
    </>
  );
}

export default function ProductInventory() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingLabel, setLoadingLabel] = useState("Loading inventory...");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchDeleteTarget, setSearchDeleteTarget] = useState(null);
  const [isDeletingSearchProduct, setIsDeletingSearchProduct] = useState(false);
  const searchRequestId = useRef(0);

  const loadPage = useCallback(async ({ startAfter, pageIndex, reset = false }) => {
    setIsLoading(true);
    setLoadingLabel(startAfter ? "Fetching next page..." : "Refreshing inventory...");
    setError("");

    try {
      const response = await fetchInventory(startAfter ? { startAfter } : {});
      const products = getProductsFromResponse(response);

      if (pageIndex > 0 && products.length === 0) {
        setPages((existingPages) => existingPages.map((page, index) =>
          index === pageIndex - 1 ? { ...page, hasNext: false } : page
        ));
        return;
      }

      const hasNext = response?.hasNext ?? response?.hasMore ?? products.length > 0;
      const nextPage = { products, hasNext };

      setPages((existingPages) => {
        if (reset) return [nextPage];
        const updatedPages = existingPages.slice(0, pageIndex);
        updatedPages[pageIndex] = nextPage;
        return updatedPages;
      });
      setCurrentPage(pageIndex);
    } catch (requestError) {
      setError(requestError.message || "Failed to fetch inventory");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchInventory()
      .then((response) => {
        if (ignore) return;
        const products = getProductsFromResponse(response);
        const hasNext = response?.hasNext ?? response?.hasMore ?? products.length > 0;
        setPages([{ products, hasNext }]);
      })
      .catch((requestError) => {
        if (!ignore) setError(requestError.message || "Failed to fetch inventory");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [loadPage]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) return;
    const requestId = ++searchRequestId.current;

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError("");

      try {
        const results = await searchProducts(query);
        if (requestId !== searchRequestId.current) return;
        setSearchResults(Array.isArray(results) ? results : []);
      } catch (requestError) {
        if (requestId !== searchRequestId.current) return;
        setSearchResults([]);
        setSearchError(requestError.message || "Failed to search products");
      } finally {
        if (requestId === searchRequestId.current) setIsSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const currentPageData = pages[currentPage] ?? { products: [], hasNext: false };

  const filteredProducts = useMemo(
    () => selectedCategory
      ? currentPageData.products.filter((product) => product.category_name === selectedCategory)
      : currentPageData.products,
    [currentPageData.products, selectedCategory]
  );

  function changeCategory(event) {
    setSelectedCategory(event.target.value);
  }

  function changeSearchQuery(value) {
    setSearchQuery(value);
    setShowSearchResults(true);
    if (!value.trim()) {
      searchRequestId.current += 1;
      setSearchResults([]);
      setSearchError("");
      setIsSearching(false);
    }
  }

  async function deleteProduct(product) {
    try {
      const response = await deleteProductApi(encodeURIComponent(product.id));
      setPages((existingPages) => existingPages.map((page, pageIndex) =>
        pageIndex === currentPage
          ? { ...page, products: page.products.filter((item) => item.id !== product.id) }
          : page
      ));
      setSearchResults((currentResults) =>
        currentResults.filter((result) => result.docId !== product.id)
      );
      toast.success(response?.message || "Product deleted successfully");
      return true;
    } catch (requestError) {
      toast.error(requestError.message || "Failed to delete product");
      return false;
    }
  }

  async function goToNextPage() {
    const nextPageIndex = currentPage + 1;

    if (pages[nextPageIndex]) {
      setCurrentPage(nextPageIndex);
      return;
    }

    const lastProduct = currentPageData.products.at(-1);
    if (!lastProduct?.id) return;

    await loadPage({ startAfter: lastProduct.id, pageIndex: nextPageIndex });
  }

  return (
    <main className="h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-950 sm:px-10 lg:px-20">
      <section className="mx-auto flex h-full w-full flex-col">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Product Inventory</h1>
            <p className="mt-2 text-slate-600">Manage and view all your products in one place.</p>
          </div>
          <AddNewProduct />
        </div>

        <div className="relative mt-7">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onFocus={() => setShowSearchResults(true)}
            onChange={(event) => changeSearchQuery(event.target.value)}
            placeholder="Search products by name or code..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          {searchQuery && (
            <button type="button" onClick={() => changeSearchQuery("")} aria-label="Clear product search" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          )}

          {showSearchResults && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[min(520px,60vh)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
              {isSearching && (
                <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm font-medium text-blue-600">
                  <LoaderCircle className="h-5 w-5 animate-spin" /> Searching products...
                </div>
              )}
              {!isSearching && searchError && (
                <p className="px-5 py-10 text-center text-sm text-rose-600">{searchError}</p>
              )}
              {!isSearching && !searchError && searchResults.length === 0 && (
                <p className="px-5 py-10 text-center text-sm text-slate-500">No products found.</p>
              )}
              {!isSearching && !searchError && searchResults.map((result) => {
                const product = result.product ?? {};
                const discount = getDiscount(product.mrp, product.price);
                return (
                  <div key={result.docId} className="flex items-center border-b border-slate-200 transition last:border-0 hover:bg-blue-50/60">
                    <Link
                      href={`/product-detail/${encodeURIComponent(result.docId)}`}
                      onClick={() => setShowSearchResults(false)}
                      className="grid min-w-0 flex-1 grid-cols-[72px_minmax(0,1fr)] gap-4 px-5 py-4 sm:grid-cols-[80px_minmax(0,1fr)_150px] sm:items-center"
                    >
                      <div className="relative h-18 w-18 overflow-hidden rounded-xl border border-slate-200 bg-white sm:h-20 sm:w-20">
                        {product.image && (
                          <Image src={product.image} alt={product.product_title || "Product"} fill sizes="80px" className="object-contain p-1" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-slate-900">{product.product_title}</p>
                        <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700">
                          <span>{product.condition || "—"}</span>
                          <span className={product.outOfStock || result.outOfStock ? "text-rose-600" : "text-emerald-600"}>
                            {product.outOfStock || result.outOfStock ? "Out of Stock" : "In Stock"}
                          </span>
                          <span>{product.variants ?? 0} {product.variants === 1 ? "variant" : "variants"}</span>
                        </div>
                      </div>
                      <div className="col-start-2 sm:col-start-auto sm:text-right">
                        <p className="text-lg font-semibold text-slate-950">{formatPrice(product.price)}</p>
                        {discount > 0 && <p className="mt-1 text-sm font-medium text-emerald-700">{discount}% OFF</p>}
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSearchDeleteTarget(result)}
                      aria-label={`Delete ${product.product_title}`}
                      title="Delete"
                      className="mr-5 shrink-0 cursor-pointer rounded-xl border border-rose-200 bg-white p-3 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {searchDeleteTarget && (
          <DeletePop
            productName={searchDeleteTarget.product?.product_title}
            isDeleting={isDeletingSearchProduct}
            onCancel={() => setSearchDeleteTarget(null)}
            onConfirm={async () => {
              setIsDeletingSearchProduct(true);
              const deleted = await deleteProduct({
                id: searchDeleteTarget.docId,
                product_title: searchDeleteTarget.product?.product_title,
              });
              setIsDeletingSearchProduct(false);
              if (deleted) setSearchDeleteTarget(null);
            }}
          />
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="category-filter">Filter by category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={changeCategory}
            className="h-11 min-w-64 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.code} value={category.name}>{category.name}</option>
            ))}
          </select>
          <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </span>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => loadPage({ pageIndex: 0, reset: true })}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold transition hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="mt-7 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative min-h-0 flex-1 overflow-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 shadow-[0_1px_0_0_#e2e8f0]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Image</th>
                  <th className="px-5 py-4 font-semibold">Product Details</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Pricing</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => <ProductRow key={product.id} product={product} onDelete={deleteProduct} />)}
              </tbody>
            </table>
            {isLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-white/80 text-sm font-medium text-blue-600 backdrop-blur-[1px]">
                <LoaderCircle className="h-6 w-6 animate-spin" />
                <span>{loadingLabel}</span>
              </div>
            )}
            {!isLoading && error && (
              <div className="px-6 py-16 text-center">
                <p className="text-sm text-rose-600">{error}</p>
                <button type="button" onClick={() => loadPage({ pageIndex: 0, reset: true })} className="mt-4 cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Try again</button>
              </div>
            )}
            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="px-6 py-16 text-center text-sm text-slate-500">No products found in this category.</div>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-600">
              Page {currentPage + 1} · {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isLoading || currentPage === 0}
                onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                type="button"
                disabled={isLoading || !currentPageData.hasNext || currentPageData.products.length === 0}
                onClick={goToNextPage}
                className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
