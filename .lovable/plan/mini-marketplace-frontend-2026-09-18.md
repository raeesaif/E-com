# Mini Marketplace Frontend

## Goal
Build a polished, responsive marketplace frontend for exactly three roles—Customer, Seller, and Admin—using local mock data and replaceable API placeholders only. No backend, database, server functions, payment processing, uploads, or real-time server will be created.

## Foundation
- Define a complete light/dark design system with semantic Tailwind tokens, modern typography, restrained teal/coral accents, compact cards, clear tables, and accessible contrast.
- Add reusable shadcn-based primitives and marketplace components: navigation, role sidebars, theme toggle, badges, product cards/grids, price display, filters, pagination, states, dialogs, timelines, and statistics.
- Add typed domain models, realistic mock marketplace data, shared formatters, cart/auth/theme state, and a frontend API layer reading `VITE_API_URL` with clearly isolated request placeholders.
- Keep the existing TanStack Router used by this React project (the supported equivalent of the requested React Router), with frontend-only `ProtectedRoute`, `SellerRoute`, and `AdminRoute` guards.

## Customer Experience
- Public storefront: `/`, `/shop`, `/products/:id`, `/login`, and `/register`.
- Shopping flow: responsive search/filter/sort/pagination, product details, cart quantity/removal/empty state, checkout form and Stripe handoff placeholder, plus success/cancel messaging.
- Account flow: `/orders`, `/orders/:id`, and `/profile`, including order status badges/timeline and a frontend Socket.IO adapter placeholder for future status updates.

## Seller Experience
- Seller-only shell with Dashboard, My Products, Orders, and Profile navigation.
- Dashboard statistics, recent orders, and stock overview.
- Product table with add/edit/delete flows; Dialog-based form with image preview/remove/change, FormData-ready file handling, price/discount preview, and stock status.
- Seller order table with Dialog-based status updates and future real-time update hooks.

## Admin Experience
- Admin-only shell with Dashboard, Sellers, Customers, Products, Categories, and Orders navigation.
- Marketplace statistics, a simple sales chart, recent orders/sellers, and stock overview.
- Focused management tables and dialogs for seller/customer details, product filtering/details, category CRUD, and order details/status.

## Responsive and Quality Checks
- Convert role sidebars to mobile menus; keep filters, product grids, carts, checkout, tables, and dialogs usable on desktop, tablet, and mobile.
- Add route-specific metadata for every page.
- Verify the preview at desktop and mobile widths, exercise key customer/seller/admin flows, and resolve build/runtime issues.

## Technical Notes
- All data mutations remain in memory/local browser state for demonstration; no fake endpoints will be created.
- Theme and mock session/cart state may persist in browser storage for a realistic frontend preview.
- Stripe, Cloudinary, and Socket.IO modules will expose frontend contracts/placeholders only and will not contain secrets or backend logic.
