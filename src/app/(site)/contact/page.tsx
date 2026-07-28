import type { Metadata } from "next";
import { ContactForm } from "@/components/public-forms";

export const metadata: Metadata = {
  title: "Contact Digital Angel",
  description: "Get in touch with the Digital Angel team by email, phone or WhatsApp.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-14 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-4xl font-bold text-navy">Contact Us</h1>
        <p className="mt-3 text-slate-600">
          Questions about a publication, a purchase, or a partnership? We usually reply within 24 hours.
        </p>
        <div className="mt-8 space-y-4">
          <Item icon="✉️" label="Email" value="angelblissangel27@gmail.com" href="mailto:angelblissangel27@gmail.com" />
          <Item icon="📞" label="Phone" value="+237 640 187 577" href="tel:+237640187577" />
          <Item icon="💬" label="WhatsApp" value="+237 640 187 577" href="https://wa.me/237640187577" />
          <Item icon="👍" label="Facebook" value="Digital Angel" href="https://facebook.com" />
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-navy">Send a message</h2>
        <div className="mt-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function Item({ icon, label, value, href }: { icon: string; label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl bg-mist p-4 hover:bg-slate-100">
      <span className="text-xl">{icon}</span>
      <span>
        <span className="block text-xs uppercase tracking-widest text-slate-500">{label}</span>
        <span className="font-medium text-navy">{value}</span>
      </span>
    </a>
  );
}
