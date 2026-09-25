import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CategoryItem } from "@/api/category.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categories,
  finalPrice,
  money,
  stockStatus,
  type Order,
  type OrderStatus,
  type Product,
} from "@/lib/marketplace";
import { ProductImage, OrderStatusBadge } from "./Common";
import { authApi } from "@/api/auth.api";
import { ApiError } from "@/api/client";
import { PasswordInput } from "./AuthField";

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ChangePasswordDialog({
  trigger,
  accessToken,
}: {
  trigger: React.ReactNode;
  accessToken: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open]);
  const submit = async () => {
    if (!accessToken) {
      toast.error("You need to be signed in to change your password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword }, accessToken);
      toast.success("Password changed successfully.");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not change password.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="current-password">Current password</Label>
            <PasswordInput
              id="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new-password">New password</Label>
            <PasswordInput
              id="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm password</Label>
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={submitting || !currentPassword || !newPassword || !confirmPassword}
            onClick={submit}
          >
            Change password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProductDialog({
  product,
  onSave,
  trigger,
}: {
  product?: Product;
  onSave: (product: Product) => void;
  trigger: React.ReactNode;
}) {
  const empty: Product = {
    id: `p-${Date.now()}`,
    name: "",
    seller: "North & Pine",
    category: categories[0] ?? "Electronics",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    imagePosition: "0% 0%",
  };
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(product ?? empty);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (open) {
      setDraft(product ?? { ...empty, id: `p-${Date.now()}` });
      setPreview(null);
    }
  }, [open]);
  const field = (key: keyof Product, value: string | number) =>
    setDraft((current) => ({ ...current, [key]: value }));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            Product media and values remain local until your API is connected.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-2 md:grid-cols-[180px_1fr]">
          <div>
            <Label>Product image</Label>
            <div className="mt-2 aspect-square overflow-hidden rounded-md border bg-muted">
              {preview ? (
                <img
                  src={preview}
                  alt="Selected product preview"
                  className="h-full w-full object-cover"
                />
              ) : product ? (
                <ProductImage product={product} className="h-full" />
              ) : (
                <div className="grid h-full place-items-center text-muted-foreground">
                  <ImagePlus />
                </div>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 w-full"
              onClick={() => setPreview(null)}
            >
              <Trash2 /> Remove image
            </Button>
          </div>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                value={draft.name}
                onChange={(event) => field("name", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={draft.description}
                onChange={(event) => field("description", event.target.value)}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={draft.category} onValueChange={(value) => field("category", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem value={category} key={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  min="0"
                  value={draft.price}
                  onChange={(event) => field("price", Number(event.target.value))}
                />
              </div>
              <div>
                <Label>Discount %</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={draft.discount}
                  onChange={(event) => field("discount", Number(event.target.value))}
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  min="0"
                  value={draft.stock}
                  onChange={(event) => field("stock", Number(event.target.value))}
                />
              </div>
            </div>
            <div className="rounded-md border bg-muted p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Final price</span>
                <strong>{money(finalPrice(draft))}</strong>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Stock status</span>
                <strong>{stockStatus(draft.stock)}</strong>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!draft.name || draft.price <= 0}
            onClick={() => {
              onSave(draft);
              setOpen(false);
            }}
          >
            <Upload /> Save product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export interface CategoryFormValues {
  name: string;
  description?: string;
  active?: boolean;
}

export function CategoryDialog({
  category,
  trigger,
  onSave,
}: {
  category?: CategoryItem | string;
  trigger: React.ReactNode;
  onSave: (values: CategoryFormValues) => Promise<void> | void;
}) {
  const isEdit = Boolean(category);
  const catObj: CategoryItem | null =
    typeof category === "object" && category !== null ? category : null;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (typeof category === "string") {
        setName(category);
        setDescription("");
        setActive(true);
      } else if (catObj) {
        setName(catObj.name || "");
        setDescription(catObj.description || "");
        setActive(catObj.active ?? false);
      } else {
        setName("");
        setDescription("");
        setActive(true);
      }
    }
  }, [open, category, catObj]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Category name cannot be empty.");
      return;
    }
    if (!isEdit) {
      const trimmedDesc = description.trim();
      if (!trimmedDesc) {
        setError("Category description is required.");
        return;
      }
      if (trimmedDesc.length > 500) {
        setError("Category description cannot exceed 500 characters.");
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSave({
        name: trimmedName,
        description: description.trim(),
        active,
      });
      setOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save category.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Create New Category"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update category naming and catalog visibility."
              : "Define a new category to group and organize marketplace merchandise."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="category-name">
              Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category-name"
              placeholder="e.g. Footwear, Electronics, Home Living"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(null);
              }}
              disabled={submitting}
            />
          </div>

          {!isEdit ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="category-description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <span
                  className={`text-xs ${
                    description.length > 500
                      ? "text-destructive font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {description.length} / 500
                </span>
              </div>
              <Textarea
                id="category-description"
                placeholder="Write a clear description of the items and accessories in this category (up to 500 chars)..."
                rows={3}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  if (error) setError(null);
                }}
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Required for catalog SEO and marketplace grouping.
              </p>
            </div>
          ) : (
            catObj?.description && (
              <div className="rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Current description:</span>{" "}
                {catObj.description}
                <p className="mt-1 text-[11px] italic">
                  Note: Backend category update endpoint updates name and status.
                </p>
              </div>
            )
          )}

          {/* Active Status toggle for both create and edit */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3.5">
            <div className="space-y-0.5 pr-2">
              <Label
                htmlFor="category-active-toggle"
                className="text-sm font-semibold cursor-pointer"
              >
                Catalog Status
              </Label>
              <p className="text-xs text-muted-foreground">
                {active ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Active — visible in marketplace navigation & product filters
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Inactive — hidden from public marketplace browsing
                  </span>
                )}
              </p>
            </div>
            <Switch
              id="category-active-toggle"
              checked={active}
              onCheckedChange={setActive}
              disabled={submitting}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" disabled={submitting} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              submitting ||
              !name.trim() ||
              (!isEdit && (!description.trim() || description.length > 500))
            }
            onClick={handleSave}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OrderDetailsDialog({ order, trigger }: { order: Order; trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order {order.id}</DialogTitle>
          <DialogDescription>
            {order.date} · {order.customer}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 rounded-md border p-4 text-sm">
          <Row label="Product" value={order.product} />
          <Row label="Seller" value={order.seller} />
          <Row label="Quantity" value={String(order.quantity)} />
          <Row label="Amount" value={money(order.amount)} />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment</span>
            <span>{order.payment}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order status</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        <div className="rounded-md bg-muted p-4">
          <p className="text-xs font-bold uppercase text-muted-foreground">Shipping information</p>
          <p className="mt-2 text-sm">
            {order.customer}
            <br />
            128 Market Street
            <br />
            San Francisco, CA 94105
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
export function OrderStatusDialog({
  order,
  trigger,
  onSave,
}: {
  order: Order;
  trigger: React.ReactNode;
  onSave: (status: OrderStatus) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update order status</DialogTitle>
          <DialogDescription>
            Changes will sync in real time after your Socket.IO backend is connected.
          </DialogDescription>
        </DialogHeader>
        <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button onClick={() => onSave(status)}>Update status</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
