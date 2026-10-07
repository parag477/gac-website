import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { programmes, programmeEnrolmentNote, teachingLanguage, site } from "@/lib/content";
import {
  breadcrumbGraph,
  organisationGraph,
  pageMetadata,
  webPageGraph,
  sitePublishedDate,
  siteModifiedDate,
} from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";

const title = "Compare Gold Trading Mentorship Programmes";
const description =
  "Compare live mentorship, individual guidance and the Strategy Master Program at Green Arc Commune. Choose the learning format that fits your questions.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Programmes", path: "/programmes" },
];
export const metadata = pageMetadata(title, description, "/programmes");

export default function ProgrammesPage() {
  return (
    <main id="main" className="section information-page">
      <StructuredData
        data={{
          ...organisationGraph(),
          "@graph": [
            ...organisationGraph()["@graph"],
            webPageGraph("/programmes", title, description, {
              datePublished: sitePublishedDate,
              dateModified: siteModifiedDate,
            }),
            breadcrumbGraph(crumbs),
          ],
        }}
      />
      <Breadcrumbs items={crumbs} />
      <header className="information-heading">
        <h1>
          Choose how
          <br />
          <em>you learn.</em>
        </h1>
        <p className="lead">
          Three ways to learn, with different kinds of support. Compare the
          approach before choosing your next step. Teaching is in {teachingLanguage}.
        </p>
        <p>
          Green Arc Commune’s programmes focus on trading education, with
          gold/XAUUSD at the centre of the learning approach. Live mentorship
          brings you alongside the process; individual mentorship gives your own
          questions more space; Strategy Master focuses on understanding a
          strategy.
        </p>
      </header>
      <div className="programme-comparison">
        {programmes.map((p) => (
          <section id={p.slug} className="comparison-row" key={p.slug}>
            <div>
              <h2>{p.title}</h2>
              <p>{p.fit}</p>
              {p.kind === "coming-soon" && (
                <span className="coming-soon">Coming soon</span>
              )}
            </div>
            <div>
              <p>{p.description}</p>
              {p.features.length > 0 && (
                <ul>
                  {p.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              )}
              <p>{p.outcome}</p>
              {p.kind !== "coming-soon" && (
                <Link
                  className="text-link"
                  data-programme={p.slug}
                  href={
                    p.kind === "page"
                      ? `/programmes/${p.slug}`
                      : `/?programme=${p.slug}#contact`
                  }
                >
                  {p.kind === "page"
                    ? "Explore Strategy Master"
                    : `Enquire about ${p.title}`}{" "}
                  <ArrowUpRight size={17} />
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>
      <section className="information-note">
        <h2>Before you join</h2>
        <p>{programmeEnrolmentNote}</p>
        <p>
          Share your current experience, what you want to understand and the
          kind of guidance you are looking for. The team can then explain the
          available options without assuming a programme is right for you.
        </p>
        <Link className="text-link" href="/#contact">
          Ask the team <ArrowUpRight size={17} />
        </Link>
      </section>
      <p className="information-related">
        <Link href="/about/shubham-soni">Meet Shubham Soni</Link> ·{" "}
        <Link href="/stories/member-story">Hear a member’s experience</Link> ·{" "}
        <a href={site.youtube}>Explore our YouTube channel</a>
      </p>
    </main>
  );
}
