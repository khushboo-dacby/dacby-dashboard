import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { X, Search, RefreshCw, LoaderCircle, ChevronDown, ChevronRight, Check } from "lucide-react";
import { fetchInventory, searchProducts, getProductDetail } from "@/app/apis/api";
import { categories } from "@/constants/inventory";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function getProductsFromResponse(response) {
  const products = Array.isArray(response)
    ? response
    : response?.inventory ?? response?.data?.inventory ?? response?.data ?? [];

  if (!Array.isArray(products)) {
    return [];
  }
  return products;
}

function getVariantItems(product) {
  return Object.values(product.vendors ?? {}).flatMap((vendor) =>
    Object.values(vendor.combination_offered ?? {}).flatMap((combination) =>
      Object.values(combination ?? {})
    )
  );
}

export default function AccessoryModal({ isOpen, onClose, initialAccessories = {}, onSave }) {
  const [existingAccessories, setExistingAccessories] = useState([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchRequestId = useRef(0);
  
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  const [expandedProducts, setExpandedProducts] = useState({});
  const [expandedProductDetails, setExpandedProductDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadInitialAccessories();
      loadPage({ reset: true, code: "", pageIndex: 0 });
    } else {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearchActive(false);
      setPages([]);
      setSelectedCategoryCode("");
      setExpandedProducts({});
      setExpandedProductDetails({});
      setSelectedItems({});
      setExistingAccessories([]);
    }
  }, [isOpen]);

  async function loadInitialAccessories() {
    const accessoryKeys = Object.keys(initialAccessories || {});
    if (accessoryKeys.length === 0) return;
    
    setIsLoadingExisting(true);
    try {
      const details = await Promise.all(
        accessoryKeys.map(async (key) => {
          const acc = initialAccessories[key];
          try {
            const response = await getProductDetail(acc.id);
            const product = response?.details || response;
            return { key, ...acc, product };
          } catch (e) {
            return { key, ...acc, error: true };
          }
        })
      );
      setExistingAccessories(details.filter(d => d.product));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingExisting(false);
    }
  }

  const loadPage = useCallback(async ({ startAfter, pageIndex, reset = false, code = undefined }) => {
    setIsLoading(true);
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

      setPages((existingPages) => {
        if (reset) return [nextPage];
        return [...existingPages, nextPage];
      });
    } catch (requestError) {
      console.error(requestError);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryCode]);

  async function executeSearch() {
    const query = searchQuery.trim();
    if (!query) {
      handleRefresh();
      return;
    }
    
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
    setSearchQuery("");
    setIsSearchActive(false);
    setSearchResults([]);
    setSearchError("");
    searchRequestId.current += 1;
    setIsSearching(false);
    
    setSelectedCategoryCode("");
    setPages([]);
    loadPage({ reset: true, code: "", pageIndex: 0 });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      executeSearch();
    }
  }

  const handleCategoryChange = async (newCode) => {
    if (newCode === selectedCategoryCode) return;
    
    if (isSearchActive || searchQuery) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearchActive(false);
    }
    
    setSelectedCategoryCode(newCode);
    setPages([]);
    loadPage({ reset: true, code: newCode, pageIndex: 0 });
  };

  const allProducts = useMemo(() => pages.flatMap(p => p.products), [pages]);
  const hasNextPage = pages.length > 0 ? pages[pages.length - 1].hasNext : false;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading && !isSearchActive) {
          const lastProduct = allProducts.at(-1);
          if (lastProduct?.id) {
            loadPage({ startAfter: lastProduct.id, pageIndex: pages.length });
          }
        }
      },
      { root: null, rootMargin: "150px", threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isLoading, isSearchActive, allProducts, pages.length, loadPage]);

  const displayProducts = isSearchActive 
    ? searchResults.map(result => ({
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
    : allProducts;

  async function toggleProductAccordion(product) {
    const productId = product.id;
    if (expandedProducts[productId]) {
      setExpandedProducts(prev => ({ ...prev, [productId]: false }));
      return;
    }
    
    setExpandedProducts(prev => ({ ...prev, [productId]: true }));
    
    if (!expandedProductDetails[productId]) {
      setLoadingDetails(prev => ({ ...prev, [productId]: true }));
      try {
        const response = await getProductDetail(productId);
        const details = response?.details || response;
        setExpandedProductDetails(prev => ({ ...prev, [productId]: details }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(prev => ({ ...prev, [productId]: false }));
      }
    }
  }

  function handleToggleItem(product, item) {
    const key = `${product.id}_${item.sku}`;
    setSelectedItems(prev => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = { product, item };
      }
      return next;
    });
  }

  function removeExistingAccessory(keyToRemove) {
    setExistingAccessories(prev => prev.filter(a => a.key !== keyToRemove));
  }

  function handleSave() {
    const newAccessories = {};
    let counter = 1;
    
    existingAccessories.forEach(acc => {
      newAccessories[`item${counter}`] = {
        id: acc.id,
        sku: acc.sku
      };
      counter++;
    });

    Object.values(selectedItems).forEach(({ product, item }) => {
      const isDuplicate = Object.values(newAccessories).some(
        a => a.id === product.id && a.sku === item.sku
      );
      if (!isDuplicate) {
        newAccessories[`item${counter}`] = {
          id: product.id,
          sku: item.sku
        };
        counter++;
      }
    });

    onSave(newAccessories);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex flex-col w-full max-w-5xl max-h-[95vh] rounded-2xl bg-slate-50 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Select Accessories</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-full hover:bg-slate-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoadingExisting ? (
            <div className="flex justify-center py-4">
              <LoaderCircle className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : (existingAccessories.length > 0 || Object.keys(selectedItems).length > 0) ? (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Selected Accessories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {existingAccessories.map(acc => {
                  const item = getVariantItems(acc.product).find(i => i.sku === acc.sku) || {};
                  return (
                    <div key={acc.key} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-slate-100">
                        <Image
                          src={item.images?.[0] || acc.product.image || "/dacby-assets/download.svg"}
                          alt={acc.product.product_title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{acc.product.product_title}</p>
                        <p className="text-xs text-slate-500 font-mono truncate">{acc.sku}</p>
                      </div>
                      <button
                        onClick={() => removeExistingAccessory(acc.key)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {Object.entries(selectedItems).map(([key, { product, item }]) => (
                  <div key={key} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm">
                    <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-white">
                      <Image
                        src={item.images?.[0] || product.image || "/dacby-assets/download.svg"}
                        alt={product.product_title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{product.product_title}</p>
                      <p className="text-xs text-slate-500 font-mono truncate">{item.sku}</p>
                    </div>
                    <button
                      onClick={() => handleToggleItem(product, item)}
                      className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg transition shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products to add as accessories..."
                  className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={executeSearch}
                  disabled={isSearching}
                  className="h-10 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  Search
                </button>
                <select
                  value={selectedCategoryCode}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="h-10 px-3 min-w-[150px] text-sm font-medium rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.code} value={cat.code}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="h-10 w-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-10"></th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {displayProducts.map((product) => {
                    const isExpanded = expandedProducts[product.id];
                    const details = expandedProductDetails[product.id];
                    const variants = details ? getVariantItems(details) : [];
                    const isLoadingVariants = loadingDetails[product.id];

                    const variantsLength = product.isSearchResult ? product.variants : getVariantItems(product).length;
                    const thumbnail = product.isSearchResult ? product.image : getVariantItems(product).find(v => v.images?.[0])?.images?.[0];

                    return (
                      <React.Fragment key={product.id}>
                        <tr 
                          onClick={() => toggleProductAccordion(product)}
                          className="hover:bg-slate-50 cursor-pointer transition"
                        >
                          <td className="px-5 py-4">
                            {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-white shrink-0">
                                <Image
                                  src={thumbnail || "/dacby-assets/download.svg"}
                                  alt={product.product_title}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-slate-900">{product.product_title}</p>
                                <p className="text-xs text-orange-600 mt-0.5">{variantsLength} variants</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-slate-700">{product.category_name || "—"}</p>
                            <p className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded inline-block mt-1 font-medium">{product.code || "—"}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-slate-900">{formatPrice(product.price)}</p>
                            {product.mrp > product.price && (
                              <p className="text-xs text-slate-400 line-through mt-0.5">{formatPrice(product.mrp)}</p>
                            )}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-50/50">
                            <td colSpan={4} className="p-0 border-b border-slate-200">
                              <div className="px-14 py-4 border-l-4 border-blue-500">
                                {isLoadingVariants ? (
                                  <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <LoaderCircle className="w-4 h-4 animate-spin" /> Loading variants...
                                  </div>
                                ) : variants.length > 0 ? (
                                  <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Available SKUs</h4>
                                    {variants.map(item => {
                                      const isSelected = !!selectedItems[`${product.id}_${item.sku}`];
                                      return (
                                        <label 
                                          key={item.sku}
                                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                                            isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                                          }`}
                                        >
                                          <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                                            isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"
                                          }`}>
                                            {isSelected && <Check className="w-3.5 h-3.5" />}
                                          </div>
                                          <div className="relative h-10 w-10 rounded border border-slate-100 bg-white shrink-0 overflow-hidden">
                                            <Image src={item.images?.[0] || "/dacby-assets/download.svg"} alt="" fill className="object-contain" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">{item.combination_name || "Variant"}</p>
                                            <p className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900">{formatPrice(item.sell_price)}</p>
                                            <p className="text-xs text-slate-500">Stock: {item.stocks || 0}</p>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-sm text-slate-500">No variants found for this product.</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  
                  {isLoading && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center">
                        <LoaderCircle className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                      </td>
                    </tr>
                  )}
                  {searchError && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-rose-500 text-sm">
                        {searchError}
                      </td>
                    </tr>
                  )}
                  {!isLoading && displayProducts.length === 0 && !searchError && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {!isSearchActive && hasNextPage && (
              <div ref={loaderRef} className="h-10" />
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
