"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { programmes } from "@/lib/content";
export function ProgrammePreview() {
  const [active, setActive] = useState(0);
  function choose(slug: string) {
    window.dispatchEvent(
      new CustomEvent("programme-selected", { detail: slug }),
    );
  }
  return (
    <div className="programme-layout">
      <div className="programme-list">
        {programmes.map((p, i) => {
          const content = (
            <>
              <span className="programme-number">0{i + 1}</span>
              <span>
                <span className="programme-format">{p.format}</span>
                <h3>{p.title}</h3>
                <span className="programme-fit">{p.fit}</span>
                {p.kind === "coming-soon" && (
                  <span className="coming-soon">Coming soon</span>
                )}
              </span>
              {p.kind !== "coming-soon" && <ArrowUpRight />}
            </>
          );
          const className = `programme-row ${active === i ? "is-active" : ""}`;
          return p.kind === "coming-soon" ? (
            <div key={p.slug} className={`${className} programme-unavailable`}>
              {content}
            </div>
          ) : (
            <Link
              key={p.slug}
              className={className}
              href={
                p.kind === "page"
                  ? `/programmes/${p.slug}`
                  : `/?programme=${p.slug}#contact`
              }
              onClick={(event) => {
                if (
                  p.kind === "enquiry" &&
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.shiftKey &&
                  !event.altKey
                ) {
                  event.preventDefault();
                  choose(p.slug);
                  window.history.replaceState(
                    null,
                    "",
                    `?programme=${p.slug}#contact`,
                  );
                  document.getElementById("contact")?.scrollIntoView({
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "instant"
                      : "smooth",
                    block: "start",
                  });
                }
              }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              {content}
            </Link>
          );
        })}
      </div>
      <div className="programme-preview">
        {programmes.map((p, i) => (
          <Image
            key={p.slug}
            src={p.image}
            alt={
              p.slug === "individual-mentorship"
                ? "Shubham Soni, founder and educator"
                : "Illustrative learning workspace"
            }
            fill
            sizes="(max-width: 850px) 0px, 38vw"
            className={i === active ? "visible" : ""}
          />
        ))}
        <span className="preview-caption">{programmes[active].rhythm}</span>
      </div>
    </div>
  );
}
