"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
}

const INITIAL: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, active: true },
  { code: "FREESHIP", type: "fixed", value: 0, active: true },
  { code: "EOSS25", type: "percent", value: 25, active: false },
];

// UI-only for now — session state resets on refresh. A Coupon model +
// checkout-side validation is the next piece to make this persist for real.
export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL);
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");

  const addCoupon = () => {
    if (!code.trim() || !value) return;
    setCoupons((c) => [{ code: code.trim().toUpperCase(), type, value: Number(value), active: true }, ...c]);
    setCode("");
    setValue("");
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-2">Coupons</h1>
      <p className="text-sm text-ash/50 mb-8">
        UI only for now — added coupons live in this page's state and reset on refresh. Checkout doesn't validate codes yet.
      </p>

      <div className="flex flex-wrap items-end gap-3 mb-8 rounded-2xl border border-ash/10 p-5">
        <div>
          <label className="text-xs font-medium mb-1.5 block">Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="input w-40" placeholder="SUMMER20" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 block">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as "percent" | "fixed")} className="input w-32">
            <option value="percent">% off</option>
            <option value="fixed">Rs off</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 block">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="input w-28" />
        </div>
        <button
          onClick={addCoupon}
          className="inline-flex items-center gap-2 rounded-full bg-ash px-5 py-2.5 text-sm font-medium text-white h-fit"
        >
          <Plus size={15} /> Add
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ash/10">
        <table className="w-full text-sm">
          <thead className="bg-cloud text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.code} className="border-t border-ash/10">
                <td className="px-4 py-3 font-medium">{c.code}</td>
                <td className="px-4 py-3 text-ash/60">{c.type === "percent" ? `${c.value}% off` : `Rs ${c.value} off`}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${c.active ? "bg-green-100 text-green-700" : "bg-cloud text-ash/50"}`}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setCoupons((cs) => cs.filter((x) => x.code !== c.code))}
                    className="text-ash/50 hover:text-red-600"
                    aria-label="Remove coupon"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
