import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Box,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  FolderTree,
  KeyRound,
  Loader2,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Store,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  categories as seedCategories,
  customers,
  finalPrice,
  money,
  orders,
  sellers,
  stockStatus,
  type OrderStatus,
  type Product,
} from "@/lib/marketplace";
import {
  ConfirmDialog,
  CategoryDialog,
  ChangePasswordDialog,
  OrderDetailsDialog,
  OrderStatusDialog,
  ProductDialog,
  ProductDetailsDialog,
} from "./Dialogs";
import { OrderStatusBadge, PageHeader, ProductImage, StatsCard, StockBadge } from "./Common";
import { useAppState } from "./useAppState";
import { authApi } from "@/api/auth.api";
import { categoryApi, type CategoryItem } from "@/api/category.api";
import { productApi } from "@/api/product.api";
import { Switch } from "@/components/ui/switch";
import { ApiError } from "@/api/client";

const statSets = {
  seller: [
    { label: "Total Products", value: "12", icon: <Package />, note: "+2 this month" },
    { label: "Active Products", value: "10", icon: <Box />, note: "2 need attention" },
    { label: "Total Orders", value: "184", icon: <ShoppingCart />, note: "+14 this week" },
    { label: "Total Sales", value: "$18,420", icon: <DollarSign />, note: "+8.4% this month" },
  ],
  admin: [
    { label: "Total Sellers", value: "42", icon: <Store />, note: "+4 this month" },
    { label: "Total Customers", value: "1,284", icon: <Users />, note: "+86 this month" },
    { label: "Total Products", value: "2,418", icon: <Package />, note: "94 added this month" },
    { label: "Total Orders", value: "6,308", icon: <ShoppingCart />, note: "+12% this month" },
    { label: "Total Revenue", value: "$284k", icon: <DollarSign />, note: "+9.2% this month" },
  ],
};

