import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { auth } from "@/auth";

// Always read fresh data instead of a build-time snapshot
export const dynamic = "force-dynamic";

type ProductItem = {
  id: string;
  name: string;
  price: string | number | null;
  images: string[] | null;
};

const columnStyles = [
  { offset: "pt-[14vh]", heights: ["h-[30vh]", "h-[30vh]"] },
  { offset: "pt-[4vh]", heights: ["h-[34vh]", "h-[46vh]"] },
  { offset: "pt-[20vh]", heights: ["h-[30vh]", "h-[30vh]"] },
];

export default async function MyProductsPage() {
  // 1. Only authenticated users can see this page
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in?callbackUrl=/sell/products");
  }

  // 2. Only fetch the products owned by the current user
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.userId, userId))
    .orderBy(desc(products.createdAt));

  const productsForGallery: ProductItem[] = rows.map((product) => ({
    id: String(product.id),
    name: product.name,
    price: product.price,
    images: (product.images as string[] | null) ?? null,
  }));

  return <MyProductsGallery products={productsForGallery} />;
}

function PlantCard({
  product,
  height,
}: {
  product: ProductItem;
  height: string;
}) {
  const image = product.images?.[0];
  const price = Number(product.price ?? 0);

  return (
    <article
      className={`${height} relative w-[200px] shrink-0 overflow-hidden
        rounded-3xl bg-gradient-to-b from-[#3a7a58] to-[#1f4d38]
        shadow-xl shadow-black/30 ring-1 ring-white/10`}
    >
      {/* Shelf / floor */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-black/15" />

      {/* Product image */}
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={product.name}
          className="absolute inset-x-0 bottom-[18%] mx-auto
            h-[65%] max-w-full object-contain drop-shadow-2xl"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-white/70">
          No image available
        </div>
      )}

      {/* Product name */}
      <p
        className="absolute inset-x-2 top-3 truncate text-center
          text-sm font-medium text-white"
        title={product.name}
      >
        {product.name}
      </p>

      {/* Price */}
      <p className="absolute inset-x-0 bottom-3 text-center text-xs tracking-wide text-white/80">
        ${Number.isFinite(price) ? price.toFixed(2) : "0.00"}
      </p>
    </article>
  );
}

function MyProductsGallery({ products = [] }: { products?: ProductItem[] }) {
  const columns = columnStyles.map((style, columnIndex) => ({
    ...style,
    items: products.filter((_, index) => index % 3 === columnIndex),
  }));

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_center,#1d4a36_0%,#0f2b1f_70%,#091c14_100%)] px-4 py-8 text-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My plants</h1>
          <p className="mt-1 text-sm text-white/60">
            Manage the plants you have listed.
          </p>
        </div>

        <Link
          href="/sell/add-product"
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#173c2b] transition hover:bg-white/90"
        >
          + Add product
        </Link>
      </header>

      {products.length === 0 ? (
        <section className="mx-auto mt-16 max-w-md text-center">
          <h2 className="text-xl font-medium">Your collection starts here</h2>
          <p className="mt-3 text-sm text-white/65">
            You have not added any plants yet. Add your first product to see it
            here.
          </p>
          <Link
            href="/sell/add-product"
            className="mt-6 inline-block rounded-full border border-white/30 px-5 py-3 text-sm hover:bg-white/10"
          >
            Add your first plant
          </Link>
        </section>
      ) : (
        <section
          aria-label="Your previously added products"
          className="mx-auto mt-6 flex max-w-5xl justify-center gap-3 sm:gap-5"
        >
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={`flex min-w-0 flex-col items-center gap-5 ${column.offset}`}
            >
              {column.items.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/sell/products/${product.id}/edit`}
                  className="rounded-3xl transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  aria-label={`Edit ${product.name}`}
                >
                  <PlantCard
                    product={product}
                    height={column.heights[index % column.heights.length]}
                  />
                </Link>
              ))}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}