"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, RefreshCw, Search, Trash2, ClipboardList, ChevronDown, Check } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import useSWR from "swr";
import { deleteProduct as deleteProductApi, fetchInventory, searchProducts } from "../apis/api";
import { toast } from "sonner";
import { categories } from "../../constants/inventory";
import AddNewProduct from "./AddNewProduct";
import { sanitizeImageSrc } from "@/utils/imageValidation";
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

function fetchInitialInventory() {
  return fetchInventory();
}

function ProductRow({ product, onDelete }) {
  const router = useRouter();
  const [showDeletePop, setShowDeletePop] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isSearchResult = product.isSearchResult;
  const variants = isSearchResult ? [] : getVariantItems(product);
  const variantsLength = isSearchResult ? product.variants : variants.length;
  const thumbnail = isSearchResult ? product.image : variants.find((variant) => variant.images?.[0])?.images?.[0];
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <>
      <tr
        onClick={() => router.push(`/update-inventory/${encodeURIComponent(product.id)}`)}
        // onClick={() => router.push(`/product-detail/${product.id}`)}
        className="cursor-pointer border-t border-slate-200 bg-white transition-colors hover:bg-slate-50/70"
      >
        <td className="px-5 py-5">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image
              src={sanitizeImageSrc(thumbnail) || "/dacby-assets/download.svg"}
              alt={thumbnail ? product.product_title : "No image available"}
              fill
              sizes="96px"
              className={`object-contain p-2 ${!thumbnail ? "opacity-40" : ""}`}
            />
            {(product.condition) && (
              <span className="absolute right-0 top-0 rounded-bl-xl bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-black shadow-sm uppercase tracking-wider">
                {product.condition}
              </span>
            )}
          </div>
        </td>
        <td className="min-w-72 px-5 py-5">
          <p className="text-sm font-semibold text-slate-900">{product.product_title}</p>
          <p className="mt-1 text-xs text-slate-600">
            {variantsLength} {variantsLength === 1 ? "variant" : "variants"}
          </p>
        </td>
        <td className="min-w-40 px-5 py-5">
          <p className="text-[13px] font-medium text-slate-800">{product.category_name || "—"}</p>
          <p className="mt-1.5 inline-block rounded bg-slate-100 px-2 py-1 text-xs font-semibold tracking-wider text-slate-600">
            {product.code || "—"}
          </p>
        </td>
        <td className="min-w-32 px-5 py-5">
          <p className="text-sm font-semibold text-slate-900">{formatPrice(product.price)}</p>
          {product.mrp > product.price && (
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-slate-400 line-through">{formatPrice(product.mrp)}</p>
              <p className="whitespace-nowrap rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-bold text-emerald-500">{discount}% OFF</p>
            </div>
          )}
        </td>
        <td className="min-w-28 px-5 py-5">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium bg-white border border-slate-200 text-slate-700">
            {product.in_stock && !product.outofstock ? "In" : "Out"}
          </span>
        </td>
        <td className="min-w-28 px-5 py-5">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium bg-white border border-slate-200 text-slate-700">
            {product.is_active !== false && product.status !== "Deactive" ? "Active" : "Deactive"}
          </span>
        </td>
        <td className="min-w-32 px-5 py-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/ledger/${product.id}`);
              }}
              className="flex whitespace-nowrap items-center rounded-lg bg-white border border-emerald-200 px-4 py-1.5 text-[13px] font-semibold text-emerald-500 transition-all duration-200 hover:bg-emerald-50 active:scale-[0.98]"
            >
              Ledger Details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeletePop(true);
              }}
              aria-label={`Delete ${product.product_title}`}
              title="Delete"
              className="cursor-pointer p-2 text-rose-500 transition hover:text-rose-700"
            >
              <Trash2 className="h-5 w-5" />
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

let hasHandledReload = false;

