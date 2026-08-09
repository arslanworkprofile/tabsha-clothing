export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-16">
      <p className="text-xs tracking-widest2 uppercase text-ash/40 mb-3">Support</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tightest mb-8">Shipping Information</h1>
      <div className="space-y-5 text-sm text-ash/70 leading-relaxed">
        <p>Standard delivery within Pakistan takes 3–5 business days. Orders are processed within 24 hours on business days.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Free standard shipping on orders over PKR 5,000.</li>
          <li>Cash on Delivery available nationwide.</li>
          <li>Tracking details are sent by SMS/email once your order ships.</li>
        </ul>
      </div>
    </div>
  );
}