export function DashboardHome({ role }: { role: "seller" | "admin" }) {
  const { products } = useAppState();
  const stats = statSets[role];
  return (
    <div>
      <PageHeader
        eyebrow={`${role} workspace`}
        title="Dashboard"
        description={
          role === "admin"
            ? "A concise view of marketplace activity and inventory."
            : "Your shop performance, orders, and stock at a glance."
        }
      />
      <div
        className={`grid gap-4 sm:grid-cols-2 ${role === "admin" ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}
      >
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>
      {role === "admin" && (
        <div className="panel mt-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Sales overview</h2>
              <p className="text-sm text-muted-foreground">
                Gross marketplace sales, last 7 months
              </p>
            </div>
            <TrendingUp className="text-primary" />
          </div>
          <div className="mt-8 flex h-48 items-end gap-3">
            {[42, 58, 49, 72, 64, 86, 78].map((value, i) => (
              <div className="flex h-full flex-1 items-end" key={i}>
                <div
                  className="w-full rounded-t-sm bg-primary/80"
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 text-center text-xs text-muted-foreground">
            {["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="panel p-5">
          <h2 className="font-display text-lg font-bold">Recent orders</h2>
          <div className="mt-4 divide-y">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-bold">
                    {o.id} · {o.product}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {o.customer} · {o.date}
                  </p>
                </div>
                <OrderStatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </section>
        <section className="panel p-5">
          <h2 className="font-display text-lg font-bold">Product stock overview</h2>
          <div className="mt-4 divide-y">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-3">
                <ProductImage product={p} className="size-10 rounded-md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.stock} units available</p>
                </div>
                <StockBadge stock={p.stock} />
              </div>
            ))}
          </div>
        </section>
      </div>
      {role === "admin" && (
        <section className="panel mt-6 p-5">
          <h2 className="font-display text-lg font-bold">Recent sellers</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {sellers.map((s) => (
              <div key={s.email} className="rounded-md border p-3">
                <p className="font-bold">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.products} products · {s.orders} orders
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function SellerProductsPage() {
  const { products, saveProduct, deleteProduct, user, accessToken, refreshProducts } =
    useAppState();

  const sellerProducts = useMemo(() => {
    return products.filter((p) => {
      if (user?.storeName && p.seller?.toLowerCase() === user.storeName.toLowerCase()) return true;
      if (user?.name && p.seller?.toLowerCase() === user.name.toLowerCase()) return true;
      return false;
    });
  }, [products, user]);

  const mine = useMemo(() => {
    if (user && (user.storeName || user.name)) {
      return sellerProducts.length > 0
        ? sellerProducts
        : user.role === "seller"
          ? []
          : products.filter((p) => p.seller === "North & Pine");
    }
    return products.filter((p) => p.seller === "North & Pine");
  }, [products, user, sellerProducts]);

  const handleDelete = async (p: Product) => {
    if (p._id && accessToken) {
      try {
        await productApi.remove(p._id, accessToken);
        toast.success("Product deleted successfully");
      } catch {
        // Backend note §4: DELETE is not wired on router level yet (returns 404)
        toast.info(
          "Backend route DELETE /products/:id is not wired yet; removed from local catalog preview.",
        );
      }
    } else {
      toast.success("Product removed from catalog");
    }
    deleteProduct(p.id);
  };

  return (
    <div>
      <PageHeader
        title="My products"
        description="Manage your catalog, pricing, images, and stock."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                if (refreshProducts) {
                  toast.promise(refreshProducts(), {
                    loading: "Refreshing products...",
                    success: "Products refreshed",
                    error: "Failed to refresh products",
                  });
                }
              }}
            >
              <RefreshCw className="size-4 mr-1" /> Refresh
            </Button>
            <ProductDialog
              onSave={saveProduct}
              trigger={
                <Button>
                  <Plus className="size-4 mr-1" /> Add Product
                </Button>
              }
            />
          </div>
        }
      />
      <DataWrap>
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Image",
                "Product",
                "Category",
                "Price",
                "Discount",
                "Final Price",
                "Stock",
                "Status",
                "Actions",
              ].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {mine.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  No products found. Click "Add Product" to add your first product!
                </TableCell>
              </TableRow>
            ) : (
              mine.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <ProductImage product={p} className="size-11 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">{p.name}</div>
                    {p.productId && (
                      <div className="text-xs text-muted-foreground font-mono">{p.productId}</div>
                    )}
                  </TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{money(p.price)}</TableCell>
                  <TableCell>{p.discount}%</TableCell>
                  <TableCell className="font-semibold">{money(finalPrice(p))}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    <StockBadge stock={p.stock} />
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <ProductDialog
                        product={p}
                        onSave={saveProduct}
                        trigger={
                          <Button variant="ghost" size="icon" aria-label="Edit product">
                            <Pencil />
                          </Button>
                        }
                      />
                      <ConfirmDialog
                        title="Delete product?"
                        description="This removes the product from your catalog."
                        onConfirm={() => handleDelete(p)}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            aria-label="Delete product"
                          >
                            <Trash2 />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DataWrap>
    </div>
  );
}

export function OrdersManagementPage({ admin = false }: { admin?: boolean }) {
  const [statuses, setStatuses] = useState<Record<string, OrderStatus>>({});
  return (
    <div>
      <PageHeader
        title={admin ? "Marketplace orders" : "Orders"}
        description={
          admin
            ? "View orders across every seller and customer."
            : "Orders that include products from your store."
        }
      />
      <DataWrap>
        <Table>
          <TableHeader>
            <TableRow>
              {(admin
                ? ["Order ID", "Customer", "Seller", "Amount", "Payment", "Status", "Date", ""]
                : [
                  "Order ID",
                  "Customer",
                  "Product",
                  "Qty",
                  "Amount",
                  "Payment",
                  "Status",
                  "Date",
                  "",
                ]
              ).map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-bold">{o.id}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>{admin ? o.seller : o.product}</TableCell>
                {!admin && <TableCell>{o.quantity}</TableCell>}
                <TableCell>{money(o.amount)}</TableCell>
                <TableCell>{o.payment}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={statuses[o.id] ?? o.status} />
                </TableCell>
                <TableCell>{o.date}</TableCell>
                <TableCell>
                  <div className="flex">
                    <OrderDetailsDialog
                      order={{ ...o, status: statuses[o.id] ?? o.status }}
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="View order">
                          <Eye />
                        </Button>
                      }
                    />
                    <OrderStatusDialog
                      order={{ ...o, status: statuses[o.id] ?? o.status }}
                      onSave={(status) => setStatuses((s) => ({ ...s, [o.id]: status }))}
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Update status">
                          <Pencil />
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataWrap>
    </div>
  );
}

export function PeoplePage({ type }: { type: "sellers" | "customers" }) {
  const data =
    type === "sellers"
      ? sellers.map((person) => ({ ...person, productsCount: person.products }))
      : customers.map((person) => ({ ...person, productsCount: 0 }));
  return (
    <div>
      <PageHeader
        title={type === "sellers" ? "Sellers" : "Customers"}
        description={`View marketplace ${type} and their account activity.`}
      />
      <DataWrap>
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Name",
                "Email",
                ...(type === "sellers" ? ["Products"] : []),
                "Orders",
                "Joined",
                "Status",
                "",
              ].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((person) => (
              <TableRow key={person.email}>
                <TableCell className="font-bold">{person.name}</TableCell>
                <TableCell>{person.email}</TableCell>
                {type === "sellers" && <TableCell>{person.productsCount}</TableCell>}
                <TableCell>{person.orders}</TableCell>
                <TableCell>{person.joined}</TableCell>
                <TableCell>
                  <Badge className="bg-success text-success-foreground shadow-none">
                    {person.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataWrap>
    </div>
  );
}

export function AdminProductsPage() {
  const { products, refreshProducts } = useAppState();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sellerFilter, setSellerFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const dynamicCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const dynamicSellers = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const sellerFullName = [p.sellerDetails?.firstName, p.sellerDetails?.lastName]
        .filter(Boolean)
        .join(" ");
      const name = sellerFullName || p.seller;
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [products]);

  const shown = useMemo(() => {
    return products.filter((p) => {
      const sellerFullName = [p.sellerDetails?.firstName, p.sellerDetails?.lastName]
        .filter(Boolean)
        .join(" ");
      const sellerDisplayName = sellerFullName || p.seller || "";
      const storeName = p.storeName || "";
      const sDetails = p.sellerDetails;
      const combined = `${p.name} ${sellerDisplayName} ${storeName} ${p.productId || ""} ${sDetails?.email || ""}`.toLowerCase();
      if (!combined.includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (sellerFilter !== "all" && sellerDisplayName !== sellerFilter && storeName !== sellerFilter) return false;
      if (stockFilter !== "all" && stockStatus(p.stock) !== stockFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter, sellerFilter, stockFilter]);

  return (
    <div>
      <PageHeader
        title="All products"
        description="Review products across every marketplace seller."
        action={
          <Button
            variant="outline"
            onClick={async () => {
              if (refreshProducts) {
                toast.promise(refreshProducts(), {
                  loading: "Refreshing products...",
                  success: "Products refreshed",
                  error: "Failed to refresh products",
                });
              }
            }}
          >
            <RefreshCw className="size-4 mr-1" /> Refresh
          </Button>
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <Input
          placeholder="Search products or sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterSelect
          label="All categories"
          items={dynamicCategories.length > 0 ? dynamicCategories : seedCategories}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
        <FilterSelect
          label="All sellers"
          items={dynamicSellers.length > 0 ? dynamicSellers : sellers.map((s) => s.name)}
          value={sellerFilter}
          onChange={setSellerFilter}
        />
        <FilterSelect
          label="All stock"
          items={["In Stock", "Low Stock", "Out of Stock"]}
          value={stockFilter}
          onChange={setStockFilter}
        />
      </div>
      <DataWrap>
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Image",
                "Product",
                "Seller",
                "Category",
                "Price",
                "Discount",
                "Stock",
                "Status",
                "",
              ].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  No products found matching your search and filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              shown.map((p) => {
                const sellerFullName =
                  [p.sellerDetails?.firstName, p.sellerDetails?.lastName]
                    .filter(Boolean)
                    .join(" ") || p.seller;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <ProductImage product={p} className="size-11 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">{p.name}</div>
                      {p.productId && (
                        <div className="text-xs text-muted-foreground font-mono">{p.productId}</div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {sellerFullName}
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{money(p.price)}</TableCell>
                    <TableCell>{p.discount}%</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell>
                      <StockBadge stock={p.stock} />
                    </TableCell>
                    <TableCell>
                      <ProductDetailsDialog
                        product={p}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="View product details"
                            title="View product details"
                          >
                            <Eye className="size-4" />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </DataWrap>
    </div>
  );
}

export function CategoriesPage() {
  const { accessToken, user, role } = useAppState();
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "unset">("all");

  const isAdmin = role === "admin" || user?.role === "admin";

  const fetchCategories = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const liveData = await categoryApi.list();
      setItems(liveData);
      setIsLive(true);
      if (isManual) {
        toast.success("Categories refreshed from backend.");
      }
    } catch {
      setIsLive(false);
      setItems((prev) =>
        prev.length > 0
          ? prev
          : seedCategories.map((name, i) => ({
            _id: `seed-${i + 1}`,
            name,
            active: true,
            productCount: [482, 316, 524, 208, 174][i] ?? 0,
            description: `${name} goods, accessories, and gear.`,
          })),
      );
      if (isManual) {
        toast.error("Could not reach backend category service.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async ({
    name,
    description,
    active,
  }: {
    name: string;
    description?: string;
    active?: boolean;
  }) => {
    const targetActive = active ?? true;
    if (isLive) {
      if (!accessToken) {
        toast.error("Admin authentication required. Please log in as an administrator.");
        throw new Error("Admin login required");
      }
      try {
        const created = await categoryApi.create(
          { name, description: description ?? "" },
          accessToken,
        );
        // Explicitly set active status via PATCH upon creation so active is never undefined in the database
        if (created?._id) {
          await categoryApi.update(
            created._id,
            { name: created.name, active: targetActive },
            accessToken,
          );
        }
        toast.success(
          `Category "${created.name}" created successfully as ${targetActive ? "Active" : "Inactive"}.`,
        );
        await fetchCategories();
      } catch (err: unknown) {
        const message = err instanceof ApiError ? err.message : "Failed to create category.";
        toast.error(message);
        throw err;
      }
    } else {
      const newCat: CategoryItem = {
        _id: `cat-${Date.now()}`,
        name,
        description,
        active: targetActive,
        productCount: 0,
      };
      setItems((prev) => [newCat, ...prev]);
      toast.success(`Category "${name}" created (demo mode).`);
    }
  };

  const handleUpdate = async (id: string, { name, active }: { name: string; active?: boolean }) => {
    if (isLive) {
      if (!accessToken) {
        toast.error("Admin authentication required. Please log in as an administrator.");
        throw new Error("Admin login required");
      }
      try {
        const updated = await categoryApi.update(
          id,
          { name, active: Boolean(active) },
          accessToken,
        );
        toast.success(`Category "${updated.name}" updated successfully.`);
        await fetchCategories();
      } catch (err: unknown) {
        const message = err instanceof ApiError ? err.message : "Failed to update category.";
        toast.error(message);
        throw err;
      }
    } else {
      setItems((prev) =>
        prev.map((c) => (c._id === id ? { ...c, name, active: Boolean(active) } : c)),
      );
      toast.success(`Category "${name}" updated (demo mode).`);
    }
  };

  const handleToggleActive = async (item: CategoryItem) => {
    const nextActive = !item.active;
    if (isLive) {
      if (!accessToken) {
        toast.error("Admin authentication required to change status.");
        return;
      }
      try {
        await categoryApi.update(item._id, { name: item.name, active: nextActive }, accessToken);
        toast.success(`Category "${item.name}" marked as ${nextActive ? "Active" : "Inactive"}.`);
        await fetchCategories();
      } catch (err: unknown) {
        const message = err instanceof ApiError ? err.message : "Failed to change category status.";
        toast.error(message);
      }
    } else {
      setItems((prev) => prev.map((c) => (c._id === item._id ? { ...c, active: nextActive } : c)));
      toast.success(
        `Category "${item.name}" marked as ${nextActive ? "Active" : "Inactive"} (demo mode).`,
      );
    }
  };

  const handleDelete = async (item: CategoryItem) => {
    if (isLive) {
      if (!accessToken) {
        toast.error("Admin authentication required to delete categories.");
        return;
      }
      try {
        await categoryApi.remove(item._id, accessToken);
        toast.success(`Category "${item.name}" deleted successfully.`);
        await fetchCategories();
      } catch (err: unknown) {
        const message = err instanceof ApiError ? err.message : "Failed to delete category.";
        toast.error(message);
      }
    } else {
      setItems((prev) => prev.filter((c) => c._id !== item._id));
      toast.success(`Category "${item.name}" removed (demo mode).`);
    }
  };

  // Metrics
  const totalCategories = items.length;
  const activeCount = items.filter((i) => Boolean(i.active)).length;
  const inactiveCount = totalCategories - activeCount;
  const totalAssignedProducts = items.reduce((acc, curr) => acc + (curr.productCount ?? 0), 0);

  // Filtered categories
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (statusFilter === "active") return Boolean(item.active);
      if (statusFilter === "inactive") return !item.active;
      return true;
    });
  }, [items, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Category Management"
        description="Organize your catalog hierarchy, control visibility, and monitor real-time product counts."
        action={
          <CategoryDialog
            onSave={handleCreate}
            trigger={
              <Button className="gap-2">
                <Plus className="size-4" /> Add Category
              </Button>
            }
          />
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel p-4">
          <p className="text-xs font-medium text-muted-foreground">Total Categories</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display">{totalCategories}</span>
            <FolderTree className="size-4 text-muted-foreground/60" />
          </div>
        </div>

        <div className="panel p-4">
          <p className="text-xs font-medium text-muted-foreground">Active Categories</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
              {activeCount}
            </span>
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className="panel p-4">
          <p className="text-xs font-medium text-muted-foreground">Inactive Categories</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400">
              {inactiveCount}
            </span>
            <span className="size-2 rounded-full bg-amber-500" />
          </div>
        </div>

        <div className="panel p-4">
          <p className="text-xs font-medium text-muted-foreground">Assigned Products</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-display">{totalAssignedProducts}</span>
            <Package className="size-4 text-muted-foreground/60" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex rounded-lg border bg-muted/40 p-1">
            <Button
              variant={statusFilter === "all" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setStatusFilter("all")}
            >
              All ({totalCategories})
            </Button>
            <Button
              variant={statusFilter === "active" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5 text-emerald-600 dark:text-emerald-400"
              onClick={() => setStatusFilter("active")}
            >
              Active ({activeCount})
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5 text-destructive"
              onClick={() => setStatusFilter("inactive")}
            >
              Inactive ({inactiveCount})
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => fetchCategories(true)}
            disabled={refreshing || loading}
            title="Refresh category catalog"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="panel flex items-center gap-4 p-5 animate-pulse">
              <div className="size-11 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-3 w-1/3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="panel flex flex-col items-center justify-center p-12 text-center">
          <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground mb-3">
            <FolderTree className="size-6" />
          </div>
          <h3 className="font-display font-semibold text-lg">No categories found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {search
              ? `No categories match "${search}". Try clearing your search filter.`
              : "Get started by adding your first category to group catalog items."}
          </p>
          {search ? (
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearch("")}>
              Clear search
            </Button>
          ) : (
            <CategoryDialog
              onSave={handleCreate}
              trigger={
                <Button size="sm" className="mt-4 gap-1.5">
                  <Plus className="size-4" /> Add category
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const hasProducts = (item.productCount ?? 0) > 0;
            const isActive = Boolean(item.active);

            return (
              <div
                className="panel flex flex-col justify-between p-5 transition-all hover:border-primary/40 hover:shadow-sm"
                key={item._id || item.name}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground font-semibold">
                        <Box className="size-5" />
                      </span>
                      <div>
                        <h4 className="font-display font-bold text-base leading-snug">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Package className="size-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-medium">
                            {item.productCount ?? 0}{" "}
                            {item.productCount === 1 ? "product" : "products"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {isActive ? (
                      <Badge
                        variant="outline"
                        className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 border-destructive/30 bg-destructive/10 text-destructive text-[11px] font-medium"
                      >
                        <span className="size-1.5 rounded-full bg-destructive" />
                        Inactive
                      </Badge>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`switch-${item._id || item.name}`}
                      checked={Boolean(item.active)}
                      onCheckedChange={() => handleToggleActive(item)}
                      aria-label="Toggle active status"
                    />
                    <label
                      htmlFor={`switch-${item._id || item.name}`}
                      className="text-xs text-muted-foreground cursor-pointer select-none"
                    >
                      {item.active ? "Active" : "Inactive"}
                    </label>
                  </div>

                  <div className="flex items-center gap-1">
                    <CategoryDialog
                      category={item}
                      onSave={(val) => handleUpdate(item._id, val)}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit category"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      }
                    />

                    <ConfirmDialog
                      title={`Delete "${item.name}"?`}
                      description={
                        hasProducts
                          ? `⚠️ Warning: This category currently has ${item.productCount} product(s) referencing it. The backend performs a hard delete without cascade, so these products will remain in the database as orphaned records without any category. Are you sure you want to proceed?`
                          : `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
                      }
                      onConfirm={() => handleDelete(item)}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Delete category"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DashboardProfile({
  seller = false,
  admin = false,
}: {
  seller?: boolean;
  admin?: boolean;
}) {
  const { user, accessToken, updateUser } = useAppState();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (accessToken) {
      authApi
        .getMe(accessToken)
        .then(({ data }) => {
          if (data) {
            updateUser(data);
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
          }
        })
        .catch(() => undefined);
    }
  }, [accessToken, updateUser]);

  const saveChanges = async () => {
    if (!accessToken) {
      toast.error("You need to be signed in to update your profile.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile(
        { firstName: firstName.trim(), lastName: lastName.trim() },
        accessToken,
      );
      updateUser(data);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials = `${(user?.firstName?.[0] || firstName?.[0] || "U").toUpperCase()}${(user?.lastName?.[0] || lastName?.[0] || "A").toUpperCase()}`;
  const effectiveRole = user?.role || (admin ? "admin" : seller ? "seller" : "customer");

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title={admin ? "Admin Profile" : seller ? "Seller Profile" : "Profile"}
        description={
          admin
            ? "Manage your administrator account details, security credentials, and identity."
            : seller
              ? "Manage your shop and contact information."
              : "Manage your account details."
        }
      />

      {/* User Header / Hero Card */}
      <div className="panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-xl ring-2 ring-primary/20 shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold font-display">
                {user?.firstName || firstName} {user?.lastName || lastName}
              </h2>
              <Badge variant="outline" className="capitalize font-semibold border-primary/30 text-primary bg-primary/5 flex items-center gap-1">
                {admin && <ShieldCheck className="size-3.5" />}
                {effectiveRole}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div>
          {user?.isVerified ? (
            <Badge className="bg-success text-success-foreground border-none flex items-center gap-1 shadow-none">
              <CheckCircle2 className="size-3.5" /> Verified
            </Badge>
          ) : (
            <Badge variant="secondary">Not verified</Badge>
          )}
        </div>
      </div>

      {/* Profile Form Panel */}
      <div className="panel p-6" key={user?._id ?? "loading"}>
        <h3 className="text-base font-semibold mb-4">Personal Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            First name *
            <Input
              className="mt-1.5"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="First name"
            />
          </label>

          <label className="text-sm font-medium">
            Last name *
            <Input
              className="mt-1.5"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Last name"
            />
          </label>

          {seller && (
            <label className="text-sm font-medium sm:col-span-2">
              Store name
              <Input
                className="mt-1.5 cursor-not-allowed opacity-70 bg-muted/50"
                defaultValue={user?.storeName ?? ""}
                disabled
                title="Store name can't be changed here."
              />
            </label>
          )}

          <label className="text-sm font-medium">
            Email address
            <Input
              className="mt-1.5 cursor-not-allowed opacity-70 bg-muted/50"
              defaultValue={user?.email ?? ""}
              disabled
              title="Email address cannot be changed."
            />
          </label>

          <label className="text-sm font-medium">
            Role
            <Input
              className="mt-1.5 cursor-not-allowed opacity-70 bg-muted/50 capitalize font-medium"
              value={effectiveRole}
              disabled
            />
          </label>

          {user?.createdAt && (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
              <Calendar className="size-3.5 text-muted-foreground/70" />
              <span>
                Account created:{" "}
                <strong className="text-foreground">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </strong>
              </span>
            </div>
          )}

          {user?.updatedAt && (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
              <Clock className="size-3.5 text-muted-foreground/70" />
              <span>
                Last updated:{" "}
                <strong className="text-foreground">
                  {new Date(user.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-6 border-t mt-6">
          <Button disabled={saving} onClick={saveChanges}>
            {saving && <Loader2 className="animate-spin size-4 mr-1.5" />}
            Save changes
          </Button>
          <ChangePasswordDialog
            accessToken={accessToken}
            trigger={
              <Button variant="outline">
                <KeyRound className="size-4 mr-1.5" /> Change password
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
function DataWrap({ children }: { children: React.ReactNode }) {
  return <div className="panel overflow-hidden">{children}</div>;
}
function FilterSelect({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: string[];
  value?: string;
  onChange?: (val: string) => void;
}) {
  return (
    <Select value={value ?? "all"} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}</SelectItem>
        {items.map((i) => (
          <SelectItem key={i} value={i}>
            {i}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
