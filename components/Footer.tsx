import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Men", href: "/shop?gender=men" },
      { label: "Women", href: "/shop?gender=women" },
      { label: "Accessories", href: "/shop?category=accessories" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Returns", href: "/returns" },
      { label: "Shipping", href: "/shipping" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Admin Login", href: "/admin/login" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24 grain">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper text-ink font-heading text-sm font-bold">
              T
            </span>
            <h3 className="font-heading text-lg font-bold tracking-widest2 uppercase">Tabsha</h3>
          </div>
          <p className="text-sm text-paper/60 max-w-xs">
            Considered clothing and accessories, made to last beyond a season.
          </p>
          <form className="mt-6 flex max-w-sm">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-l-full bg-white/10 px-4 py-2.5 text-sm placeholder:text-paper/40 focus:outline-none"
            />
            <button className="rounded-r-full bg-paper px-5 text-sm font-medium text-ink hover:bg-cloud transition-colors">
              Join
            </button>
          </form>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-paper/60 hover:text-paper transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} Tabsha Clothing Studio. All rights reserved.
      </div>
    </footer>
  );
}
