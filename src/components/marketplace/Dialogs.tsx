import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Mail, Store, Trash2, Upload, UploadCloud, User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { categoryApi, type CategoryItem, type ActiveCategoryItem } from "@/api/category.api";
import { productApi, mapBackendProductToProduct, type UpdateProductPayload } from "@/api/product.api";
import { useAppState } from "./useAppState";
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
import { ProductImage, OrderStatusBadge, StockBadge } from "./Common";
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
  const { role, accessToken, user, refreshProducts } = useAppState();
  const [activeCategories, setActiveCategories] = useState<ActiveCategoryItem[]>(() =>
    categoryApi.getCachedActive(),
  );
  const [isSaving, setIsSaving] = useState(false);

  const empty: Product = {
    id: `p-${Date.now()}`,
    name: "",
    seller: user?.storeName || user?.name || "North & Pine",
    category: categories[0] ?? "Electronics",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    productImage: "",
    imagePosition: "0% 0%",
  };

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(product ?? empty);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.productImage ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (.jpg, .jpeg, or .png)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5MB");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    field("productImage", objectUrl);
    toast.success(`Image selected: ${file.name}`);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    field("productImage", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (open) {
      setDraft(product ?? { ...empty, id: `p-${Date.now()}` });
      setSelectedFile(null);
      setPreviewUrl(product?.productImage ?? null);
      categoryApi
        .listActive()
        .then((cats) => {
          if (cats && cats.length > 0) {
            setActiveCategories(cats);
            if (!product) {
              setDraft((current) => ({
                ...current,
                categoryId: current.categoryId || cats[0]._id,
                category: current.categoryId
                  ? cats.find((c) => c._id === current.categoryId)?.name || current.category
                  : cats[0].name,
              }));
            }
          }
        })
        .catch(() => undefined);
    }
  }, [open, product]);

  const field = (key: keyof Product, value: string | number) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!draft.name.trim()) {
      toast.error("Please provide a product name");
      return;
    }
    if (!draft.description.trim()) {
      toast.error("Please provide a product description");
      return;
    }
    if (draft.price < 0) {
      toast.error("Price must be 0 or greater");
      return;
    }
    if (draft.stock < 0) {
      toast.error("Stock must be 0 or greater");
      return;
    }

    // Creating a new product
    if (!product) {
      const isSeller = (role === "seller" || user?.role === "seller") && !!accessToken;
      if (isSeller) {
        if (!selectedFile) {
          toast.error("Please upload a product image (.jpg, .jpeg, or .png, max 5MB)");
          return;
        }

        const categoryId =
          draft.categoryId ||
          activeCategories.find((c) => c.name === draft.category)?._id ||
          activeCategories[0]?._id;

        if (!categoryId) {
          toast.error("Please select an active category from the backend list");
          return;
        }

        try {
          setIsSaving(true);
          const created = await productApi.create(
            {
              name: draft.name.trim(),
              description: draft.description.trim(),
              category: categoryId,
              price: String(draft.price),
              discount: String(draft.discount || "0"),
              stock: String(draft.stock || "0"),
              productImage: selectedFile, // the actual File object
            },
            accessToken,
          );

          toast.success(
            `Product "${created.name}" created successfully! (${created.productId})`,
          );
          const mapped = mapBackendProductToProduct(created);
          onSave(mapped);
          if (refreshProducts) {
            await refreshProducts();
          }
          setOpen(false);
        } catch (err: unknown) {
          const msg =
            err instanceof ApiError ? err.message : (err as Error)?.message || "Failed to create product";
          toast.error(msg);
        } finally {
          setIsSaving(false);
        }
        return;
      }

      // Demo / fallback mode
      onSave(draft);
      toast.success("Product saved to local catalog preview");
      setOpen(false);
      return;
    }

    // Editing existing product
    const targetProductId = product._id || product.id;
    if (targetProductId && accessToken && (role === "seller" || user?.role === "seller")) {
      try {
        setIsSaving(true);
        const categoryId =
          draft.categoryId ||
          activeCategories.find((c) => c.name === draft.category)?._id ||
          product.categoryId;

        const updatePayload: UpdateProductPayload = {
          name: draft.name.trim(),
          description: draft.description.trim(),
          price: Number(draft.price),
          discount: Number(draft.discount || 0),
          stock: Number(draft.stock || 0),
        };

        if (categoryId) {
          updatePayload.category = categoryId;
        }

        const imgUrl =
          (!previewUrl?.startsWith("blob:") ? previewUrl : null) ||
          (!draft.productImage?.startsWith("blob:") ? draft.productImage : null) ||
          (!product.productImage?.startsWith("blob:") ? product.productImage : null);

        if (imgUrl && !imgUrl.startsWith("blob:") && !imgUrl.startsWith("data:")) {
          updatePayload.productImage = imgUrl;
        }

        const updated = await productApi.update(
          targetProductId,
          updatePayload,
          accessToken,
        );
        toast.success("Product updated successfully");
        onSave(mapBackendProductToProduct(updated));
        if (refreshProducts) await refreshProducts();
        setOpen(false);
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 404) {
          // Backend note §4: fallback if PATCH is not wired at all on the router
          onSave(draft);
          toast.info(
            "Backend route PATCH /products/:id is not wired yet; updated in local catalog preview.",
          );
          setOpen(false);
        } else {
          const msg =
            err instanceof ApiError
              ? err.message
              : (err as Error)?.message || "Failed to update product";
          toast.error(msg);
        }
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // Default local update
    onSave(draft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {role === "seller"
              ? "Products are synchronized with your live backend catalog."
              : "Manage your catalog, pricing, images, and stock."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-2 md:grid-cols-[210px_1fr]">
          <div>
            <Label>Product image *</Label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 aspect-square cursor-pointer overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted flex flex-col items-center justify-center hover:border-primary/60 hover:bg-muted/80 transition-all group relative"
            >
              {previewUrl || draft.productImage ? (
                <div className="relative h-full w-full">
                  <img
                    src={previewUrl || draft.productImage}
                    alt="Selected product preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium gap-1">
                    <UploadCloud className="size-5" />
                    <span>Click to change</span>
                  </div>
                </div>
              ) : product ? (
                <ProductImage product={product} className="h-full" />
              ) : (
                <div className="flex flex-col items-center justify-center p-3 text-center text-muted-foreground">
                  <UploadCloud className="size-8 text-muted-foreground/60 mb-2 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-medium text-foreground">Click to upload image</span>
                  <span className="text-[11px] text-muted-foreground">JPG or PNG (max 5MB)</span>
                </div>
              )}
            </div>

            {selectedFile && (
              <p
                className="mt-1.5 text-[11px] text-muted-foreground truncate"
                title={selectedFile.name}
              >
                📁 {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}

            <div className="mt-2 flex gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="size-3.5 mr-1" />
                {previewUrl || draft.productImage ? "Change image" : "Upload image"}
              </Button>
              {(previewUrl || draft.productImage) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                  onClick={handleClearImage}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Product name *</Label>
              <Input
                id="name"
                placeholder="e.g. Running Shoes"
                value={draft.name}
                onChange={(event) => field("name", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the product..."
                rows={3}
                value={draft.description}
                onChange={(event) => field("description", event.target.value)}
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={
                  draft.categoryId ||
                  activeCategories.find((c) => c.name === draft.category)?._id ||
                  (activeCategories.length > 0 ? activeCategories[0]._id : draft.category)
                }
                onValueChange={(val) => {
                  const match = activeCategories.find((c) => c._id === val);
                  if (match) {
                    setDraft((cur) => ({
                      ...cur,
                      categoryId: match._id,
                      category: match.name,
                    }));
                  } else {
                    setDraft((cur) => ({
                      ...cur,
                      category: val,
                      categoryId: undefined,
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {activeCategories.length > 0
                    ? activeCategories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    : categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Price ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
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
                <Label>Stock *</Label>
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
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            disabled={!draft.name || draft.price < 0 || isSaving}
            onClick={handleSave}
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin mr-1" />
            ) : (
              <Upload className="size-4 mr-1" />
            )}
            {isSaving ? "Saving..." : product ? "Update product" : "Save product"}
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

export function ProductDetailsDialog({
  product,
  trigger,
}: {
  product: Product;
  trigger: React.ReactNode;
}) {
  const sellerFirstName = product.sellerDetails?.firstName || "";
  const sellerLastName = product.sellerDetails?.lastName || "";
  const sellerEmail = product.sellerDetails?.email || "";
  const storeName = product.storeName || product.seller || "Store";
  const sellerFullName =
    [sellerFirstName, sellerLastName].filter(Boolean).join(" ") ||
    (product.seller !== storeName ? product.seller : "");

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-bold tracking-tight">Product Details</DialogTitle>
            {product.productId && (
              <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                {product.productId}
              </Badge>
            )}
          </div>
          <DialogDescription>
            Complete catalog specifications and verified seller details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          {/* Product Overview Section */}
          <div className="grid gap-4 sm:grid-cols-[180px_1fr] items-start">
            <div className="overflow-hidden rounded-xl border bg-muted/40 aspect-square flex items-center justify-center">
              {product.productImage ? (
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProductImage product={product} className="h-full w-full" />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-foreground leading-snug">{product.name}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <StockBadge stock={product.stock} />
                  <span className="text-xs text-muted-foreground">
                    ({product.stock} units available)
                  </span>
                </div>
              </div>

              {/* Price card */}
              <div className="flex items-baseline gap-3 rounded-lg border bg-muted/40 p-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                    Price
                  </span>
                  <span className="text-2xl font-extrabold text-foreground font-display">
                    {money(finalPrice(product))}
                  </span>
                </div>
                {product.discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {money(product.price)}
                    </span>
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-none text-xs">
                      {product.discount}% OFF
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </span>
            <div className="rounded-lg border bg-muted/20 p-3.5 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {product.description || "No description provided for this product."}
            </div>
          </div>

          {/* Product Metadata (ID, Created, Updated) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="rounded-md border bg-muted/10 p-2.5">
              <span className="text-muted-foreground block font-medium">Product ID</span>
              <span className="font-mono font-semibold text-foreground">
                {product.productId || product._id || product.id}
              </span>
            </div>
            {product.createdAt && (
              <div className="rounded-md border bg-muted/10 p-2.5">
                <span className="text-muted-foreground block font-medium">Created At</span>
                <span className="font-medium text-foreground">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {product.updatedAt && (
              <div className="rounded-md border bg-muted/10 p-2.5">
                <span className="text-muted-foreground block font-medium">Last Updated</span>
                <span className="font-medium text-foreground">
                  {new Date(product.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Seller Information Section */}
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-primary/15 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Store className="size-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Seller Information</h4>
                  <p className="text-xs text-muted-foreground">Store & contact credentials</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs bg-background/60 font-medium">
                Merchant
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-background/90 p-3 rounded-lg border shadow-xs space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  Store Name
                </span>
                <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Store className="size-4 text-primary shrink-0" />
                  <span>{storeName}</span>
                </div>
              </div>

              <div className="bg-background/90 p-3 rounded-lg border shadow-xs space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  First Name
                </span>
                <div className="font-medium text-foreground text-sm flex items-center gap-1.5">
                  <User className="size-4 text-muted-foreground shrink-0" />
                  <span>{sellerFirstName || (sellerFullName ? sellerFullName.split(" ")[0] : "—")}</span>
                </div>
              </div>

              <div className="bg-background/90 p-3 rounded-lg border shadow-xs space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  Last Name
                </span>
                <div className="font-medium text-foreground text-sm flex items-center gap-1.5">
                  <User className="size-4 text-muted-foreground shrink-0" />
                  <span>
                    {sellerLastName ||
                      (sellerFullName && sellerFullName.split(" ").length > 1
                        ? sellerFullName.split(" ").slice(1).join(" ")
                        : "—")}
                  </span>
                </div>
              </div>

              <div className="bg-background/90 p-3 rounded-lg border shadow-xs space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  Email Address
                </span>
                <div className="font-medium text-foreground text-sm flex items-center gap-1.5 truncate">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  {sellerEmail ? (
                    <a
                      href={`mailto:${sellerEmail}`}
                      className="text-primary hover:underline truncate"
                      title={sellerEmail}
                    >
                      {sellerEmail}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
