"use client";

import React from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import Image from "next/image";
import Marquee from "react-fast-marquee";

// Import logo images
import logo1 from "../../../public/logos/logo-1.png";
import logo2 from "../../../public/logos/logo-2.png";
import logo3 from "../../../public/logos/logo-3.png";
import logo4 from "../../../public/logos/logo-4.png";
import logo5 from "../../../public/logos/logo-5.png";
import logo6 from "../../../public/logos/logo-6.png";
import logo7 from "../../../public/logos/logo-7.png";
import logo8 from "../../../public/logos/logo-8.png";
import logo9 from "../../../public/logos/logo-9.png";
import logo10 from "../../../public/logos/logo-10.png";

// Define logo sources with imported images
const logos = [
  { src: logo1, alt: "Logo 1" },
  { src: logo2, alt: "Logo 2" },
  { src: logo3, alt: "Logo 3" },
  { src: logo4, alt: "Logo 4" },
  { src: logo5, alt: "Logo 5" },
  { src: logo6, alt: "Logo 6" },
  { src: logo7, alt: "Logo 7" },
  { src: logo8, alt: "Logo 8" },
  { src: logo9, alt: "Logo 9" },
  { src: logo10, alt: "Logo 10" },
];

export default function MarqueeSection() {
  const mounted = useHydrated();

  // Both themes resolved to the same fully transparent gradient, so the colour
  // scheme listener that fed this was doing nothing.
  const gradientColor = "rgba(6, 9, 20, 0)";

  return (
    <section className="relative w-full py-12 bg-transparent dark:bg-transparent overflow-hidden">
      {/* Title Container */}
      <div className="container mx-auto px-4 text-center mb-8">
        <h2 className="text-xl font-normal text-white dark:text-white">
          Join the companies that track smarter.
        </h2>
      </div>

      {/* Full Width Marquee Container with No Container Constraints */}
      <div
        className={`relative w-full transition-opacity duration-1000 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Marquee Component - Full width with no container constraints */}
        <div className="py-8 flex w-full">
          <Marquee
            gradient={true}
            gradientColor={gradientColor}
            speed={15}
            pauseOnHover={true}
            direction="left"
            className="overflow-visible"
          >
            {logos.map((logo, i) => (
              <div
                key={`logo-${i}`}
                className="mx-11 flex items-center justify-center"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={96}
                  unoptimized
                  priority
                  className="object-contain hover:scale-105 transition-transform duration-300 brightness-0 invert"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
