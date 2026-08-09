import Link from "next/link";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { userService } from "@/services/userService";
import { formatPKR } from "@/lib/utils";

export default async function AdminDashboard() {
  const [{ items, total }, categories, users] = await Promise.all([
    productService.list({ limit: 1000 }),
    categoryService.list(),
    userService.list(),
  ]);

  const inventoryValue = items.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStock = items.filter((p) => p.stock === 0).length;
  const featured = items.filter((p) => p.isFeatured).length;

  const cards = [
    { label: "Total Products", value: total, href: "/admin/products" },
    { label: "Inventory Value", value: formatPKR(inventoryValue), href: "/admin/products" },
    { label: "Out of Stock", value: outOfStock, href: "/admin/products" },
    { label: "Featured", value: featured, href: "/admin/products" },
    { label: "Categories", value: categories.length, href: "/admin/categories" },
    { label: "Customers", value: users.length, href: "/admin/customers" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl bg-white border border-ash/10 p-5 shadow-soft hover:border-ash/25 transition-colors"
          >
            <p className="text-xs text-ash/50">{c.label}</p>
            <p className="text-2xl font-heading font-bold mt-1">{c.value}</p>
          </Link>
        ))}
      </div>

      <p className="text-sm text-ash/50 mt-10">
        Orders, coupons, and reviews are shown with sample data until a real Order/Review model and checkout
        persistence are built (see README). Products, Categories, Customers, and Settings above are fully real.
      </p>
    </div>
  );
}
