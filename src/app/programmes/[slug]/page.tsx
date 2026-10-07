import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import {
  programmes,
  site,
  strategyOffer,
  teachingLanguage,
  programmeEnrolmentNote,
} from "@/lib/content";
import {
  pageMetadata,
  organisationId,
  organisationGraph,
  breadcrumbGraph,
  webPageGraph,
} from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";

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
  if (!p || p.kind !== "page")
    return { robots: { index: false, follow: true } };
  return pageMetadata(
    "Gold Trading Strategy Master Program",
    "Explore gold-market context, strategy reasoning and risk planning with Shubham Soni. See programme details and contact the team on WhatsApp.",
    `/programmes/${slug}`,
  );
}
export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = programmes.find((p) => p.slug === slug);
  if (!p) notFound();
  if (p.kind === "enquiry") redirect(`/?programme=${p.slug}#contact`);
  if (p.kind === "coming-soon") redirect("/#programmes");
  return (
    <main id="main">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            ...organisationGraph()["@graph"],
            {
              ...webPageGraph(`/programmes/${p.slug}`, p.title, p.description),
              mainEntity: {
                "@id": `${site.url}/programmes/${p.slug}#curriculum`,
              },
            },
            {
              "@type": "Course",
              "@id": `${site.url}/programmes/${p.slug}#curriculum`,
              name: p.title,
              description: p.description,
              url: `${site.url}/programmes/${p.slug}`,
              provider: {
                "@type": "EducationalOrganization",
                "@id": organisationId,
                name: site.name,
                url: `${site.url}/`,
              },
              teaches: p.features,
              inLanguage: "hi",
              offers: {
                "@type": "Offer",
                url: `${site.url}/programmes/${p.slug}#offer`,
                price: strategyOffer.price,
                priceCurrency: strategyOffer.currency,
                name: "Strategy Master webinar subscriber offer",
                description: strategyOffer.description,
              },
            },
            breadcrumbGraph([
              { name: "Home", path: "/" },
              { name: "Programmes", path: "/programmes" },
              { name: p.title, path: `/programmes/${p.slug}` },
            ]),
          ],
        }}
      />
      <section className="detail-hero section">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Programmes", path: "/programmes" },
            { name: p.title, path: `/programmes/${p.slug}` },
          ]}
        />
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
      <section className="section programme-detail" id="curriculum">
        <div>
          <h2>
            A little structure.
            <br />
            <em>A clearer direction.</em>
          </h2>
          <p>{p.fit}</p>
          <p>{p.outcome}</p>
          <p>
            Teaching language: <strong>{teachingLanguage}</strong>.
          </p>
          <div id="offer">
            <h3>₹3,999 webinar offer</h3>
            <p>{strategyOffer.description}</p>
          </div>
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
          <p className="detail-note">{programmeEnrolmentNote}</p>
          <Link className="text-link" href="/about/shubham-soni">
            About Shubham Soni <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
