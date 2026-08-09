"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  ShoppingBag,
  Users,
  Ticket,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Add Product", href: "/admin/products/new", icon: PlusCircle },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/admin-logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-full md:w-60 shrink-0 border-r border-ash/10 md:min-h-[calc(100vh-5rem)] py-8 px-4 flex flex-col justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest2 text-ash/40 px-3 mb-4">Admin</p>
        <nav className="space-y-1">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-ash text-white" : "hover:bg-cloud"
                )}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ash/60 hover:bg-cloud hover:text-ash transition-colors"
      >
        <LogOut size={16} />
        Log out
      </button>
    </aside>
  );
}
