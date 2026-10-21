import { NextResponse } from "next/server";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export async function GET() {
  console.log("FETCHING PRODUCTS");

  const products: Product[] = Array.from({ length: 20 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      name: `Premium Item ${id}`,
      price: Math.floor(20 + Math.random() * 80),
      image: `https://picsum.photos/seed/${id}/400/300`,
    };
  });

  return NextResponse.json(products);
}
