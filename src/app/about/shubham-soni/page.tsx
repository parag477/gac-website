import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { founder, learningMethod, site } from "@/lib/content";
import {
  breadcrumbGraph,
  founderId,
  organisationGraph,
  pageMetadata,
  webPageGraph,
  sitePublishedDate,
  siteModifiedDate,
} from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";

const description =
  "Meet Shubham Soni, founder of Green Arc Commune, trader and educator with 7+ years of trading experience and a focus on gold trading education.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Shubham Soni", path: "/about/shubham-soni" },
];
export const metadata = pageMetadata(
  "Shubham Soni — Founder & Trading Educator",
  description,
  "/about/shubham-soni",
);

export default function FounderPage() {
  return (
    <main id="main" className="section information-page">
      <StructuredData
        data={{
          ...organisationGraph(),
          "@graph": [
            ...organisationGraph()["@graph"],
            {
              ...webPageGraph(
                "/about/shubham-soni",
                "Shubham Soni",
                description,
                {
                  datePublished: sitePublishedDate,
                  dateModified: siteModifiedDate,
                },
              ),
              "@type": "ProfilePage",
              mainEntity: { "@id": founderId },
            },
            breadcrumbGraph(crumbs),
          ],
        }}
      />
      <Breadcrumbs items={crumbs} />
      <div className="founder-profile">
        <header className="information-heading">
          <h1>
            Shubham Soni.
            <br />
            <em>A considered approach.</em>
          </h1>
          <p className="lead">Founder. Trader. Educator.</p>
          <p>{founder.description}</p>
          <p>{founder.approach}</p>
          <a
            className="text-link"
            href={site.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn with Shubham on YouTube <ArrowUpRight size={17} />
          </a>
        </header>
        <div className="profile-photo">
          <Image
            src="/images/shubham-soni.jpg"
            alt="Shubham Soni at his trading desk"
            fill
            sizes="(max-width: 750px) 100vw, 36vw"
            loading="eager"
          />
        </div>
      </div>
      <section className="information-note">
        <h2>The work behind a decision</h2>
        <p>
          Green Arc Commune’s teaching approach makes room for understanding,
          practice and reflection. The aim is to help learners ask better
          questions about market context, preparation and risk, and to review
          their own decisions.
        </p>
        {learningMethod.map((step) => (
          <div key={step.title}>
            <h3>{step.title}.</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </section>
      <section className="information-note">
        <h2>Find the right kind of guidance</h2>
        <p>
          Live Mentorship Program, Individual Mentorship Program and Strategy
          Master Program offer different learning formats. Ask the team about
          the current arrangements and mentor involvement before choosing a
          programme.
        </p>
        <p>
          Trading involves risk. Experience, educational examples and
          testimonials do not guarantee a particular outcome.
        </p>
        <Link href="/programmes" className="text-link">
          Compare the programmes <ArrowUpRight size={17} />
        </Link>
      </section>
      <p className="information-related">
        <Link href="/#team">Meet the current team</Link> ·{" "}
        <Link href="/stories/member-story">Hear a member’s perspective</Link>
      </p>
    </main>
  );
}
