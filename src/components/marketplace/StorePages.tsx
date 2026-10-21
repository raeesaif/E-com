import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Filter,
  Heart,
  Layers,
  Loader2,
  Package,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { categories, finalPrice, money, products as seedProducts, type Product } from "@/lib/marketplace";
import {
  ApiOrderStatusBadge,
  BackLink,
  CustomerNavStrip,
  DiscountBadge,
  EmptyState,
  OrderStatusBadge,
  OrderStatusTimeline,
  PageHeader,
  PaymentBadge,
  Pagination,
  ProductGrid,
  ProductImage,
  ProductPrice,
  QuantityControl,
  RecentlyViewedStrip,
  SearchInput,
  StockBadge,
} from "./Common";
import { useAppState } from "./useAppState";
import { CustomerAccount } from "./CustomerAccount";
import { Navbar } from "./Shells";
import { Footer } from "./Footer";
import { Badge } from "@/components/ui/badge";
import {
  productApi,
  mapBackendProductToProduct,
  fetchProducts,
  type ProductFilterParams,
  type Pagination as ApiPagination,
} from "@/api/product.api";
import { categoryApi, type ActiveCategoryItem } from "@/api/category.api";
import { orderApi, formatOrderDate, type CustomerOrder } from "@/api/order.api";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface HomePageFilterParams {
  category?: string;
  categoryId?: string;
}

/**
 * Frontend filter function for Home Page products.
 * Structured cleanly so that when backend filtering is introduced later,
 * this function can easily be replaced by/delegated to a backend query call.
 */
export function filterHomeProducts(
  products: Product[],
  filters: HomePageFilterParams,
): Product[] {
  if (!filters.category || filters.category === "All") {
    return products;
  }
  return products.filter((p) => {
    if (filters.categoryId && p.categoryId && p.categoryId === filters.categoryId) {
      return true;
    }
    if (p.categoryId && p.categoryId === filters.category) {
      return true;
    }
    return p.category.toLowerCase() === filters.category.toLowerCase();
  });
}

