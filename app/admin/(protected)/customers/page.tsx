import { userService } from "@/services/userService";

export default async function AdminCustomersPage() {
  const users = await userService.list();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-2">Customers ({users.length})</h1>
      <p className="text-sm text-ash/50 mb-8">
        Real registered accounts (via /register). Suspend/delete actions arrive alongside full role management.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-ash/10">
        <table className="w-full text-sm">
          <thead className="bg-cloud text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-ash/10">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-ash/60">{u.email}</td>
                <td className="px-4 py-3 text-ash/60">
                  {new Date(u.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
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
