import { cacheLife, cacheTag } from "next/cache";
import { refreshProducts } from "@/app/actions";
import { Product } from "@/app/api/products/route";
import Image from "next/image";

async function getProducts() {
  "use cache";
  cacheTag("products-list");
  // Explicitly configure 60 seconds
  cacheLife({
    stale: 60, // Client/router considers stale after 60 seconds
    revalidate: 60, // Server triggers background revalidation after 60 seconds
    expire: 300, // Hard evict after 5 minutes if no requests arrive
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products`);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const products: Product[] = await res.json();
  const cachedAt = new Date().toLocaleTimeString();

  return { products, cachedAt };
}

export default async function ProductList() {
  const { products, cachedAt } = await getProducts();

  return (
    <section className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl gap-4">
        <div className="space-y-1 text-sm font-mono text-neutral-400">
          <p>
            Cache Tag: <span className="text-neutral-200">products-list</span>
          </p>
          <p>
            Cached At:{" "}
            <span className="text-amber-400 font-bold">{cachedAt}</span>
          </p>
        </div>

        <form action={refreshProducts}>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Purge Cache & Re-fetch API
          </button>
        </form>
      </div>

      {/* 20 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full bg-neutral-800">
              <Image
                loading="eager"
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white text-sm">
                  {product.name}
                </h3>
                <p className="text-xs text-neutral-400">In Stock</p>
              </div>
              <span className="font-bold text-emerald-400">
                ${product.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
