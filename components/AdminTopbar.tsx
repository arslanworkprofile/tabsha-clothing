import Link from "next/link";

export default function AdminTopbar() {
  return (
    <header className="sticky top-0 z-40 bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-14 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper text-ink font-heading text-xs font-bold">
            T
          </span>
          <span className="font-heading text-xs font-bold tracking-widest2 uppercase">Tabsha Admin</span>
        </Link>
        <Link href="/" className="text-xs text-paper/60 hover:text-paper underline underline-offset-4">
          View storefront
        </Link>
      </div>
    </header>
  );
}
