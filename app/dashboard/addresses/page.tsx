import { Pencil, Trash2, Plus } from "lucide-react";

const SAMPLE_ADDRESSES = [
  { label: "Home", name: "Ayesha Khan", line: "House 12, Street 4, DHA Phase 5", city: "Lahore", phone: "+92 300 1234567", isDefault: true },
  { label: "Office", name: "Ayesha Khan", line: "Suite 302, Tower B, Gulberg III", city: "Lahore", phone: "+92 300 1234567", isDefault: false },
];

// Phase 1: sample data. Phase 2 adds an Address model tied to the user account.
export default function AddressesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold">Address Book</h1>
        <button className="inline-flex items-center gap-2 rounded-full bg-ash px-5 py-2.5 text-sm font-medium text-white">
          <Plus size={15} /> Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SAMPLE_ADDRESSES.map((a) => (
          <div key={a.label} className="rounded-2xl border border-ash/10 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">{a.label}</span>
              {a.isDefault && (
                <span className="text-xs rounded-full bg-cloud px-2.5 py-0.5 text-ash/60">Default</span>
              )}
            </div>
            <p className="text-sm">{a.name}</p>
            <p className="text-sm text-ash/60">{a.line}</p>
            <p className="text-sm text-ash/60">{a.city}</p>
            <p className="text-sm text-ash/60 mb-4">{a.phone}</p>
            <div className="flex items-center gap-4 text-ash/50">
              <button className="flex items-center gap-1.5 text-xs hover:text-ash">
                <Pencil size={13} /> Edit
              </button>
              <button className="flex items-center gap-1.5 text-xs hover:text-red-600">
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
