import { useState } from "react";
import { toast } from "sonner";
import {
  Box,
  DollarSign,
  Eye,
  Loader2,
  Package,
  Pencil,
  Plus,
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
} from "./Dialogs";
import { OrderStatusBadge, PageHeader, ProductImage, StatsCard, StockBadge } from "./Common";
import { useAppState } from "./AppState";
import { authApi } from "@/api/auth.api";
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
  const { products, saveProduct, deleteProduct } = useAppState();
  const mine = products.filter((p) => p.seller === "North & Pine");
  return (
    <div>
      <PageHeader
        title="My products"
        description="Manage your catalog, pricing, images, and stock."
        action={
          <ProductDialog
            onSave={saveProduct}
            trigger={
              <Button>
                <Plus /> Add Product
              </Button>
            }
          />
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
            {mine.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <ProductImage product={p} className="size-11 rounded-md" />
                </TableCell>
                <TableCell className="font-bold">{p.name}</TableCell>
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
                      description="This removes the product from your local catalog preview."
                      onConfirm={() => deleteProduct(p.id)}
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
            ))}
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
  const { products } = useAppState();
  const [search, setSearch] = useState("");
  const shown = products.filter((p) =>
    `${p.name} ${p.seller}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div>
      <PageHeader
        title="All products"
        description="Review products across every marketplace seller."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <Input
          placeholder="Search products or sellers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterSelect label="All categories" items={seedCategories} />
        <FilterSelect label="All sellers" items={sellers.map((s) => s.name)} />
        <FilterSelect label="All stock" items={["In Stock", "Low Stock", "Out of Stock"]} />
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
            {shown.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <ProductImage product={p} className="size-11 rounded-md" />
                </TableCell>
                <TableCell className="font-bold">{p.name}</TableCell>
                <TableCell>{p.seller}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{money(p.price)}</TableCell>
                <TableCell>{p.discount}%</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <StockBadge stock={p.stock} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" aria-label="View product">
                    <Eye />
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

export function CategoriesPage() {
  const [items, setItems] = useState(
    seedCategories.map((name, i) => ({ name, count: [482, 316, 524, 208, 174][i] ?? 0 })),
  );
  return (
    <div>
      <PageHeader
        title="Categories"
        description="Keep the marketplace catalog organized."
        action={
          <CategoryDialog
            onSave={(name) => setItems((v) => [...v, { name, count: 0 }])}
            trigger={
              <Button>
                <Plus /> Add category
              </Button>
            }
          />
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div className="panel flex items-center gap-4 p-5" key={item.name}>
            <span className="grid size-10 place-items-center rounded-md bg-secondary text-secondary-foreground">
              <Box />
            </span>
            <div className="flex-1">
              <p className="font-display font-bold">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.count} products</p>
            </div>
            <CategoryDialog
              category={item.name}
              onSave={(name) =>
                setItems((v) => v.map((x) => (x.name === item.name ? { ...x, name } : x)))
              }
              trigger={
                <Button variant="ghost" size="icon">
                  <Pencil />
                </Button>
              }
            />
            <ConfirmDialog
              title="Delete category?"
              description="Products will remain but require a new category."
              onConfirm={() => setItems((v) => v.filter((x) => x.name !== item.name))}
              trigger={
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 />
                </Button>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardProfile({ seller = false }: { seller?: boolean }) {
  const { user, accessToken, updateUser } = useAppState();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [saving, setSaving] = useState(false);

  const saveChanges = async () => {
    if (!accessToken) {
      toast.error("You need to be signed in to update your profile.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile({ firstName, lastName }, accessToken);
      updateUser(data);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Profile"
        description={
          seller ? "Manage your shop and contact information." : "Manage your account details."
        }
      />
      <div className="panel grid gap-4 p-6 sm:grid-cols-2" key={user?._id ?? "loading"}>
        <label className="text-sm font-medium">
          First name
          <Input
            className="mt-1.5"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>
        <label className="text-sm font-medium">
          Last name
          <Input
            className="mt-1.5"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>
        {seller && (
          <label className="text-sm font-medium">
            Store name
            <Input
              className="mt-1.5 cursor-not-allowed opacity-70"
              defaultValue={user?.storeName ?? ""}
              disabled
              title="Store name can't be changed here."
            />
          </label>
        )}
        <label className="text-sm font-medium">
          Email
          <Input
            className="mt-1.5 cursor-not-allowed opacity-70"
            defaultValue={user?.email ?? ""}
            disabled
            title="Email can't be changed here."
          />
        </label>
        <div className="text-sm font-medium">
          Verified
          <div className="mt-1.5">
            {user?.isVerified ? (
              <Badge className="bg-success text-success-foreground shadow-none">Verified</Badge>
            ) : (
              <Badge variant="secondary">Not verified</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <Button disabled={saving} onClick={saveChanges}>
            {saving ? <Loader2 className="animate-spin" /> : null}
            Save changes
          </Button>
          <ChangePasswordDialog
            accessToken={accessToken}
            trigger={<Button variant="outline">Change password</Button>}
          />
        </div>
      </div>
    </div>
  );
}
function DataWrap({ children }: { children: React.ReactNode }) {
  return <div className="panel overflow-hidden">{children}</div>;
}
function FilterSelect({ label, items }: { label: string; items: string[] }) {
  return (
    <Select defaultValue="all">
      <SelectTrigger>
        <SelectValue />
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
