import Link from "next/link";
import Image from "next/image";

export type Pub = {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  authorName?: string;
  category: string;
  price: string;
  currency: string;
  coverColor: string;
  coverImageUrl?: string;
  tocImageUrl?: string;
  spreadImageUrl?: string;
  bonuses?: string;
  buyLink: string;
  sampleLink: string;
  isFree: boolean;
};

const SIZES = {
  sm: { box: "h-44 w-32", sizes: "128px" },
  md: { box: "h-56 w-40", sizes: "160px" },
  lg: { box: "h-72 w-52", sizes: "208px" },
  xl: { box: "h-96 w-72", sizes: "288px" },
} as const;

export function BookCover({
  pub,
  className = "",
  size = "md",
}: {
  pub: Pub;
  className?: string;
  size?: keyof typeof SIZES;
}) {
  const { box, sizes } = SIZES[size];

  if (pub.coverImageUrl) {
    return (
      <div className={`relative ${box} overflow-hidden rounded-r-md shadow-lg ${className}`}>
        <Image
          src={pub.coverImageUrl}
          alt={pub.title}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`book3d flex ${box} flex-col justify-between rounded-r-md p-4 text-white ${className}`}
      style={{
        background: `linear-gradient(135deg, ${pub.coverColor} 0%, #14315a 100%)`,
        borderLeft: "6px solid rgba(201,162,39,.85)",
      }}
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-gold-light">Digital Angel</span>
      <span className="font-display text-base leading-tight">{pub.title}</span>
      <span className="text-[10px] text-slate-200">{pub.category}</span>
    </div>
  );
}

export function priceLabel(p: Pub) {
  return p.isFree || Number(p.price) === 0 ? "Free" : `${p.currency} ${Number(p.price).toFixed(2)}`;
}

export function BookCard({ pub }: { pub: Pub }) {
  return (
    <div
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_0_35px_-5px_rgba(201,162,39,0.45)]"
    >
      <div className="mb-5 flex justify-center">
        <BookCover pub={pub} size="lg" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">{pub.category}</p>
      <h3 className="mt-1 font-display text-lg font-bold text-navy">{pub.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{pub.subtitle || pub.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-navy">{priceLabel(pub)}</span>
        <Link
          href={`/publications/${pub.slug}`}
          className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-light"
        >
          View Book
        </Link>
      </div>
    </div>
  );
}