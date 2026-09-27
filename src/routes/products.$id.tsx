import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailsPage } from "@/components/marketplace/StorePages";

function ProductDetailsRouteComponent() {
  const { id } = Route.useParams();
  return <ProductDetailsPage id={id} />;
}

export const Route = createFileRoute("/products/$id")({
  head: () => ({
    meta: [
      { title: "Product details — E-Com" },
      {
        name: "description",
        content: "View product details, pricing, availability, and seller information.",
      },
      { property: "og:title", content: "Product details — E-Com" },
      {
        property: "og:description",
        content: "View product details, pricing, availability, and seller information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductDetailsRouteComponent,
});
