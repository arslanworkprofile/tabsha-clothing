const SAMPLE_ORDERS = [
  { id: "TAB-10231", date: "28 Jul 2026", status: "Delivered", total: "PKR 21,900" },
  { id: "TAB-10198", date: "12 Jul 2026", status: "Shipped", total: "PKR 6,800" },
  { id: "TAB-10142", date: "02 Jul 2026", status: "Processing", total: "PKR 15,900" },
];

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

// Phase 1: sample data. Phase 2 adds a real Order model, checkout persistence,
// and this page reads the logged-in user's actual orders.
export default function OrdersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-2">Order History</h1>
      <p className="text-sm text-ash/50 mb-8">Sample orders — real order persistence arrives in Phase 2.</p>

      <div className="overflow-x-auto rounded-2xl border border-ash/10">
        <table className="w-full text-sm">
          <thead className="bg-cloud text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
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
