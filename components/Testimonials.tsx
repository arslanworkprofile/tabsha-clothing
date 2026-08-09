const REVIEWS = [
  {
    name: "Amina R.",
    role: "Overcoat, size M",
    quote: "The overcoat fits exactly like the size guide promised. Fabric feels genuinely premium.",
  },
  {
    name: "Hassan K.",
    role: "Oversized Tee, repeat customer",
    quote: "Ordered the tee in three colors after the first one. Consistent quality every time.",
  },
  {
    name: "Sara M.",
    role: "Satin Midi Dress",
    quote: "Packaging alone felt like a luxury unboxing. The dress is even better in person.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 border-t border-ash/10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-16">
          <div>
            <p className="text-xs tracking-widest2 uppercase text-ash/40 mb-3">Word of Mouth</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tightest leading-tight">
              Trusted by people who keep what they buy.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {REVIEWS.map((r, i) => (
              <div key={r.name} className={i === 0 ? "sm:col-span-2" : ""}>
                <span className="font-heading text-4xl text-ash/15 leading-none block mb-2">&ldquo;</span>
                <p className="text-sm md:text-base text-ash/80 leading-relaxed max-w-lg">{r.quote}</p>
                <div className="stitch text-ash/20 my-4 max-w-[120px]" />
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-ash/40">{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
