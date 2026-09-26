export type Role = "customer" | "seller" | "admin";
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered";
export type PaymentStatus = "Paid" | "Pending" | "Failed";

export interface ProductSellerDetails {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  storeName?: string;
}

export interface Product {
  id: string;
  _id?: string;
  productId?: string;
  name: string;
  seller: string;
  storeName?: string;
  sellerDetails?: ProductSellerDetails;
  category: string;
  categoryId?: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  imagePosition?: string;
  productImage?: string;
  productImagePublicId?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Order {
  id: string;
  customer: string;
  seller: string;
  product: string;
  quantity: number;
  amount: number;
  payment: PaymentStatus;
  status: OrderStatus;
  date: string;
}
export interface CartLine {
  productId: string;
  quantity: number;
}

export const categories = ["Electronics", "Fashion", "Home", "Travel", "Lifestyle"];
export const products: Product[] = [
  {
    id: "p1",
    productId: "PRD-1001",
    name: "Studio ANC Headphones",
    seller: "North & Pine",
    storeName: "North & Pine",
    sellerDetails: {
      firstName: "Oliver",
      lastName: "North",
      email: "hello@northpine.co",
      storeName: "North & Pine",
    },
    category: "Electronics",
    description:
      "Immersive over-ear headphones with active noise cancellation, soft-touch controls, and a 40-hour battery.",
    price: 189,
    discount: 20,
    stock: 18,
    imagePosition: "0% 0%",
  },
  {
    id: "p2",
    productId: "PRD-1002",
    name: "Pace Knit Runners",
    seller: "Motion House",
    storeName: "Motion House",
    sellerDetails: {
      firstName: "Elena",
      lastName: "Rostova",
      email: "team@motion.house",
      storeName: "Motion House",
    },
    category: "Fashion",
    description:
      "Lightweight everyday trainers with breathable knit uppers and responsive cushioned soles.",
    price: 124,
    discount: 15,
    stock: 7,
    imagePosition: "50% 0%",
  },
  {
    id: "p3",
    productId: "PRD-1003",
    name: "Luna Ceramic Lamp",
    seller: "Atelier Home",
    storeName: "Atelier Home",
    sellerDetails: {
      firstName: "Sophie",
      lastName: "Laurent",
      email: "care@atelierhome.co",
      storeName: "Atelier Home",
    },
    category: "Home",
    description:
      "Hand-finished ceramic table lamp with a textured linen shade and warm ambient light.",
    price: 98,
    discount: 0,
    stock: 24,
    imagePosition: "100% 0%",
  },
  {
    id: "p4",
    productId: "PRD-1004",
    name: "Transit Daypack",
    seller: "Roam Supply",
    storeName: "Roam Supply",
    sellerDetails: {
      firstName: "Liam",
      lastName: "Vance",
      email: "ops@roamsupply.co",
      storeName: "Roam Supply",
    },
    category: "Travel",
    description:
      "Weather-resistant commuter backpack with a padded laptop sleeve and considered internal organization.",
    price: 142,
    discount: 10,
    stock: 4,
    imagePosition: "0% 100%",
  },
  {
    id: "p5",
    productId: "PRD-1005",
    name: "Arc Steel Bottle",
    seller: "Field Goods",
    storeName: "Field Goods",
    sellerDetails: {
      firstName: "Maya",
      lastName: "Lin",
      email: "support@fieldgoods.co",
      storeName: "Field Goods",
    },
    category: "Lifestyle",
    description:
      "Double-wall stainless bottle that keeps drinks cold for 24 hours with a leakproof cap.",
    price: 38,
    discount: 0,
    stock: 42,
    imagePosition: "50% 100%",
  },
  {
    id: "p6",
    productId: "PRD-1006",
    name: "Key 68 Mechanical",
    seller: "North & Pine",
    storeName: "North & Pine",
    sellerDetails: {
      firstName: "Oliver",
      lastName: "North",
      email: "hello@northpine.co",
      storeName: "North & Pine",
    },
    category: "Electronics",
    description:
      "Compact wireless mechanical keyboard with tactile switches and multi-device connectivity.",
    price: 116,
    discount: 25,
    stock: 0,
    imagePosition: "100% 100%",
  },
];
export const orders: Order[] = [
  {
    id: "ORD-1048",
    customer: "Ariana Wells",
    seller: "North & Pine",
    product: "Studio ANC Headphones",
    quantity: 1,
    amount: 151.2,
    payment: "Paid",
    status: "Shipped",
    date: "Sep 18, 2026",
  },
  {
    id: "ORD-1047",
    customer: "Marcus Chen",
    seller: "Motion House",
    product: "Pace Knit Runners",
    quantity: 2,
    amount: 210.8,
    payment: "Paid",
    status: "Processing",
    date: "Sep 17, 2026",
  },
  {
    id: "ORD-1046",
    customer: "Nora Patel",
    seller: "Atelier Home",
    product: "Luna Ceramic Lamp",
    quantity: 1,
    amount: 98,
    payment: "Pending",
    status: "Confirmed",
    date: "Sep 17, 2026",
  },
  {
    id: "ORD-1045",
    customer: "Ethan Brooks",
    seller: "Roam Supply",
    product: "Transit Daypack",
    quantity: 1,
    amount: 127.8,
    payment: "Paid",
    status: "Delivered",
    date: "Sep 15, 2026",
  },
];
export const sellers = [
  {
    name: "North & Pine",
    email: "hello@northpine.co",
    products: 12,
    orders: 184,
    joined: "Mar 12, 2026",
    status: "Active",
  },
  {
    name: "Motion House",
    email: "team@motion.house",
    products: 8,
    orders: 96,
    joined: "Apr 08, 2026",
    status: "Active",
  },
  {
    name: "Atelier Home",
    email: "care@atelierhome.co",
    products: 16,
    orders: 131,
    joined: "Apr 21, 2026",
    status: "Active",
  },
  {
    name: "Roam Supply",
    email: "ops@roamsupply.co",
    products: 6,
    orders: 58,
    joined: "Jun 02, 2026",
    status: "Review",
  },
];
export const customers = [
  {
    name: "Ariana Wells",
    email: "ariana@example.com",
    orders: 9,
    joined: "May 14, 2026",
    status: "Active",
  },
  {
    name: "Marcus Chen",
    email: "marcus@example.com",
    orders: 5,
    joined: "Jun 19, 2026",
    status: "Active",
  },
  {
    name: "Nora Patel",
    email: "nora@example.com",
    orders: 3,
    joined: "Jul 07, 2026",
    status: "Active",
  },
  {
    name: "Ethan Brooks",
    email: "ethan@example.com",
    orders: 7,
    joined: "Jul 25, 2026",
    status: "Active",
  },
];
export const finalPrice = (p: Product) => p.price * (1 - p.discount / 100);
export const stockStatus = (stock: number): StockStatus =>
  stock === 0 ? "Out of Stock" : stock < 8 ? "Low Stock" : "In Stock";
export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
