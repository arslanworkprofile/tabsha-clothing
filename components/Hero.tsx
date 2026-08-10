"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Hero({ heroImage }: { heroImage?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink text-paper grain">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-20 pb-16 md:pt-28 md:pb-24 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-widest2 uppercase text-paper/50 mb-6"
          >
            Autumn / Winter — Studio Edit
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold tracking-tightest leading-[0.92] text-[15vw] sm:text-[10vw] lg:text-[4.6vw]"
          >
            Cut for how
            <br />
            you actually
            <br />
            move.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 max-w-md text-sm md:text-base text-paper/60 leading-relaxed"
          >
            Considered fabrics, precise tailoring, no seasonal noise. Every piece in the
            studio edit is built to outlast the trend it arrived in.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-paper px-8 py-3.5 text-sm font-medium text-ink hover:bg-cloud transition-colors"
            >
              Shop the Collection
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/shop?sort=newest"
              className="rounded-full border border-paper/30 px-8 py-3.5 text-sm font-medium hover:border-paper/70 transition-colors"
            >
              New Arrivals
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lift bg-gradient-to-br from-ash-light via-ash to-ink">
            {heroImage ? (
              <Image src={heroImage} alt="" fill priority className="object-cover" sizes="(min-width: 1024px) 40vw, 90vw" />
            ) : (
              <>
                <div className="absolute inset-0 grain opacity-60" />
                <div className="absolute inset-0 flex items-end p-8">
                  <div className="stitch w-full text-paper/70" />
                </div>
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -left-6 bottom-8 hidden sm:flex items-center gap-3 rounded-2xl bg-paper text-ink px-4 py-3 shadow-lift"
          >
            <div className="h-11 w-9 rounded-lg bg-cloud shrink-0" />
            <div>
              <p className="text-xs font-medium leading-tight">Structured Wool Overcoat</p>
              <p className="text-xs text-ash/50 mt-0.5">From PKR 15,900</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="stitch text-paper/20 mx-5 md:mx-8" />

      <div className="overflow-hidden py-4">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, dupe) => (
            <div key={dupe} className="flex shrink-0">
              {["Men", "Women", "Accessories", "New Arrivals", "Best Sellers"].map((label) => (
                <span key={label + dupe} className="mx-6 text-sm tracking-widest2 uppercase text-paper/40">
                  {label} &middot;
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
