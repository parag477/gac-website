import Link from "next/link";
import { videoStories } from "@/lib/content";
import {
  breadcrumbGraph,
  organisationGraph,
  pageMetadata,
  videoObjectGraph,
  webPageGraph,
  sitePublishedDate,
  siteModifiedDate,
} from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";

const story = videoStories[0];
const description =
  "Watch a member share their experience of Green Arc Commune in an original video testimonial. Explore the community and compare learning programmes.";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Member story", path: "/stories/member-story" },
];
export const metadata = pageMetadata(
  "A Member's Perspective — Video Testimonial",
  description,
  "/stories/member-story",
);

export default function MemberStoryPage() {
  return (
    <main id="main" className="section information-page">
      <StructuredData
        data={{
          ...organisationGraph(),
          "@graph": [
            ...organisationGraph()["@graph"],
            webPageGraph("/stories/member-story", story.title, description, {
              datePublished: sitePublishedDate,
              dateModified: siteModifiedDate,
            }),
            breadcrumbGraph(crumbs),
            videoObjectGraph({
              name: "Green Arc Commune Member Testimonial",
              description:
                "A member shares their experience learning with Green Arc Commune and Shubham Soni in this original video testimonial.",
              thumbnailUrl: story.poster,
              ...(story.src ? { contentUrl: story.src } : {}),
            }),
          ],
        }}
      />
      <Breadcrumbs items={crumbs} />
      <header className="information-heading">
        <h1>
          A member’s
          <br />
          <em>perspective.</em>
        </h1>
        <p className="lead">
          Hear a member describe their experience in their own words.
        </p>
      </header>
      <div className="member-watch">
        <video
          id="member-video"
          controls
          playsInline
          preload="none"
          poster={story.poster}
          aria-label="Green Arc Commune member testimonial"
        >
          {story.src && <source src={story.src} type="video/mp4" />}
          {story.captions && (
            <track
              kind="captions"
              src={story.captions}
              srcLang="en"
              label="English"
            />
          )}
          {story.src && <a href={story.src}>Open the member video</a>}
        </video>
        <div>
          <h2>
            One experience.
            <br />A shared community.
          </h2>
          <p>
            This original recording was provided to Green Arc Commune as a
            member testimonial. It shares one person’s experience of learning
            with the community.
          </p>
          <p>
            Individual experiences vary. A testimonial is not a guarantee of
            trading performance or future results.
          </p>
          <p>
            <Link className="text-link" href="/#stories">
              Read more member stories
            </Link>
          </p>
          <p>
            <Link className="text-link" href="/programmes">
              Compare learning programmes
            </Link>
          </p>
          <p>
            <Link className="text-link" href="/#contact">
              Ask about learning with us
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
