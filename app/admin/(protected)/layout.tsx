import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

// Auth note: /admin/* pages (other than /admin/login) are gated by
// middleware.ts, which checks for a valid admin JWT cookie and redirects
// unauthenticated visitors to /admin/login.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <AdminTopbar />
      <div className="mx-auto max-w-7xl px-5 md:px-8 flex flex-col md:flex-row gap-8">
        <AdminSidebar />
        <div className="flex-1 py-8 min-w-0">{children}</div>
      </div>
    </div>
  );
}
