import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
      <div className="font-display text-7xl text-brand-teal">404</div>
      <h1 className="mt-3 font-display text-3xl text-brand-navy">Page not found</h1>
      <p className="mt-2 text-brand-charcoal/70">The page you're after doesn't exist here.</p>
      <Link
        to="/"
        className="btn-shine btn-lift mt-6 inline-block rounded-full bg-brand-teal px-6 py-3 text-sm font-bold uppercase tracking-widest text-white"
      >
        Home
      </Link>
    </section>
  );
}
