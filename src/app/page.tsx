import { ParallaxHero } from "@/components/ui/parallax-scrolling";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Asterisk,
} from "lucide-react";
import { ScrollPhoto } from "@/components/ui/smooth-scroll-hero";
import { ElasticGallery } from "@/components/ui/elastic-gallery";
import { ProgrammePreview } from "@/components/ui/hover-preview";
import { Testimonials } from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { faqs, founder, site, team } from "@/lib/content";
import {
  homeTitle,
  homeDescription,
  pageMetadata,
  organisationGraph,
} from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
export const metadata = pageMetadata(homeTitle, homeDescription, "/");
export default function Home() {
  return (
    <main id="main">
      <StructuredData data={organisationGraph()} />
      <ParallaxHero />
      <div className="belief-strip">
        <span>Wealth in knowledge.</span>
        <Asterisk className="strip-star" aria-hidden="true" size={22} />
        <span>Wisdom in practice.</span>
        <Asterisk className="strip-star" aria-hidden="true" size={22} />
        <span>Wellness in the process.</span>
      </div>
      <section className="section approach" id="approach">
        <div className="section-intro">
          <h2>
            More information
            <br />
            isn’t always
            <br />
            <em>more clarity.</em>
          </h2>
          <div className="approach-copy">
            <p className="lead">
              Another chart. Another strategy.
              <br />
              Another voice telling you what to do.
            </p>
            <p>
              At some point, the next step isn’t learning more things. It’s
              learning how to put them together.
            </p>
            <p>
              Green Arc Commune brings gold/XAUUSD education, thoughtful
              practice and real conversations into one place. So you can build a
              process that makes sense to you.
            </p>
            <a className="text-link" href="#method">
              A different way to learn <ArrowDown size={17} />
            </a>
          </div>
        </div>
        <div className="approach-bottom">
          <span>Less noise.</span>
          <span>More perspective.</span>
          <span>Better questions.</span>
        </div>
      </section>
      <section className="founder-section" id="founder">
        <div className="founder-image">
          <Image
            src="/images/shubham-soni.jpg"
            alt="Shubham Soni sitting at his trading desk"
            fill
            sizes="(max-width: 750px) 100vw, 50vw"
          />
          <span className="image-caption">Shubham Soni · Founder</span>
        </div>
        <div className="founder-copy">
          <h2>
            A trader.
            <br />
            An educator.
            <br />
            <em>One of you.</em>
          </h2>
          <p>{founder.description}</p>
          <p>{founder.approach}</p>
          <div className="founder-signature">
            Shubham Soni<span>FOUNDER, GREEN ARC COMMUNE</span>
          </div>
          {site.youtube && (
            <a
              className="text-link"
              href={site.youtube}
              target="_blank"
              rel="noreferrer"
            >
              Learn with us on YouTube <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </section>
      <section className="section programmes" id="programmes">
        <div className="section-heading">
          <h2>
            Your next chapter.
            <br />
            <em>Your kind of learning.</em>
          </h2>
          <p>
            Find your way to move forward.
            <br />
            Choose the support that meets you where you are.
          </p>
        </div>
        <ProgrammePreview />
        <div className="programme-help">
          <p>Not sure where to begin? That’s a good place to start.</p>
          <Link className="text-link" href="#contact">
            Let’s find your fit <ArrowUpRight size={18} />
          </Link>
          <Link className="text-link" href="/programmes">
            Compare the learning formats <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section commune" id="commune">
        <div className="section-heading">
          <h2>
            There’s a reason
            <br />
            we call it a <em>commune.</em>
          </h2>
          <div>
            <p>
              The questions are better when you can ask them out loud. The work
              feels different when you don’t do it alone.
            </p>
            <a
              className="text-link"
              href={site.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Meet the community <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <ElasticGallery />
        <div className="community-note">
          <div className="community-avatars">
            {team.slice(0, 3).map((p) => (
              <Image
                key={p.name}
                src={p.image}
                width={44}
                height={44}
                alt={p.name}
              />
            ))}
          </div>
          <p>
            A place for shared perspective.
            <br />
            <strong>And people who keep showing up.</strong>
          </p>
          <span>LEARN · PRACTISE · REFLECT</span>
        </div>
      </section>
      <section className="section method" id="method">
        <div className="section-heading">
          <h2>
            Good habits.
            <br />
            <em>Built together.</em>
          </h2>
          <p>Progress has a rhythm. We make room for every part of it.</p>
        </div>
        <div className="method-steps">
          {[
            [
              "01",
              "Understand.",
              "Build the foundations.",
              "Learn to read market context, question an idea and understand the reasoning behind a decision.",
            ],
            [
              "02",
              "Practise.",
              "Bring the idea to life.",
              "Connect what you learn with live-market observation, structured frameworks and thoughtful preparation.",
            ],
            [
              "03",
              "Reflect.",
              "Return a little clearer.",
              "Review your decisions, notice your habits and keep refining your process with guidance and perspective.",
            ],
          ].map(([n, title, sub, text]) => (
            <article className="method-step" key={n}>
              <span className="step-number">{n}</span>
              <h3>{title}</h3>
              <strong>{sub}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <ScrollPhoto
        src="/images/commune-group.jpeg"
        alt="Seven people standing together outdoors"
        caption="A moment together · Green Arc Commune"
      />
      <section className="section stories" id="stories">
        <div className="section-heading">
          <h2>
            Different journeys.
            <br />
            <em>A shared feeling.</em>
          </h2>
          <p>
            The little shifts matter.
            <br />
            Hear what learning here has meant to our members.
          </p>
        </div>
        <Testimonials />
      </section>
      <section className="section team-section" id="team">
        <div className="section-heading">
          <h2>
            Real people.
            <br />
            <em>In your corner.</em>
          </h2>
          <p>The people teaching, creating and keeping the commune moving.</p>
        </div>
        <div className="team-track" tabIndex={0} aria-label="Meet the team">
          {team.map((person) => (
            <article className="team-person" key={person.name}>
              <div className="team-photo">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="(max-width: 750px) 65vw, 240px"
                />
              </div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section faq-section" id="faq">
        <div>
          <h2>
            A little clarity
            <br />
            <em>before you begin.</em>
          </h2>
          <p>
            Have something else in mind?
            <br />
            <Link href="#contact" className="text-link">
              We’re here to talk <ArrowUpRight size={17} />
            </Link>
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <Plus size={20} />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="section contact-section" id="contact">
        <div className="contact-intro">
          <h2>
            Every journey
            <br />
            starts with
            <br />
            <em>a conversation.</em>
          </h2>
          <p>
            Tell us where you are. We’ll help you understand what comes next.
          </p>
          <a href={`mailto:${site.email}`} className="text-link">
            {site.email} <ArrowUpRight size={17} />
          </a>
        </div>
        <ContactForm />
      </section>
      <div className="closing-line">
        <span>Stay curious. Stay considered.</span>
        <ArrowRight size={23} />
        <span>Keep growing.</span>
      </div>
    </main>
  );
}
