import { cookies } from "next/headers";
import { userService } from "@/services/userService";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import AdminUserRowActions from "@/components/AdminUserRowActions";

export default async function AdminCustomersPage() {
  const users = await userService.list();

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? await verifyAdminToken(token) : null;

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-2">Customers ({users.length})</h1>
      <p className="text-sm text-ash/50 mb-8">
        Real registered accounts (via /register). Promote any customer to admin, or remove admin access, right from
        this table.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-ash/10">
        <table className="w-full text-sm">
          <thead className="bg-cloud text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-ash/10">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-ash/60">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      u.role === "admin"
                        ? "inline-flex items-center rounded-full bg-ash text-white px-2.5 py-0.5 text-xs font-medium"
                        : "inline-flex items-center rounded-full bg-cloud text-ash/60 px-2.5 py-0.5 text-xs font-medium"
                    }
                  >
                    {u.role === "admin" ? "Admin" : "Customer"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ash/60">
                  {new Date(u.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminUserRowActions
                    id={u._id}
                    role={u.role}
                    isSelf={session?.userId === u._id}
                    isLastAdmin={u.role === "admin" && adminCount <= 1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center text-sm text-ash/50 py-12">
            No customers have registered yet — try creating an account at /register.
          </p>
        )}
      </div>
    </div>
  );
}
