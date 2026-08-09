export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-16">
      <p className="text-xs tracking-widest2 uppercase text-ash/40 mb-3">Get in Touch</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tightest mb-8">Contact Us</h1>

      <form className="space-y-4 max-w-md">
        <input placeholder="Your name" className="input" />
        <input type="email" placeholder="Your email" className="input" />
        <textarea placeholder="How can we help?" rows={5} className="input" />
        <button type="button" className="rounded-full bg-ash px-8 py-3.5 text-sm font-medium text-white hover:bg-ash-dark transition-colors">
          Send Message
        </button>
      </form>

      <div className="mt-12 text-sm text-ash/60 space-y-1">
        <p>support@tabsha.com</p>
        <p>Mon–Sat, 10am–7pm PKT</p>
      </div>
    </div>
  );
}
