"use client";

import Banner from "@/components/Banner";
import Products from "@/components/Products";

export default function Home() {
  // Always show products - no login required to browse
  return (
    <main>
      <Banner />
      <Products />
    </main>
  );
}
