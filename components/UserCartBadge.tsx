import { cookies } from "next/headers";
import { CartResponse } from "@/app/api/cart/route";

async function fetchDynamicCart(): Promise<CartResponse> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/cart`, {
    // 1. Completely bypass Data Cache
    cache: "no-store",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to compute live cart pricing");
  }

  return res.json();
}

export default async function UserCartBadge() {
  const cart = await fetchDynamicCart();

  return (
    <div className="max-w-md w-full p-5 bg-rose-950/20 border border-rose-800/60 rounded-xl text-neutral-100 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            Real-Time Dynamic Pricing
          </span>
          <h3 className="text-lg font-bold mt-0.5">Your Active Cart</h3>
        </div>
        <span className="text-xs font-mono bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-400">
          {cart.sessionId.slice(0, 10)}
        </span>
      </div>

      {/* Dynamic Item List */}
      <div className="space-y-3">
        {cart.items.map((item) => {
          const isSurge = item.surgeMultiplier > 1.0;
          return (
            <div
              key={item.id}
              className="flex justify-between items-start text-sm"
            >
              <div className="space-y-0.5">
                <p className="font-medium">
                  {item.name}{" "}
                  <span className="text-neutral-400 font-normal">
                    x{item.qty}
                  </span>
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="line-through text-neutral-500">
                    ${item.basePrice}
                  </span>
                  <span
                    className={`font-mono px-1 rounded ${
                      isSurge
                        ? "text-rose-400 bg-rose-950/60"
                        : "text-emerald-400 bg-emerald-950/60"
                    }`}
                  >
                    {isSurge ? "+" : ""}
                    {Math.round((item.surgeMultiplier - 1) * 100)}% dynamic rate
                  </span>
                </div>
              </div>
              <span className="font-mono font-bold text-neutral-200">
                ${item.currentPrice * item.qty}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-rose-900/40 flex justify-between items-baseline font-bold">
        <span className="text-neutral-300">Total Due:</span>
        <span className="text-xl font-mono text-emerald-400">
          ${cart.subtotal}
        </span>
      </div>

      {/* Dynamic Inspection Badge */}
      <div className="text-xs bg-neutral-950/90 p-3 rounded-lg border border-neutral-800 font-mono text-neutral-400 space-y-1">
        <p className="flex justify-between">
          <span>Cache Policy:</span>
          <span className="text-rose-400 font-bold">
            no-store (Live On-Demand)
          </span>
        </p>
        <p className="flex justify-between">
          <span>Price Evaluated At:</span>
          <span className="text-amber-400 font-bold">{cart.calculatedAt}</span>
        </p>
      </div>
    </div>
  );
}
