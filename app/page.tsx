import { Suspense } from "react";
import ProductList from "@/components/ProductList";
import UserCartBadge from "@/components/UserCartBadge";

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 sm:p-10 space-y-10">
      {/* Top Header & Dynamic Cart */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-800 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Caching Demo
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Comparing Next.js cached catalog with real-time dynamic user data.
          </p>
        </div>

        {/* Dynamic component wrapped in Suspense */}
        <div className="w-full md:w-auto">
          <Suspense
            fallback={
              <div className="p-5 border border-neutral-800 rounded-xl bg-neutral-900/40 text-neutral-500 font-mono text-xs animate-pulse">
                Loading session cart...
              </div>
            }
          >
            <UserCartBadge />
          </Suspense>
        </div>
      </header>

      {/* Cached Catalog Section */}
      <section className="max-w-6xl mx-auto">
        <Suspense
          fallback={
            <p className="text-center text-neutral-500 font-mono py-12">
              Loading cached product catalog...
            </p>
          }
        >
          <ProductList />
        </Suspense>
      </section>
    </main>
  );
}
