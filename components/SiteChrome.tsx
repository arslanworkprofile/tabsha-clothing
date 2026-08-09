"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

// The admin panel is a separate back-office app and shouldn't be wrapped in
// the storefront's nav/footer/cart drawer — only the storefront and the
// customer account pages (/dashboard/*) get those.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
