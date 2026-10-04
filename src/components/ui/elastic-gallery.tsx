"use client";
// Adapted from website_components/comp2.md. Buttons add keyboard semantics and touch support.
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
const scenes = [
  {
    title: "Prepare together",
    text: "Context before conviction. Start with a considered view of the market.",
    image: "/images/workspace.jpg",
  },
  {
    title: "Connect the dots",
    text: "See how a framework becomes a decision. Ask the question you’ve been sitting with.",
    image: "/images/learning.jpg",
  },
  {
    title: "Keep good company",
    text: "Find people who understand the work. Exchange ideas, review and return a little clearer.",
    image: "/images/community.jpg",
  },
];
export function ElasticGallery() {
  const [active, setActive] = useState(1);
  return (
    <>
      <div className="elastic-gallery">
        {scenes.map((scene, i) => (
          <button
            type="button"
            key={scene.title}
            className={`elastic-panel ${active === i ? "is-active" : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-expanded={active === i}
            aria-label={scene.title}
          >
            <Image
              src={scene.image}
              alt="Illustrative stock photography of a shared learning environment"
              fill
              sizes="(max-width: 700px) 100vw, 60vw"
            />
            <span className="image-shade" />
            <span className="gallery-index">
              {String(i + 1).padStart(2, "0")} / A DAY IN THE COMMUNE
            </span>
            <span className="gallery-title">{scene.title}</span>
            <span className="gallery-copy">{scene.text}</span>
            <span className="gallery-arrow">
              <ArrowUpRight size={24} />
            </span>
          </button>
        ))}
      </div>
      <p className="asset-note">
        A glimpse of the experience. Stock imagery shown for now.
      </p>
    </>
  );
}
