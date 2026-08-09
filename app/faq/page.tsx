const FAQS = [
  { q: "How long does delivery take?", a: "Standard delivery within Pakistan takes 3–5 business days. Express options are shown at checkout where available." },
  { q: "Can I return an item?", a: "Yes — unworn items with tags attached can be returned within 14 days of delivery. See our Returns page for the full policy." },
  { q: "Do you ship internationally?", a: "Not yet — international shipping is on our roadmap. Sign up to our newsletter for updates." },
  { q: "How do I know my size?", a: "Each product page includes a size guide link; if you're between sizes, our support team is happy to advise before you order." },
  { q: "What payment methods do you accept?", a: "Cash on Delivery is available now. Card and wallet payments (Stripe, EasyPaisa, JazzCash) are coming soon." },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-16">
      <p className="text-xs tracking-widest2 uppercase text-ash/40 mb-3">Support</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tightest mb-8">
        Frequently Asked Questions
      </h1>
      <div className="divide-y divide-ash/10">
        {FAQS.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between text-sm md:text-base font-medium">
              {f.q}
              <span className="ml-4 text-ash/40 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-sm text-ash/60 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
