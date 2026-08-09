const SAMPLE_REVIEWS = [
  { product: "Structured Wool Overcoat", customer: "Amina R.", rating: 5, text: "Fits exactly like the size guide promised.", status: "Published" },
  { product: "Ash Grey Oversized Tee", customer: "Hassan K.", rating: 5, text: "Ordered it in three colors after the first one.", status: "Published" },
  { product: "Draped Satin Midi Dress", customer: "Sara M.", rating: 4, text: "Beautiful drape, runs slightly large.", status: "Pending" },
  { product: "Banarasi Silk Saree", customer: "Zainab R.", rating: 5, text: "The zari work is stunning in person.", status: "Pending" },
];

const STATUS_STYLES: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

// Sample data — a Review model tied to products/orders (plus a moderation
// queue) is the next backend piece to build.
export default function AdminReviewsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-2">Reviews</h1>
      <p className="text-sm text-ash/50 mb-8">
        Sample data — the product pages don't collect real reviews yet, so there's nothing to moderate here yet.
      </p>

      <div className="space-y-4">
        {SAMPLE_REVIEWS.map((r, i) => (
          <div key={i} className="rounded-2xl border border-ash/10 p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold">{r.product}</p>
                <p className="text-xs text-ash/50">{r.customer} · {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[r.status]}`}>{r.status}</span>
            </div>
            <p className="text-sm text-ash/70">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
