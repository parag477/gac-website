import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { programmes } from "@/lib/content";

export function generateStaticParams() {
  return programmes
    .filter((p) => p.kind === "page")
    .map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = programmes.find((p) => p.slug === slug);
  return {
    title: p?.title || "Programme not found",
    description: p?.description,
    alternates: { canonical: `/programmes/${slug}` },
  };
}
export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const legacy: Record<string, string> = {
    "live-room": "/?programme=live-mentorship#contact",
    mastery: "/programmes/strategy-master",
    individual: "/?programme=individual-mentorship#contact",
  };
  if (legacy[slug]) redirect(legacy[slug]);
  const p = programmes.find((p) => p.slug === slug);
  if (!p) notFound();
  if (p.kind === "enquiry") redirect(`/?programme=${p.slug}#contact`);
  if (p.kind === "coming-soon") redirect("/#programmes");
  return (
    <main id="main">
      <section className="detail-hero section">
        <Link className="text-link" href="/#programmes">
          <ArrowLeft size={17} /> All programmes
        </Link>
        <div className="detail-hero-grid">
          <div>
            <h1>
              Learn strategy
              <br />
              <em>directly.</em>
            </h1>
            <p className="lead">{p.description}</p>
            <a
              href="https://wa.me/919753574157?text=Hi%20Green%20Arc%20Commune%2C%20I%E2%80%99m%20interested%20in%20the%20Strategy%20Master%20Program."
              target="_blank"
              rel="noopener noreferrer"
              className="button button-lime"
            >
              Enquire about {p.title}
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="detail-image strategy-offer-card">
            <Image
              src={p.detailImage}
              alt="Strategy Master programme offer"
              fill
              sizes="(max-width: 750px) 100vw, 45vw"
              loading="eager"
            />
          </div>
        </div>
      </section>
      <section className="section programme-detail">
        <div>
          <h2>
            A little structure.
            <br />
            <em>A clearer direction.</em>
          </h2>
          <p>{p.fit}</p>
          <p>{p.outcome}</p>
        </div>
        <div>
          <h3>What we’ll work on</h3>
          <ul>
            {p.features.map((f) => (
              <li key={f}>
                <Check size={19} />
                {f}
              </li>
            ))}
          </ul>
          <p className="detail-note">
            Ask us for current fees, availability, duration and access details
            before enrolling. Learning supports your process; trading outcomes
            are never guaranteed.
          </p>
        </div>
      </section>
    </main>
  );
}
