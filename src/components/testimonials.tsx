"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Play, X, Quote, Film } from "lucide-react";
import { reviews, videoStories, type VideoStory } from "@/lib/content";

type Filter = "All stories" | "Written stories" | "Video stories";
export function Testimonials() {
  const [filter, setFilter] = useState<Filter>("All stories");
  const [selected, setSelected] = useState<VideoStory | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  function open(story: VideoStory) {
    setSelected(story);
    setMediaError(false);
    dialog.current?.showModal();
  }
  function close() {
    dialog.current?.close();
    setSelected(null);
  }
  function move(direction: number) {
    track.current?.scrollBy({
      left: direction * 360,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <>
      <div className="story-toolbar">
        <div className="story-filters" aria-label="Filter stories">
          {(
            ["All stories", "Written stories", "Video stories"] as Filter[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => {
                setFilter(item);
                track.current?.scrollTo({ left: 0 });
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="story-arrows">
          <button
            type="button"
            aria-label="Previous stories"
            onClick={() => move(-1)}
          >
            <ArrowLeft size={19} />
          </button>
          <button
            type="button"
            aria-label="Next stories"
            onClick={() => move(1)}
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
      <div
        className="story-track"
        ref={track}
        aria-label="Member stories"
        tabIndex={0}
      >
        {filter !== "Written stories" &&
          videoStories.map((story) => (
            <VideoCard key={story.id} story={story} onOpen={open} />
          ))}
        {filter !== "Video stories" &&
          reviews
            .slice(0, 2)
            .map((review, i) => (
              <ReviewCard key={review.name} review={review} index={i} />
            ))}
        {filter !== "Video stories" &&
          reviews
            .slice(2)
            .map((review, i) => (
              <ReviewCard key={review.name} review={review} index={i + 2} />
            ))}
      </div>
      <p className="asset-note">
        Written stories and the video are shared by members of our community.
      </p>
      <dialog
        ref={dialog}
        className="story-dialog"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        aria-labelledby="story-dialog-title"
      >
        <button
          type="button"
          className="dialog-close"
          aria-label="Close video story"
          onClick={close}
        >
          <X />
        </button>
        {selected && (
          <div className="dialog-layout">
            <div className="dialog-media">
              {selected.src && !mediaError ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  poster={selected.poster}
                  onError={() => setMediaError(true)}
                >
                  <source src={selected.src} type="video/mp4" />
                  {selected.captions && (
                    <track
                      kind="captions"
                      src={selected.captions}
                      srcLang="en"
                      label="English"
                      default
                    />
                  )}
                </video>
              ) : (
                <>
                  <Image
                    src={selected.poster}
                    alt="Member testimonial poster"
                    fill
                    sizes="(max-width: 700px) 90vw, 400px"
                  />
                  <div className="video-empty">
                    <Film size={32} />
                    <span>
                      {mediaError
                        ? "Video unavailable"
                        : "Your next story goes here"}
                    </span>
                    <small>
                      {mediaError
                        ? "Please try again later."
                        : "9:16 video placeholder"}
                    </small>
                  </div>
                </>
              )}
            </div>
            <div className="dialog-copy">
              <span className="text-label">
                {selected.placeholder ? "VIDEO PREVIEW" : "MEMBER STORY"}
              </span>
              <h2 id="story-dialog-title">{selected.title}</h2>
              <p>{selected.transcript}</p>
              {selected.placeholder && (
                <p className="asset-note">
                  This is a layout preview, not a recorded testimonial. The
                  image is a stock placeholder.
                </p>
              )}
              <button
                className="button button-dark"
                type="button"
                onClick={close}
              >
                Back to stories <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
function VideoCard({
  story,
  onOpen,
}: {
  story: VideoStory;
  onOpen: (story: VideoStory) => void;
}) {
  return (
    <button
      type="button"
      className="video-card"
      onClick={() => onOpen(story)}
      aria-label={`Watch video testimonial: ${story.title}`}
    >
      <Image
        src={story.poster}
        alt="Member sharing their Green Arc Commune experience"
        fill
        sizes="300px"
      />
      <span className="image-shade" />
      <span className="video-label">
        {story.placeholder ? "SAMPLE VIDEO LAYOUT" : "MEMBER STORY"}
      </span>
      <span className="play-circle">
        <Play size={24} fill="currentColor" />
      </span>
      <span className="video-caption">
        {story.title}
        <small>
          {story.placeholder
            ? "A space for your member voices"
            : "Watch the story"}
        </small>
      </span>
    </button>
  );
}
function ReviewCard({
  review,
  index,
}: {
  review: (typeof reviews)[number];
  index: number;
}) {
  return (
    <article className={`review-card review-${index % 3}`}>
      <Quote size={29} strokeWidth={1.2} />
      <h3>{review.theme}</h3>
      <blockquote>“{review.quote}”</blockquote>
      <div className="review-person">
        <span className="initials">{review.initials}</span>
        <span>
          <strong>{review.name}</strong>
          <small>{review.context}</small>
        </span>
      </div>
    </article>
  );
}
