import DashboardSidebar from "@/components/DashboardSidebar";

// Auth note: /dashboard/* pages are gated by middleware.ts, which checks for
// a valid customer JWT cookie (set by /api/auth/login or /api/auth/register)
// and redirects unauthenticated visitors to /login.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 flex flex-col md:flex-row gap-8">
      <DashboardSidebar />
      <div className="flex-1 py-8 min-w-0">{children}</div>
    </div>
  );
}
