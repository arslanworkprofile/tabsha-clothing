"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Heart, Package, MapPin, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Profile", href: "/dashboard", icon: User },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUserName(data?.user?.name ?? null))
      .catch(() => setUserName(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-full md:w-60 shrink-0 border-r border-ash/10 md:min-h-[calc(100vh-5rem)] py-8 px-4 flex flex-col justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest2 text-ash/40 px-3 mb-1">My Account</p>
        {userName && <p className="text-sm font-medium px-3 mb-4 truncate">{userName}</p>}
        <nav className={cn("space-y-1", !userName && "mt-4")}>
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
