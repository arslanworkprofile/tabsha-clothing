export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-16">
      <p className="text-xs tracking-widest2 uppercase text-ash/40 mb-3">Support</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tightest mb-8">Returns & Exchanges</h1>
      <div className="space-y-5 text-sm text-ash/70 leading-relaxed">
        <p>Unworn items with original tags can be returned within 14 days of delivery for a refund or exchange.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Items must be unworn, unwashed, and in original packaging.</li>
          <li>Sale items and made-to-order sarees are final sale unless faulty.</li>
          <li>Refunds are issued to the original payment method within 5–7 business days of us receiving the return.</li>
        </ul>
      </div>
    </div>
  );
}
