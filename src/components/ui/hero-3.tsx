"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref?: string;
  images: string[];
  className?: string;
}

const ActionButton = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) => (
  <motion.a
    href={href || "#"}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="mt-8 inline-block rounded-full bg-gold px-8 py-3 font-semibold text-navy shadow-lg transition-colors hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-75"
  >
    {children}
  </motion.a>
);

const FADE_IN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 22 } },
};

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  ctaHref,
  images,
  className,
}) => {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-navy px-4 py-20 text-center lg:py-28",
        className
      )}
    >
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-gold-light backdrop-blur-sm"
        >
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl font-bold leading-tight text-white md:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-xl text-lg text-slate-300"
        >
          {description}
        </motion.p>

        <motion.div initial="hidden" animate="show" variants={FADE_IN_ANIMATION_VARIANTS} transition={{ delay: 0.3 }}>
          <ActionButton href={ctaHref}>{ctaText}</ActionButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto mt-16 flex max-w-5xl flex-wrap items-end justify-center gap-6 md:gap-8"
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="relative aspect-[3/4] w-40 flex-shrink-0 overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 sm:w-48 md:w-56 lg:w-64"
          >
            <img
              src={src}
              alt={`Digital Angel publication ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
};