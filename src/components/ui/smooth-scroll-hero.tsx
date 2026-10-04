"use client";
// Adapted from website_components/comp4.md: scroll-driven framing without locking native scroll.
import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
export function ScrollPhoto({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const clip = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["inset(0 5% 0 5%)", "inset(0 0% 0 0%)"],
  );
  return (
    <figure ref={ref} className="scroll-photo">
      <motion.div
        className="scroll-photo-frame"
        style={reduced ? undefined : { clipPath: clip }}
      >
        <motion.div
          className="scroll-photo-image"
          style={reduced ? undefined : { scale }}
        >
          <Image src={src} alt={alt} fill sizes="100vw" />
        </motion.div>
        <div className="photo-statement">
          Find your people.
          <br />
          <em>Build your practice.</em>
        </div>
        <figcaption>{caption}</figcaption>
      </motion.div>
    </figure>
  );
}
