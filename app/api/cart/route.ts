import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export interface CartItem {
  id: number;
  name: string;
  qty: number;
  basePrice: number;
  currentPrice: number;
  surgeMultiplier: number;
}

export interface CartResponse {
  sessionId: string;
  items: CartItem[];
  subtotal: number;
  calculatedAt: string;
}

export async function GET(req: NextRequest) {
  // Accessing `cookies()` ensures Next.js runs this at request time on every call
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "guest-session";

  console.log(`[API HIT] /api/cart evaluated for session: ${sessionId}`);

  const baseItems = [
    {
      id: 1,
      name: "Wireless Noise-Canceling Headphones",
      qty: 1,
      basePrice: 120,
    },
    { id: 2, name: "Braided Fast-Charging USB-C Cable", qty: 2, basePrice: 15 },
    { id: 3, name: "Ergonomic Desk Mat", qty: 1, basePrice: 35 },
  ];

  const items: CartItem[] = baseItems.map((item) => {
    const surgeMultiplier = parseFloat((0.9 + Math.random() * 0.35).toFixed(2));
    const currentPrice = Math.round(item.basePrice * surgeMultiplier);

    return {
      ...item,
      surgeMultiplier,
      currentPrice,
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.currentPrice * item.qty,
    0,
  );

  return NextResponse.json({
    sessionId,
    items,
    subtotal,
    calculatedAt: new Date().toLocaleTimeString(),
  });
}
