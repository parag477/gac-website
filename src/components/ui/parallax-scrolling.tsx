"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// comp1's registered landscape layers and original depth ratios.
// The illustrative weekly-style chart travels with the mountain, behind the hiker.
export function ParallaxHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const back = useTransform(scrollYProgress, [0, 1], ["0%", "70%"]);
  const middle = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const title = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const front = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  return (
    <section
      ref={ref}
      className="parallax-hero"
      aria-labelledby="hero-title"
      data-parallax-layers
    >
      <motion.div
        className="parallax-layer parallax-back"
        data-parallax-layer="1"
        style={reduced ? undefined : { y: back }}
        aria-hidden="true"
      >
        <Image
          src="/images/parallax/back.webp"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>
      <motion.div
        className="parallax-layer parallax-middle"
        data-parallax-layer="2"
        style={reduced ? undefined : { y: middle }}
        aria-hidden="true"
      >
        <Image
          src="/images/parallax/middle.webp"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
        />
        <Image
          className="mountain-gold-chart"
          src="/images/parallax/gold-weekly.svg"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          unoptimized
        />
      </motion.div>
      <motion.div
        className="parallax-title-layer"
        data-parallax-layer="3"
        style={reduced ? undefined : { y: title }}
      >
        <p className="parallax-intro">A clearer way to see the market.</p>
        <h1 id="hero-title">
          <span>Find your gold</span>
          <em>perspective.</em>
        </h1>
      </motion.div>
      <motion.div
        className="parallax-layer parallax-front"
        data-parallax-layer="4"
        style={reduced ? undefined : { y: front }}
        aria-hidden="true"
      >
        <Image
          src="/images/parallax/front.webp"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
        />
      </motion.div>
      <div className="parallax-ground" aria-hidden="true" />
      <div className="parallax-bottom">
        <div className="parallax-description">
          <p>
            Learn the market. Build your process.
            <br />
            Grow with people who get it.
          </p>
          <span>Trading education & community, with Shubham Soni.</span>
        </div>
        <Link className="parallax-scroll" href="#approach">
          <ArrowDown size={19} />
          <span>Discover the commune</span>
        </Link>
        <Link className="button button-lime" href="#programmes">
          Find your path <ArrowUpRight size={19} />
        </Link>
      </div>
    </section>
  );
}
