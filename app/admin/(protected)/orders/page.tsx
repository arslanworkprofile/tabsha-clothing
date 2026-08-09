const SAMPLE_ORDERS = [
  { id: "TAB-10231", customer: "Ayesha Khan", date: "28 Jul 2026", status: "Delivered", total: "Rs 21,900" },
  { id: "TAB-10198", customer: "Hassan Ali", date: "12 Jul 2026", status: "Shipped", total: "Rs 6,800" },
  { id: "TAB-10142", customer: "Sara Malik", date: "02 Jul 2026", status: "Processing", total: "Rs 15,900" },
  { id: "TAB-10101", customer: "Bilal Ahmed", date: "27 Jun 2026", status: "Pending", total: "Rs 3,200" },
  { id: "TAB-10088", customer: "Zainab Raza", date: "19 Jun 2026", status: "Cancelled", total: "Rs 27,500" },
];

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Pending: "bg-cloud text-ash/60",
  Cancelled: "bg-red-100 text-red-700",
};

// Sample data — a real Order model (created at checkout, with status transitions,
// invoices, and tracking numbers) is the next backend piece to build.
export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-2">Orders</h1>
      <p className="text-sm text-ash/50 mb-8">
        Sample data — checkout doesn't persist real orders yet, so there's nothing to manage here until that's wired up.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-ash/10">
        <table className="w-full text-sm">
          <thead className="bg-cloud text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium text-right">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ORDERS.map((o) => (
              <tr key={o.id} className="border-t border-ash/10">
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3 text-ash/60">{o.date}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3">{o.total}</td>
                <td className="px-4 py-3 text-right text-ash/40">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
