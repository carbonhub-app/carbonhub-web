"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import deviceCTA from "@/assets/images/ok.jpg"; // Adjust path if needed
import { IoIosCall } from "react-icons/io";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CTASection: React.FC = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null); // Ref for the card

  useEffect(() => {
    // Animation for the entire CTA section (optional, can be removed if not needed)
    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        // Removed direct scroll trigger from here if you want to control card animation separately
      });
    }

    // GSAP Animation for the card
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%", // When the top of the card is 85% from the top of the viewport
            end: "bottom 15%", // When the bottom of the card is 15% from the top of the viewport
            toggleActions: "play none none reverse", // Play on enter, reverse on leave
            // scrub: true, // Uncomment for a scrubbing effect
          },
        }
      );
    }
  }, []);

  return (
    <div className="pb-14 pt-10" ref={ctaRef}>
      <div className="container mx-auto px-4">
        <div
          ref={cardRef} // Added ref to the card element
          className="max-w-6xl mx-auto bg-black/70 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-[2rem] overflow-hidden px-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left Section */}
            <div className="md:w-1/2 p-8 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight text-white">
                Explore Carbon Trading Insights{" "}
                <br className="hidden md:block" /> for Your Company
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Access detailed carbon trading data and monitor{" "}
                <br className="hidden md:block" /> your company&apos;s environmental
                impact on our transparent marketplace.
              </p>{" "}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/carbon-trading"
                  className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary-dark transition duration-300 text-center block"
                >
                  View Carbon Trading
                </Link>
                <Link
                  href="/contact"
                  className="bg-gray-700 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-600 transition duration-300 text-center flex items-center justify-center gap-2"
                >
                  Contact Support <IoIosCall className="text-xl" />
                </Link>
              </div>
            </div>

            {/* Right Section */}
            <div className="md:w-1/2 p-6 flex justify-center md:justify-end">
              <Image
                src={deviceCTA}
                alt="FitFlo Dashboard"
                className="max-w-full h-auto rounded-lg shadow-xl transform translate-y-17"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