export default function ProductInventory() {
  const {
    data: inventoryResponse,
    error: inventoryFetchError,
    mutate: mutateInventory,
  } = useSWR("product-inventory:first-page", fetchInitialInventory, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    shouldRetryOnError: false,
  });
  const initialPage = inventoryResponse
    ? {
      products: getProductsFromResponse(inventoryResponse),
      hasNext:
        inventoryResponse?.hasNext ??
        inventoryResponse?.hasMore ??
        getProductsFromResponse(inventoryResponse).length > 0,
    }
    : null;
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
  const [cachedAllPages, setCachedAllPages] = useState([]);
  const [pages, setPages] = useState(() => (initialPage ? [initialPage] : []));
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const ITEMS_PER_PAGE = 20;
  const [isLoading, setIsLoading] = useState(true);
  const [loadingLabel, setLoadingLabel] = useState("Loading inventory...");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchRequestId = useRef(0);
  const loaderRef = useRef(null);
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Restore search state from sessionStorage synchronously before paint
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== "undefined") {
      if (!hasHandledReload) {
        hasHandledReload = true;
        
        const navEntry = window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType("navigation")[0];
        const isReload = navEntry?.type === "reload";
        
        // Only clear if they hard refreshed specifically on THIS page
        // (Prevents clearing if they refreshed on a detail page and navigated here)
        if (isReload && navEntry.name === window.location.href) {
          sessionStorage.removeItem("inv_selectedCategoryCode");
        }
      }

      const savedCategory = sessionStorage.getItem("inv_selectedCategoryCode");
      if (savedCategory) setSelectedCategoryCode(savedCategory);

      const savedActive = sessionStorage.getItem("inv_searchActive");
      if (savedActive === "true") {
        setSearchQuery(sessionStorage.getItem("inv_searchQuery") || "");
        setIsSearchActive(true);
        const savedResults = sessionStorage.getItem("inv_searchResults");
        if (savedResults) {
          try {
            setSearchResults(JSON.parse(savedResults));
          } catch (e) { }
        }
      }
    }
  }, []);

  // Sync search state to sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("inv_searchQuery", searchQuery);
      sessionStorage.setItem("inv_searchResults", JSON.stringify(searchResults));
      sessionStorage.setItem("inv_searchActive", String(isSearchActive));
      sessionStorage.setItem("inv_selectedCategoryCode", selectedCategoryCode);
    }
  }, [searchQuery, searchResults, isSearchActive, selectedCategoryCode]);

  const loadPage = useCallback(async ({ startAfter, pageIndex, reset = false, code = undefined }) => {
    setIsLoading(true);
    setLoadingLabel(startAfter ? "Fetching next page..." : "Refreshing inventory...");
    setError("");

    try {
      const activeCode = code !== undefined ? code : selectedCategoryCode;
      const payload = startAfter ? { startAfter } : {};
      if (activeCode) {
        payload.code = activeCode;
      }
      const response = await fetchInventory(payload);
      const products = getProductsFromResponse(response);

      if (pageIndex > 0 && products.length === 0) {
        setPages((existingPages) => existingPages.map((page, index) =>
          index === existingPages.length - 1 ? { ...page, hasNext: false } : page
        ));
        return;
      }

      const hasNext = response?.hasNext ?? response?.hasMore ?? products.length > 0;
      const nextPage = { products, hasNext };

      if (pageIndex === 0 || reset) {
        await mutateInventory(response, { revalidate: false });
      }

      setPages((existingPages) => {
        if (reset) return [nextPage];
        return [...existingPages, nextPage];
      });
    } catch (requestError) {
      setError(requestError.message || "Failed to fetch inventory");
    } finally {
      setIsLoading(false);
    }
  }, [mutateInventory, selectedCategoryCode]);

  useEffect(() => {
    if (!inventoryResponse) return;

    const products = getProductsFromResponse(inventoryResponse);
    const hasNext = inventoryResponse?.hasNext ?? inventoryResponse?.hasMore ?? products.length > 0;
    setPages((existingPages) => existingPages.length > 0 ? existingPages : [{ products, hasNext }]);
    setIsLoading(false);
    setError("");
  }, [inventoryResponse]);

  const allProducts = useMemo(() => pages.flatMap(p => p.products), [pages]);
  const hasNextPage = pages.length > 0 ? pages[pages.length - 1].hasNext : false;

  const handleNextPage = async () => {
    if (isSearchActive) {
      if ((currentPageIndex + 1) * ITEMS_PER_PAGE < searchResults.length) {
        setCurrentPageIndex(prev => prev + 1);
      }
    } else {
      if (currentPageIndex < pages.length - 1) {
        setCurrentPageIndex(prev => prev + 1);
      } else if (hasNextPage) {
        const lastProduct = allProducts.at(-1);
        if (lastProduct?.id) {
          await loadPage({ startAfter: lastProduct.id, pageIndex: pages.length });
          setCurrentPageIndex(prev => prev + 1);
        }
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const canGoNext = isSearchActive 
    ? (currentPageIndex + 1) * ITEMS_PER_PAGE < searchResults.length 
    : (currentPageIndex < pages.length - 1 || hasNextPage);

  const listError = error || inventoryFetchError?.message || "";
  const listLoading = isLoading && allProducts.length === 0;

  const handleCategoryChange = async (newCode) => {
    if (newCode === selectedCategoryCode) return;
    
    setCurrentPageIndex(0);

    if (isSearchActive || searchQuery) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearchActive(false);
    }

    if (newCode === "") {
      setSelectedCategoryCode("");
      if (cachedAllPages.length > 0) {
        setPages(cachedAllPages);
      } else {
        loadPage({ reset: true, code: "", pageIndex: 0 });
      }
    } else {
      if (selectedCategoryCode === "") {
        setCachedAllPages(pages);
      }
      setSelectedCategoryCode(newCode);
      setPages([]);
      loadPage({ reset: true, code: newCode, pageIndex: 0 });
    }
  };

  const currentSearchProducts = useMemo(() => {
    return searchResults.slice(currentPageIndex * ITEMS_PER_PAGE, (currentPageIndex + 1) * ITEMS_PER_PAGE);
  }, [searchResults, currentPageIndex]);

  const displayProducts = isSearchActive
    ? currentSearchProducts.map(result => ({
      id: result.docId,
      isSearchResult: true,
      image: result.product?.image,
      product_title: result.product?.product_title,
      code: result.product?.code,
      category_name: result.product?.category,
      price: result.product?.price,
      mrp: result.product?.mrp,
      in_stock: !(result.product?.outOfStock || result.outOfStock),
      outofstock: result.product?.outOfStock || result.outOfStock,
      variants: result.product?.variants ?? 0,
      condition: result.product?.condition,
    }))
    : pages[currentPageIndex]?.products || [];

  async function executeSearch() {
    const query = searchQuery.trim();
    if (!query) {
      handleRefresh();
      return;
    }

    setCurrentPageIndex(0);
    setIsSearchActive(true);
    setIsSearching(true);
    setSearchError("");
    const requestId = ++searchRequestId.current;

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
  }

  function handleRefresh() {
    setCurrentPageIndex(0);
    setSearchQuery("");
    setIsSearchActive(false);
    setSearchResults([]);
    setSearchError("");
    searchRequestId.current += 1;
    setIsSearching(false);

    setSelectedCategoryCode("");
    setCachedAllPages([]);
    setPages([]);
    loadPage({ reset: true, code: "", pageIndex: 0 });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      executeSearch();
    }
  }

  function changeCategory(event) {
    setSelectedCategory(event.target.value);
  }

  async function deleteProduct(product) {
    try {
      const response = await deleteProductApi(encodeURIComponent(product.id));
      await mutateInventory(
        (currentResponse) => {
          const products = getProductsFromResponse(currentResponse).filter(
            (item) => item.id !== product.id,
          );
          if (Array.isArray(currentResponse)) return products;
          if (Array.isArray(currentResponse?.inventory)) {
            return { ...currentResponse, inventory: products };
          }
          if (Array.isArray(currentResponse?.data?.inventory)) {
            return {
              ...currentResponse,
              data: { ...currentResponse.data, inventory: products },
            };
          }
          if (Array.isArray(currentResponse?.data)) {
            return { ...currentResponse, data: products };
          }
          return currentResponse;
        },
        { revalidate: false },
      );
      setPages((existingPages) => existingPages.map((page) =>
        ({ ...page, products: page.products.filter((item) => item.id !== product.id) })
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

  return (
    <main className="h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-950 sm:px-10 lg:px-20">
      <section className="mx-auto flex h-full w-full flex-col">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Product Inventory</h1>
            {/* <p className="mt-2 text-slate-600">Manage and view all your products in one place.</p> */}
          </div>
          <AddNewProduct />
        </div>

        <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products by name or code..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={executeSearch}
              disabled={isSearching}
              title="Search"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 shrink-0"
            >
              <Search className="h-5 w-5" />
            </button>
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex h-11 min-w-[200px] sm:min-w-[260px] items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 hover:bg-slate-50"
              >
                <span className="truncate">
                  <span className="text-slate-500 font-normal mr-1.5">Category:</span>
                  {selectedCategoryCode === "" ? "All Categories" : categories.find(c => c.code === selectedCategoryCode)?.name || "All Categories"}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 ml-2 text-slate-500" />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 top-full z-50 mt-1.5 max-h-[400px] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/40">
                  <button
                    type="button"
                    onClick={() => {
                      handleCategoryChange("");
                      setIsCategoryOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
                      selectedCategoryCode === ""
                        ? "bg-slate-100 font-medium text-slate-900"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>All Categories</span>
                    {selectedCategoryCode === "" && <Check className="h-4 w-4 text-slate-700" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.code}
                      type="button"
                      onClick={() => {
                        handleCategoryChange(cat.code);
                        setIsCategoryOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
                        selectedCategoryCode === cat.code
                          ? "bg-slate-100 font-medium text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      {selectedCategoryCode === cat.code && <Check className="h-4 w-4 shrink-0 text-slate-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh / Clear"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200 shrink-0"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* <div className="mt-4 flex flex-wrap items-center gap-3">
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
        </div> */}

        <div className="mt-7 relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative min-h-0 flex-1 overflow-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-sm font-medium uppercase tracking-wider text-slate-500 shadow-[0_1px_0_0_#e2e8f0]">
                <tr>
                  <th className="px-5 py-4">IMAGE</th>
                  <th className="px-5 py-4">PRODUCT DETAILS</th>
                  <th className="px-5 py-4">CATEGORY & CODE</th>
                  <th className="px-5 py-4">PRICING</th>
                  <th className="px-5 py-4">STOCK</th>
                  <th className="px-5 py-4">SELL</th>
                  <th className="px-5 py-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {displayProducts.map((product) => <ProductRow key={product.id} product={product} onDelete={deleteProduct} />)}
              </tbody>
            </table>
            
            {!isLoading && !isSearching && (listError || searchError) && (
              <div className="px-6 py-16 text-center">
                <p className="text-sm text-rose-600">{listError || searchError}</p>
                {!isSearchActive && (
                  <button
                    type="button"
                    onClick={() => {
                      if (displayProducts.length > 0) {
                        const lastProduct = allProducts.at(-1);
                        if (lastProduct?.id) loadPage({ startAfter: lastProduct.id, pageIndex: pages.length });
                      } else {
                        loadPage({ pageIndex: 0, reset: true });
                      }
                    }}
                    className="mt-4 cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Try again
                  </button>
                )}
              </div>
            )}
            
            {!isLoading && !isSearching && !(listError || searchError) && displayProducts.length === 0 && (
              <div className="px-6 py-16 text-center text-sm text-slate-500">
                {isSearchActive ? "No products found for your search." : "No products found in this category."}
              </div>
            )}
          </div>
          
          {(isLoading || isSearching) && (
            <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-white/80 text-sm font-medium text-blue-600 backdrop-blur-[1px]">
              <LoaderCircle className="h-6 w-6 animate-spin" />
              <span>{isSearching ? "Searching products..." : loadingLabel}</span>
            </div>
          )}

          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm font-medium text-slate-600">
            <p>
              Page {currentPageIndex + 1}
              {isSearchActive && ` of ${Math.ceil(searchResults.length / ITEMS_PER_PAGE) || 1}`}
              {" · "} 
              {isSearchActive ? `${searchResults.length} products found` : `${displayProducts.length} products on this page`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0 || isLoading}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                &lt; Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!canGoNext || isLoading}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