export function HomePage() {
  const { products, categories: appCategories } = useAppState();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [categoriesList, setCategoriesList] = useState<ActiveCategoryItem[]>(() => {
    const cached = categoryApi.getCachedActive();
    return cached.length > 0 ? cached : (appCategories || []);
  });

  useEffect(() => {
    if (appCategories && appCategories.length > 0) {
      setCategoriesList(appCategories);
      return;
    }
    categoryApi.listActive().then((items) => {
      if (Array.isArray(items) && items.length > 0) {
        setCategoriesList(items);
      }
    });
  }, [appCategories]);

  // Take only 6 categories from the Category API as requested
  const visibleCategories = useMemo(() => {
    if (categoriesList && categoriesList.length > 0) {
      return categoriesList.slice(0, 6);
    }
    return categories.slice(0, 6).map((name, i) => ({
      _id: `seed-cat-${i}`,
      name,
    }));
  }, [categoriesList]);

  // Frontend filtering logic applied directly on the Home page
  const filteredProducts = useMemo(() => {
    return filterHomeProducts(products, {
      category: selectedCategory,
      categoryId: selectedCategoryId,
    });
  }, [products, selectedCategory, selectedCategoryId]);

  // Hero preview products from live API (fallback to seed if initial load is pending)
  const heroProducts = useMemo(() => {
    return (products.length > 0 ? products : seedProducts).slice(0, 4);
  }, [products]);

  // Featured products matching current category filter
  const featured = useMemo(() => {
    return filteredProducts.slice(0, 8);
  }, [filteredProducts]);

  // Discounted products matching current category filter
  const discounted = useMemo(() => {
    return filteredProducts.filter((p) => p.discount > 0).slice(0, 4);
  }, [filteredProducts]);

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b bg-surface">
          <div className="page-shell grid min-h-[520px] items-center gap-10 py-14 lg:grid-cols-[1.05fr_.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-bold text-primary shadow-xs">
                CURATED INDEPENDENT BRANDS
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl tracking-tight">
                Remarkable goods, thoughtfully gathered.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                Shop considered essentials from trusted independent sellers—all in one modern
                marketplace.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="font-semibold shadow-sm">
                  <Link to="/shop">
                    Shop now <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/register">Start selling</Link>
                </Button>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t pt-6">
                <div>
                  <p className="font-display text-xl font-extrabold">40+</p>
                  <p className="text-xs text-muted-foreground">Independent sellers</p>
                </div>
                <div>
                  <p className="font-display text-xl font-extrabold">2.4k</p>
                  <p className="text-xs text-muted-foreground">Curated products</p>
                </div>
                <div>
                  <p className="font-display text-xl font-extrabold">4.9/5</p>
                  <p className="text-xs text-muted-foreground">Buyer satisfaction</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="subtle-grid rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="grid grid-cols-2 gap-3.5">
                {heroProducts.map((product) => (
                  <Link
                    key={product.id}
                    to="/products/$id"
                    params={{ id: product.productId || product.id }}
                    className="group relative overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-md hover:border-primary/40"
                  >
                    <ProductImage
                      product={product}
                      className="aspect-square transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 left-2 right-2 rounded-md bg-card/90 px-2.5 py-1.5 text-xs font-bold backdrop-blur-md shadow-xs truncate">
                      {product.name}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter Bar from Category API (only 6 categories shown + All products) */}
        <section className="page-shell py-10">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <Button
              type="button"
              variant={selectedCategory === "All" ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory("All");
                setSelectedCategoryId(undefined);
              }}
              className={cn(
                "whitespace-nowrap transition-colors",
                selectedCategory === "All" && "shadow-xs font-bold",
              )}
            >
              All products
            </Button>
            {visibleCategories.map((category) => {
              const isActive =
                selectedCategory === category.name ||
                (selectedCategoryId !== undefined && selectedCategoryId === category._id);
              return (
                <Button
                  key={category._id}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setSelectedCategoryId(category._id);
                  }}
                  className={cn(
                    "whitespace-nowrap transition-colors",
                    isActive && "shadow-xs font-bold",
                  )}
                >
                  {category.name}
                </Button>
              );
            })}
          </div>
        </section>

        {/* Featured Products (dynamically filtered on Home page) */}
        <section className="page-shell pb-16">
          <PageHeader
            eyebrow={selectedCategory === "All" ? "Editor’s picks" : "Category filter"}
            title={selectedCategory === "All" ? "Featured products" : `${selectedCategory} products`}
            description={
              selectedCategory === "All"
                ? undefined
                : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} in ${selectedCategory}.`
            }
            action={
              <Button asChild variant="ghost">
                <Link to="/shop">
                  View full shop <ArrowRight />
                </Link>
              </Button>
            }
          />
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No products found in "{selectedCategory}".
            </div>
          ) : (
            <ProductGrid products={featured} className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
          )}
        </section>

        {/* Limited Offers / Discounted Products */}
        {discounted.length > 0 && (
          <section className="border-y bg-surface">
            <div className="page-shell py-16">
              <PageHeader
                eyebrow="Limited offers"
                title="Worth a closer look"
                description="Selected products with considered prices while stock lasts."
              />
              <ProductGrid products={discounted} className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card p-4 shadow-sm animate-pulse">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
      <div className="mt-6 flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  totalDocuments: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

function CatalogPagination({
  page,
  totalPages,
  totalDocuments,
  hasPrevPage,
  hasNextPage,
  onPageChange,
  isLoading,
}: CatalogPaginationProps) {
  if (totalPages <= 0) return null;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [];
    pages.push(1);
    if (page > 3) {
      pages.push("ellipsis");
    }
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) {
      pages.push("ellipsis");
    }
    pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Product catalog pagination"
      className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground order-2 sm:order-1">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>{" "}
        <span className="text-xs text-muted-foreground/80">
          (Total items: {totalDocuments})
        </span>
      </p>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage || isLoading}
          className="gap-1 h-9 px-3"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((p, idx) =>
            p === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-muted-foreground text-sm select-none"
              >
                …
              </span>
            ) : (
              <Button
                key={p}
                size="sm"
                variant={p === page ? "default" : "outline"}
                onClick={() => onPageChange(p)}
                disabled={isLoading}
                className={cn(
                  "size-9 p-0 font-medium",
                  p === page && "shadow-sm pointer-events-none",
                )}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || isLoading}
          className="gap-1 h-9 px-3"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}

export function ShopPage() {
  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Category state
  const [category, setCategory] = useState<string>("all");
  const [activeCategories, setActiveCategories] = useState<ActiveCategoryItem[]>([]);

  // Availability state
  const [availability, setAvailability] = useState<"all" | "inStock" | "outOfStock">("all");

  // Price range state
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [debouncedMinPrice, setDebouncedMinPrice] = useState<number | undefined>(undefined);

  // Sorting & Featured
  const [sort, setSort] = useState<"newest" | "low-to-high" | "high-to-low" | "featured">("newest");
  const [featured, setFeatured] = useState<boolean>(false);

  // Mobile filters collapsible
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination state (10 per page default)
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<ApiPagination>({
    page: 1,
    limit: 10,
    totalDocuments: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Query response state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Read initial query params from URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get("page") || "1", 10);
    if (!isNaN(p) && p > 0) setPage(p);

    const s = params.get("search");
    if (s) {
      setSearch(s);
      setDebouncedSearch(s);
    }

    const c = params.get("category");
    if (c) setCategory(c);

    const a = params.get("availability");
    if (a === "inStock" || a === "outOfStock" || a === "all") {
      setAvailability(a);
    }

    const maxP = params.get("maxPrice");
    if (maxP && !isNaN(Number(maxP))) {
      const val = Number(maxP);
      setMaxPrice(val);
      setDebouncedMaxPrice(val);
    }

    const minP = params.get("minPrice");
    if (minP && !isNaN(Number(minP))) {
      const val = Number(minP);
      setMinPrice(val);
      setDebouncedMinPrice(val);
    }

    const so = params.get("sort");
    if (so === "low-to-high" || so === "high-to-low" || so === "featured" || so === "newest") {
      setSort(so);
    }

    const f = params.get("featured");
    if (f === "true") setFeatured(true);
  }, []);

  // Fetch active categories list from backend
  useEffect(() => {
    categoryApi
      .listActive()
      .then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setActiveCategories(cats);
        }
      })
      .catch(() => {
        // Fallback or leave empty
      });
  }, []);

  // Debounce search input (350ms) & reset page to 1
  const isFirstSearchRender = useRef(true);
  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page to 1 when search changes
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Debounce slider updates or typed numbers (350ms) & reset page to 1
  const isFirstPriceRender = useRef(true);
  useEffect(() => {
    if (isFirstPriceRender.current) {
      isFirstPriceRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice);
      setDebouncedMinPrice(minPrice);
      setPage(1); // Reset page to 1 when price changes
    }, 350);
    return () => clearTimeout(timer);
  }, [maxPrice, minPrice]);

  // Main API data fetching function
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const filterParams: ProductFilterParams = {
        page,
        limit: 10,
        sort,
      };

      if (debouncedSearch.trim()) {
        filterParams.search = debouncedSearch.trim();
      }
      if (category && category !== "all" && category !== "All") {
        filterParams.category = category;
      }
      if (availability && availability !== "all") {
        filterParams.availability = availability;
      }
      if (debouncedMaxPrice !== undefined && !isNaN(debouncedMaxPrice)) {
        filterParams.maxPrice = debouncedMaxPrice;
      }
      if (debouncedMinPrice !== undefined && !isNaN(debouncedMinPrice)) {
        filterParams.minPrice = debouncedMinPrice;
      }
      if (featured) {
        filterParams.featured = true;
      }

      // Synchronize URL query parameters
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams();
        if (page > 1) urlParams.set("page", page.toString());
        if (debouncedSearch.trim()) urlParams.set("search", debouncedSearch.trim());
        if (category && category !== "all" && category !== "All") urlParams.set("category", category);
        if (availability && availability !== "all") urlParams.set("availability", availability);
        if (debouncedMaxPrice !== undefined && !isNaN(debouncedMaxPrice)) urlParams.set("maxPrice", debouncedMaxPrice.toString());
        if (debouncedMinPrice !== undefined && !isNaN(debouncedMinPrice)) urlParams.set("minPrice", debouncedMinPrice.toString());
        if (sort !== "newest") urlParams.set("sort", sort);
        if (featured) urlParams.set("featured", "true");

        const newSearch = urlParams.toString();
        const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`;
        window.history.replaceState(null, "", newUrl);
      }

      const res = await fetchProducts(filterParams);
      if (res && res.data) {
        setProducts(res.data.map(mapBackendProductToProduct));
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setIsError(true);
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Failed to load products from marketplace API.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    category,
    availability,
    debouncedMaxPrice,
    debouncedMinPrice,
    sort,
    featured,
  ]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (typeof window !== "undefined") {
      const catalogEl = document.getElementById("catalog-products-container");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 120, behavior: "smooth" });
      }
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("all");
    setAvailability("all");
    setMaxPrice(undefined);
    setDebouncedMaxPrice(undefined);
    setMinPrice(undefined);
    setDebouncedMinPrice(undefined);
    setSort("newest");
    setFeatured(false);
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch.trim() ||
      (category && category !== "all" && category !== "All") ||
      availability !== "all" ||
      debouncedMaxPrice !== undefined ||
      debouncedMinPrice !== undefined ||
      featured ||
      sort !== "newest",
  );

  const categoryList = useMemo(() => {
    if (activeCategories.length > 0) {
      return activeCategories.map((c) => ({ id: c._id, name: c.name }));
    }
    return categories.map((name) => ({ id: name, name }));
  }, [activeCategories]);

  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="shop" />
        <PageHeader
          eyebrow="Marketplace Catalog"
          title="Shop all products"
          description={
            isLoading
              ? "Loading live marketplace catalog..."
              : `Showing ${pagination.totalDocuments} curated products from independent sellers.`
          }
        />

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Aside Filters Panel */}
          <aside className="panel h-fit p-5 space-y-6">
            <div className="flex items-center justify-between font-display font-bold">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" /> Filters
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-normal text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="size-3" /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categories
                </Label>
                {category !== "all" && category !== "All" && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("all");
                      setPage(1);
                    }}
                    className="text-[11px] text-primary hover:underline"
                  >
                    All
                  </button>
                )}
              </div>

              {/* Sidebar Interactive Category List */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setCategory("all");
                    setPage(1);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                    category === "all" || category === "All"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="size-4" /> All Categories
                  </span>
                  {(category === "all" || category === "All") && (
                    <Check className="size-3.5" />
                  )}
                </button>

                {categoryList.map((cat) => {
                  const isSelected = category === cat.name || category === cat.id;
                  return (
                    <button
                      key={cat.id || cat.name}
                      type="button"
                      onClick={() => {
                        setCategory(cat.name);
                        setPage(1);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                      )}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && <Check className="size-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Select fallback */}
              <div className="sm:hidden pt-1">
                <Select
                  value={category}
                  onValueChange={(val) => {
                    setCategory(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categoryList.map((item) => (
                      <SelectItem key={item.id || item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Stock Availability Filter: Segmented buttons / radio group */}
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Stock Availability
              </Label>
              <div
                role="radiogroup"
                aria-label="Stock availability filter"
                className="grid grid-cols-3 gap-1 p-1 bg-muted/60 rounded-lg border text-center"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={availability === "all"}
                  onClick={() => {
                    setAvailability("all");
                    setPage(1);
                  }}
                  className={cn(
                    "py-1.5 px-2 rounded-md text-xs font-semibold transition-all",
                    availability === "all"
                      ? "bg-background text-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={availability === "inStock"}
                  onClick={() => {
                    setAvailability("inStock");
                    setPage(1);
                  }}
                  className={cn(
                    "py-1.5 px-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1",
                    availability === "inStock"
                      ? "bg-background text-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  In Stock
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={availability === "outOfStock"}
                  onClick={() => {
                    setAvailability("outOfStock");
                    setPage(1);
                  }}
                  className={cn(
                    "py-1.5 px-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1",
                    availability === "outOfStock"
                      ? "bg-background text-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Out
                </button>
              </div>
            </div>

            <Separator />

            {/* Price Filter: Slider & Number Inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Price Filter</span>
                <span className="text-foreground lowercase font-medium">
                  {maxPrice !== undefined ? `max $${maxPrice}` : "any max"}
                </span>
              </div>

              {/* Interactive Price Range Slider */}
              <div className="pt-2 pb-1">
                <Slider
                  value={[maxPrice !== undefined ? maxPrice : 500]}
                  min={0}
                  max={500}
                  step={5}
                  onValueChange={(val) => setMaxPrice(val[0])}
                  onValueCommit={(val) => {
                    setDebouncedMaxPrice(val[0]);
                    setPage(1);
                  }}
                  className="cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>$0</span>
                  <span>$250</span>
                  <span>$500+</span>
                </div>
              </div>

              {/* Number Inputs for Min & Max Price */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Min price ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={minPrice ?? ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? undefined : Number(e.target.value);
                      setMinPrice(val);
                    }}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Max price ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="500"
                    value={maxPrice ?? ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? undefined : Number(e.target.value);
                      setMaxPrice(val);
                    }}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Quick price chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[25, 50, 100, 200].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setMaxPrice(preset);
                      setDebouncedMaxPrice(preset);
                      setPage(1);
                    }}
                    className={cn(
                      "text-[11px] px-2 py-0.5 rounded-full border transition-colors",
                      maxPrice === preset
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    ≤ ${preset}
                  </button>
                ))}
                {(maxPrice !== undefined || minPrice !== undefined) && (
                  <button
                    type="button"
                    onClick={() => {
                      setMaxPrice(undefined);
                      setDebouncedMaxPrice(undefined);
                      setMinPrice(undefined);
                      setDebouncedMinPrice(undefined);
                      setPage(1);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-dashed text-muted-foreground hover:text-destructive"
                  >
                    Reset price
                  </button>
                )}
              </div>
            </div>

            <Separator />

            {/* Featured Only Filter */}
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 p-2 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors text-sm font-medium">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => {
                    setFeatured(e.target.checked);
                    setPage(1);
                  }}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
                <Sparkles className="size-4 text-amber-500 shrink-0" />
                <span className="text-xs font-medium">Featured products only</span>
              </label>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              <RotateCcw className="size-4" /> Clear all filters
            </Button>
          </aside>

          {/* Main Products Listing Area */}
          <div id="catalog-products-container" className="scroll-mt-6">
            {/* Search Input & Sort Dropdown bar */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products by title, description or ID..."
                  className="pl-10 pr-10 h-10 w-full"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setDebouncedSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search input"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Select
                  value={sort}
                  onValueChange={(val: "newest" | "low-to-high" | "high-to-low" | "featured") => {
                    setSort(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[200px] h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                    <SelectItem value="high-to-low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filter Pills Bar */}
            {hasActiveFilters && (
              <div className="mb-5 flex flex-wrap items-center gap-2 rounded-lg bg-muted/40 p-2.5 text-xs">
                <span className="font-semibold text-muted-foreground">Active filters:</span>

                {debouncedSearch.trim() && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background border px-2.5 py-1 text-foreground shadow-xs">
                    Search: "{debouncedSearch}"
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setDebouncedSearch("");
                        setPage(1);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove search filter"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {category !== "all" && category !== "All" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background border px-2.5 py-1 text-foreground shadow-xs">
                    Category: {category}
                    <button
                      type="button"
                      onClick={() => {
                        setCategory("all");
                        setPage(1);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove category filter"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {availability !== "all" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background border px-2.5 py-1 text-foreground shadow-xs">
                    Availability: {availability === "inStock" ? "In Stock" : "Out of Stock"}
                    <button
                      type="button"
                      onClick={() => {
                        setAvailability("all");
                        setPage(1);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove availability filter"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {debouncedMaxPrice !== undefined && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background border px-2.5 py-1 text-foreground shadow-xs">
                    Max: ${debouncedMaxPrice}
                    <button
                      type="button"
                      onClick={() => {
                        setMaxPrice(undefined);
                        setDebouncedMaxPrice(undefined);
                        setPage(1);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove max price filter"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {debouncedMinPrice !== undefined && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background border px-2.5 py-1 text-foreground shadow-xs">
                    Min: ${debouncedMinPrice}
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice(undefined);
                        setDebouncedMinPrice(undefined);
                        setPage(1);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove min price filter"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {featured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background border px-2.5 py-1 text-foreground shadow-xs">
                    Featured Only
                    <button
                      type="button"
                      onClick={() => {
                        setFeatured(false);
                        setPage(1);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove featured filter"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                {sort !== "newest" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background border px-2.5 py-1 text-foreground shadow-xs">
                    Sort: {sort}
                    <button
                      type="button"
                      onClick={() => {
                        setSort("newest");
                        setPage(1);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Reset sort"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-auto text-primary hover:underline font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid / Skeleton / Error / Empty states */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="panel p-10 text-center space-y-4">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertCircle className="size-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold">Failed to load products</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {errorMessage}
                  </p>
                </div>
                <Button onClick={loadProducts} variant="outline" className="gap-2">
                  <RotateCcw className="size-4" /> Retry Connection
                </Button>
              </div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                <CatalogPagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  totalDocuments={pagination.totalDocuments}
                  hasPrevPage={pagination.hasPrevPage}
                  hasNextPage={pagination.hasNextPage}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              </>
            ) : (
              <div className="panel p-12 text-center space-y-4">
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Package className="size-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-xl font-bold">No products found</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    No products matched your search or filter settings. Try adjusting your search term, expanding your price range, or clearing filters.
                  </p>
                </div>
                <Button onClick={handleClearFilters} variant="outline" className="gap-2">
                  <RotateCcw className="size-4" /> Reset all filters
                </Button>
              </div>
            )}
          </div>
        </div>

        <RecentlyViewedStrip />
      </main>
      <Footer />
    </>
  );
}

export function ProductDetailsPage({ id }: { id: string }) {
  const {
    products,
    addToCart,
    isInWishlist,
    toggleWishlist,
    addRecentlyViewed,
    user,
    accessToken,
    setLoginModalOpen,
  } = useAppState();

  // Check in-memory cache and state first to avoid redundant API calls
  const cachedBp = productApi.getCachedProduct(id);
  const foundInProducts = products.find(
    (item) => item.id === id || item._id === id || item.productId === id,
  );
  const initialProduct = cachedBp
    ? mapBackendProductToProduct(cachedBp)
    : foundInProducts ?? null;

  const [backendProduct, setBackendProduct] = useState<Product | null>(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [buyingNow, setBuyingNow] = useState(false);
  const navigate = useNavigate();

  const handleBuyNow = async () => {
    if (!user || !accessToken) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      }
      setLoginModalOpen(true);
      return;
    }

    if (buyingNow) return;

    const targetProductId = product.productId || product.id || product._id;
    if (!targetProductId) {
      toast.error("Product information is missing. Please refresh the page.");
      return;
    }

    setBuyingNow(true);
    try {
      const session = await orderApi.checkout(accessToken, {
        productId: String(targetProductId),
        quantity,
      });

      if (!session?.checkoutUrl) {
        throw new Error("Checkout session did not return a valid URL");
      }

      window.location.href = session.checkoutUrl;
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to initiate Stripe checkout",
      );
      setBuyingNow(false);
    }
  };

  useEffect(() => {
    // If we already have the product in state or cache, skip the network request
    if (backendProduct || initialProduct) {
      setLoading(false);
      return;
    }

    const cached = productApi.getCachedProduct(id);
    if (cached) {
      setBackendProduct(mapBackendProductToProduct(cached));
      setLoading(false);
      return;
    }

    const found = products.find(
      (item) => item.id === id || item._id === id || item.productId === id,
    );
    if (found) {
      setBackendProduct(found);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    productApi
      .getProduct(id)
      .then((bp) => {
        if (!active) return;
        setBackendProduct(mapBackendProductToProduct(bp));
      })
      .catch((err) => {
        console.warn("[ProductDetailsPage] Could not fetch product directly from API:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, products, backendProduct, initialProduct]);

  const product =
    backendProduct ??
    products.find(
      (item) => item.id === id || item._id === id || item.productId === id,
    ) ??
    seedProducts.find(
      (item) => item.id === id || item._id === id || item.productId === id,
    ) ??
    seedProducts[0];

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product?.id, addRecentlyViewed]);

  if (loading && !product) {
    return (
      <>
        <Navbar />
        <main className="page-shell py-8">
          <CustomerNavStrip current="shop" />
          <BackLink to="/shop" label="Back to shop" />
          <div className="grid gap-9 lg:grid-cols-2 animate-pulse">
            <div className="aspect-square rounded-lg bg-muted" />
            <div className="flex flex-col justify-center space-y-4">
              <div className="h-6 w-1/4 rounded bg-muted" />
              <div className="h-10 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-24 w-full rounded bg-muted" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) return null;
  const isWishlisted = isInWishlist(product.id);

  return (
    <>
      <Navbar />
      <main className="page-shell py-8">
        <CustomerNavStrip current="shop" />
        <BackLink to="/shop" label="Back to shop" />
        <div className="grid gap-9 lg:grid-cols-2">
          <ProductImage product={product} className="aspect-square rounded-lg border" />
          <div className="flex flex-col justify-center">
            <div className="flex gap-2">
              <DiscountBadge discount={product.discount} />
              <StockBadge stock={product.stock} />
            </div>
            <p className="mt-5 text-sm font-bold text-primary">{product.category}</p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sold by <span className="font-semibold text-foreground">{product.storeName || product.seller}</span>
            </p>
            <p className="mt-6 leading-7 text-muted-foreground">{product.description}</p>
            <div className="mt-6">
              <ProductPrice product={product} large />
            </div>
            <Separator className="my-7" />
            <div>
              <Label>Quantity</Label>
              <div className="mt-2">
                <QuantityControl value={quantity} onChange={setQuantity} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                disabled={!product.stock || buyingNow}
                onClick={() => addToCart(product.productId || product.id, quantity)}
                className="flex-1 font-semibold"
              >
                <ShoppingBag /> Add to cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                disabled={!product.stock || buyingNow}
                onClick={handleBuyNow}
                className="flex-1 font-semibold"
              >
                {buyingNow ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Redirecting to payment…
                  </>
                ) : (
                  "Buy now"
                )}
              </Button>
              <Button
                size="lg"
                variant={isWishlisted ? "default" : "outline"}
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "gap-1.5 font-semibold",
                  isWishlisted && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                )}
                aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart className={cn("size-4", isWishlisted && "fill-current")} />
                {isWishlisted ? "Saved" : "Wishlist"}
              </Button>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-muted p-4">
                <Truck className="size-5 text-primary" />
                <p className="mt-2 text-sm font-bold">Tracked delivery</p>
                <p className="text-xs text-muted-foreground">Status updates at every step</p>
              </div>
              <div className="rounded-md bg-muted p-4">
                <ShieldCheck className="size-5 text-primary" />
                <p className="mt-2 text-sm font-bold">Secure checkout</p>
                <p className="text-xs text-muted-foreground">Stripe-ready payment flow</p>
              </div>
            </div>

            {/* Available payment methods */}
            <div className="mt-4 rounded-md border bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Available Payment Methods
                </p>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background text-xs font-medium">
                  Credit / Debit Card
                </Badge>
                <Badge variant="outline" className="bg-background text-xs font-medium">
                  Stripe Payment
                </Badge>
                <Badge variant="outline" className="bg-background text-xs font-medium">
                  Cash on Delivery (COD)
                </Badge>
                <Badge variant="outline" className="bg-background text-xs font-medium">
                  Bank Transfer
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <RecentlyViewedStrip title="You Might Also Like" />
      </main>
      <Footer />
    </>
  );
}

export function CartPage() {
  const { cart, products, updateQuantity, removeFromCart, clearCart, role, accessToken } =
    useAppState();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleStripeCheckout = async () => {
    if (!accessToken || checkingOut) return;
    setCheckingOut(true);
    try {
      const session = await orderApi.checkout(accessToken);
      // Stripe-hosted checkout page; leave the loading state on while the browser navigates.
      window.location.href = session.checkoutUrl;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start checkout");
      setCheckingOut(false);
    }
  };

  const lines = cart.flatMap((line) => {
    const product = products.find(
      (p) =>
        p.id === line.productId ||
        p._id === line.productId ||
        p.productId === line.productId,
    );
    return product ? [{ ...line, product }] : [];
  });
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + finalPrice(line.product) * line.quantity, 0);

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const diff = FREE_SHIPPING_THRESHOLD - total;

  if (!lines.length)
    return (
      <>
        <Navbar />
        <main className="page-shell py-12">
          <CustomerNavStrip current="cart" />
          <EmptyState
            icon={<ShoppingBag className="size-8 text-muted-foreground" />}
            title="Your cart is empty"
            description="Explore the marketplace and discover thoughtful goods from independent sellers."
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button asChild>
                  <Link to="/shop">Browse products</Link>
                </Button>
                {role === "customer" && (
                  <Button asChild variant="outline">
                    <Link to="/profile">View saved wishlist</Link>
                  </Button>
                )}
              </div>
            }
          />
          <RecentlyViewedStrip title="Recommended For You" />
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="cart" />
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-2xl font-extrabold md:text-3xl tracking-tight">
              Shopping cart
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {lines.length} {lines.length === 1 ? "product" : "products"} ready for checkout.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="w-fit text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5 mr-1" /> Clear cart
          </Button>
        </div>

        {/* Free shipping progress alert */}
        <div className="mb-6 rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-foreground">
              <Truck className="size-4 text-primary" />
              {diff <= 0
                ? "You have unlocked Free Standard Delivery!"
                : `Add ${money(diff)} more to unlock Free Delivery!`}
            </span>
            <span className="text-muted-foreground">{progressPercent}%</span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="panel divide-y">
            {lines.map((line) => (
              <div
                key={line.productId}
                className="grid grid-cols-[88px_1fr] gap-4 p-4 sm:grid-cols-[104px_1fr_auto]"
              >
                <ProductImage product={line.product} className="aspect-square rounded-md" />
                <div>
                  <h2 className="font-display font-bold">{line.product.name}</h2>
                  <p className="text-xs text-muted-foreground">{line.product.storeName || line.product.seller}</p>
                  <div className="mt-2">
                    <ProductPrice product={line.product} />
                  </div>
                  <div className="mt-3 sm:hidden">
                    <QuantityControl
                      value={line.quantity}
                      onChange={(value) => updateQuantity(line.productId, value)}
                    />
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end">
                  <div className="hidden sm:block">
                    <QuantityControl
                      value={line.quantity}
                      onChange={(value) => updateQuantity(line.productId, value)}
                    />
                  </div>
                  <p className="font-bold">{money(finalPrice(line.product) * line.quantity)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeFromCart(line.productId)}
                  >
                    <Trash2 className="size-4" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Summary
            subtotal={subtotal}
            total={total}
            action={
              role === "customer" && accessToken ? (
                <Button
                  size="lg"
                  className="w-full font-semibold"
                  onClick={handleStripeCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="animate-spin" /> Redirecting to payment…
                    </>
                  ) : (
                    <>
                      Checkout <ArrowRight />
                    </>
                  )}
                </Button>
              ) : (
                <Button asChild size="lg" className="w-full font-semibold">
                  <Link to="/checkout">
                    Proceed to checkout <ArrowRight />
                  </Link>
                </Button>
              )
            }
          />
        </div>

        <RecentlyViewedStrip title="You Might Also Like" />
      </main>
      <Footer />
    </>
  );
}

export function CheckoutPage() {
  const { cart, products, user, addresses, createOrder } = useAppState();
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  const [customerName, setCustomerName] = useState(
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || defaultAddr?.name || "Ariana Wells",
  );
  const [customerEmail, setCustomerEmail] = useState(user?.email || "ariana@example.com");
  const [customerPhone, setCustomerPhone] = useState(
    user?.phone || defaultAddr?.phone || "+1 (555) 012-3489",
  );
  const [shippingStreet, setShippingStreet] = useState(
    user?.shippingAddress || defaultAddr?.street || "128 Market Street, Apt 4B",
  );
  const [shippingCity, setShippingCity] = useState(defaultAddr?.city || "San Francisco");
  const [shippingState, setShippingState] = useState(defaultAddr?.state || "CA");
  const [shippingZip, setShippingZip] = useState(defaultAddr?.zip || "94105");

  const total = cart.reduce((sum, line) => {
    const p = products.find(
      (item) =>
        item.id === line.productId ||
        item._id === line.productId ||
        item.productId === line.productId,
    );
    return sum + (p ? finalPrice(p) * line.quantity : 0);
  }, 0);
  const navigate = useNavigate();

  const handleCheckout = (event: React.FormEvent) => {
    event.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const order = createOrder({
      items: cart,
      shippingAddress: {
        name: customerName,
        street: shippingStreet,
        city: shippingCity,
        state: shippingState,
        zip: shippingZip,
        phone: customerPhone,
      },
    });
    toast.success("Order placed successfully! Delivery tracking initialized.");
    navigate({ to: "/orders/$id", params: { id: order.id } });
  };

  if (!cart.length) {
    return (
      <>
        <Navbar />
        <main className="page-shell py-12">
          <CustomerNavStrip current="cart" />
          <EmptyState
            icon={<ShoppingBag className="size-8 text-muted-foreground" />}
            title="No items in checkout"
            description="Your cart is currently empty. Explore products to place an order."
            action={
              <Button asChild>
                <Link to="/shop">Shop marketplace</Link>
              </Button>
            }
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="cart" />
        <PageHeader
          title="Checkout"
          description="Complete your shipping details and proceed to secure order placement."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <form className="panel grid gap-5 p-6" onSubmit={handleCheckout}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Delivery destination</h2>
              {addresses.length > 0 && (
                <span className="text-xs text-primary font-medium">Using saved address</span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                placeholder="Ariana Wells"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Field
                label="Email"
                type="email"
                placeholder="ariana@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <Field
                label="Phone"
                placeholder="+1 555 012 3489"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              <Field
                label="City & State"
                placeholder="San Francisco, CA"
                value={`${shippingCity}, ${shippingState}`}
                onChange={(e) => {
                  const parts = e.target.value.split(",");
                  setShippingCity(parts[0]?.trim() || "");
                  if (parts[1]) setShippingState(parts[1].trim());
                }}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Shipping street address"
                  placeholder="128 Market Street, Apt 4B"
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-2 rounded-lg border bg-surface/40 p-4 text-xs text-muted-foreground flex items-center gap-3">
              <ShieldCheck className="size-5 text-primary shrink-0" />
              <span>
                Simulated Stripe Payment: Placing this order generates real tracking records in your
                account.
              </span>
            </div>

            <Button type="submit" size="lg" className="w-full font-semibold">
              <CreditCard className="size-4" /> Place Order ({money(total)})
            </Button>
          </form>

          <div className="panel h-fit p-6">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <div className="mt-5 grid gap-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((line) => {
                const p = products.find(
                  (item) =>
                    item.id === line.productId ||
                    item._id === line.productId ||
                    item.productId === line.productId,
                );
                return p ? (
                  <div key={line.productId} className="flex gap-3">
                    <ProductImage product={p} className="size-16 shrink-0 rounded-md border" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.storeName || p.seller} · Qty {line.quantity}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{money(finalPrice(p) * line.quantity)}</p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
            <Separator className="my-5" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-semibold text-success-foreground">Free</span>
            </div>
            <div className="mt-2 flex justify-between font-display text-lg font-extrabold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function OrdersPage() {
  const { accessToken } = useAppState();
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setError(null);
    orderApi
      .listMine(accessToken)
      .then((rows) => {
        if (!cancelled) setOrders(rows);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Could not load your orders";
        setError(message);
        toast.error(message);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="orders" />
        <PageHeader
          title="My orders"
          description="Track every purchase and its payment and delivery status."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/shop">
                <ShoppingBag className="size-4 mr-1.5" /> Continue shopping
              </Link>
            </Button>
          }
        />

        {orders === null && !error ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading your orders…
          </div>
        ) : error ? (
          <EmptyState
            icon={<Package className="size-8 text-muted-foreground" />}
            title="Couldn't load your orders"
            description={error}
          />
        ) : orders && orders.length === 0 ? (
          <EmptyState
            icon={<Package className="size-8 text-muted-foreground" />}
            title="No orders yet"
            description="Once you complete a purchase it will show up here."
            action={
              <Button asChild size="sm">
                <Link to="/shop">Start shopping</Link>
              </Button>
            }
          />
        ) : (
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b bg-muted/60">
                  <tr>
                    {["Order", "Date", "Products", "Total", "Payment", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-4 font-mono font-bold text-foreground">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {formatOrderDate(order.date)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          {order.products.map((p, index) => (
                            <div key={`${p.name}-${index}`} className="flex items-center gap-2.5">
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="size-9 shrink-0 rounded-md border object-cover"
                                />
                              ) : (
                                <div className="size-9 shrink-0 rounded-md border bg-muted" />
                              )}
                              <span className="font-medium">
                                {p.name}{" "}
                                <span className="text-muted-foreground">× {p.quantity}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold">{money(order.total)}</td>
                      <td className="px-4 py-4">
                        <PaymentBadge payment={order.payment} />
                      </td>
                      <td className="px-4 py-4">
                        <ApiOrderStatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export function OrderPage({ id }: { id: string }) {
  const { orders, products, addToCart } = useAppState();
  const order = orders.find((item) => item.id === id) ?? orders[0];
  const fallbackProduct = products[0] ?? seedProducts[0]!;
  const sampleProduct =
    products.find(
      (p) => order?.items?.some((i) => i.productId === p.id) || p.name === order?.product,
    ) ?? fallbackProduct;

  if (!order) return null;

  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="orders" />
        <BackLink to="/orders" label="Back to orders" />
        <PageHeader
          title={`Order ${order.id}`}
          description={`Placed on ${order.date}`}
          action={
            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <Button
                size="sm"
                onClick={() => {
                  addToCart(order.items?.[0]?.productId ?? sampleProduct.id, 1);
                }}
              >
                Buy again
              </Button>
            </div>
          }
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="panel p-6">
            <h2 className="font-display text-lg font-bold">Order progress & tracking</h2>
            <div className="mt-8">
              <OrderStatusTimeline status={order.status} />
            </div>
            <Separator className="my-7" />
            <h2 className="font-display text-lg font-bold">Ordered items</h2>
            <div className="mt-4 divide-y">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => {
                  const itProd = products.find((p) => p.id === item.productId) ?? sampleProduct;
                  return (
                    <div key={item.productId} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                      <ProductImage
                        product={itProd}
                        className="size-20 rounded-md object-cover border"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.seller} · Quantity {item.quantity}
                        </p>
                        <p className="mt-2 font-bold text-primary">
                          {money(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex gap-4 py-3">
                  <ProductImage
                    product={sampleProduct}
                    className="size-20 rounded-md object-cover border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground">{order.product}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.seller} · Quantity {order.quantity}
                    </p>
                    <p className="mt-2 font-bold text-primary">{money(order.amount)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="panel h-fit p-6 space-y-4">
            <h2 className="font-display text-lg font-bold">Shipping information</h2>
            <div className="text-sm leading-6 text-muted-foreground">
              <p className="font-semibold text-foreground">
                {order.shippingAddress?.name || order.customer}
              </p>
              <p>{order.shippingAddress?.street || "128 Market Street, Apt 4B"}</p>
              <p>
                {order.shippingAddress?.city || "San Francisco"},{" "}
                {order.shippingAddress?.state || "CA"} {order.shippingAddress?.zip || "94105"}
              </p>
              {order.shippingAddress?.phone && (
                <p className="mt-1 text-xs font-mono">{order.shippingAddress.phone}</p>
              )}
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment method</span>
              <strong>Stripe ({order.payment})</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping fee</span>
              <strong className="text-success-foreground">Free</strong>
            </div>
            <Separator />
            <div className="flex justify-between font-display text-lg font-extrabold">
              <span>Total</span>
              <span>{money(order.amount)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="profile" />
        <CustomerAccount />
      </main>
      <Footer />
    </>
  );
}
function Field({ label, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <Input required {...props} />
    </label>
  );
}
function Summary({
  subtotal,
  total,
  action,
}: {
  subtotal: number;
  total: number;
  action: React.ReactNode;
}) {
  return (
    <aside className="panel h-fit p-6">
      <h2 className="font-display text-lg font-bold">Order summary</h2>
      <div className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total discount</span>
          <span className="text-success-foreground">−{money(subtotal - total)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-display text-lg font-extrabold">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
      </div>
      <div className="mt-6">{action}</div>
    </aside>
  );
}

export function OrderSuccessPage({ sessionId }: { sessionId?: string }) {
  const { accessToken, refreshCart } = useAppState();
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Guards against React strict-mode double effects: verify must run once per page load.
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing payment session. If you were charged, check My Orders.");
      return;
    }
    if (!accessToken || verifiedRef.current) return;
    verifiedRef.current = true;
    orderApi
      .verify(sessionId, accessToken)
      .then((verified) => {
        setOrder(verified);
        // The backend empties the cart once payment is confirmed.
        return refreshCart();
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not verify your payment");
      });
  }, [sessionId, accessToken, refreshCart]);

  const loading = !order && !error;

  return (
    <>
      <Navbar />
      <main className="page-shell py-16">
        <div className="mx-auto max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">
          {loading ? (
            <>
              <Loader2 className="mx-auto size-10 animate-spin text-primary" />
              <h1 className="mt-4 font-display text-xl font-extrabold">Confirming your payment…</h1>
              <p className="mt-1 text-sm text-muted-foreground">Please don't close this page.</p>
            </>
          ) : error ? (
            <>
              <h1 className="font-display text-xl font-extrabold">We couldn't confirm your payment</h1>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </>
          ) : order?.payment === "paid" ? (
            <>
              <CheckCircle2 className="mx-auto size-12 text-success" />
              <h1 className="mt-4 font-display text-2xl font-extrabold">Payment successful</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Order <span className="font-mono font-bold text-foreground">{order.orderId}</span>{" "}
                is confirmed — {money(order.total)}.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-extrabold">
                Payment {order?.payment === "failed" ? "failed" : "pending"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Order <span className="font-mono font-bold text-foreground">{order?.orderId}</span>{" "}
                {order?.payment === "failed"
                  ? "wasn't paid. You can try checking out again from your cart."
                  : "is still awaiting payment confirmation. Check My Orders in a moment."}
              </p>
            </>
          )}
          {!loading && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link to="/orders">My Orders</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
