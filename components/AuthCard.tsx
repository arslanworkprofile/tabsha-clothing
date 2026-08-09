import Link from "next/link";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-5 py-16 bg-cloud">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 md:p-10 shadow-soft">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ash text-paper font-heading text-sm font-bold">
            T
          </span>
          <span className="font-heading text-sm font-bold tracking-widest2 uppercase">Tabsha</span>
        </Link>
        <h1 className="font-heading text-2xl font-bold tracking-tightest">{title}</h1>
        {subtitle && <p className="text-sm text-ash/50 mt-2 mb-6">{subtitle}</p>}
        <div className={subtitle ? "" : "mt-6"}>{children}</div>
        {footer && <div className="mt-6 text-sm text-ash/60">{footer}</div>}
      </div>
    </div>
  );
}
