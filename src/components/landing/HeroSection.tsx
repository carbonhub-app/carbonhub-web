"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import trackingIcon from "@/assets/icons/tracking.png";
import rewardIcon from "@/assets/icons/reward.png";
import tradeIcon from "@/assets/icons/trade.png";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/utils/animations";
import heroImage from "@/assets/images/hero-image.png";
import { FiArrowRight } from "react-icons/fi";
import { Typewriter } from "@/components/ui/typewriter-text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const featureItemsRef = useRef<HTMLDivElement[]>([]);
  const heroImageRef = useRef<HTMLDivElement>(null);

  // Add to featureItemsRef function
  const addToFeatureRefs = (el: HTMLDivElement) => {
    if (el && !featureItemsRef.current.includes(el)) {
      featureItemsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Initial overall fade in animation
    if (heroRef.current) {
      fadeIn(heroRef.current, 1, 0.2);
    }

    // Badge animation
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay: 0.3,
          ease: "back.out(1.7)",
        }
      );
    }

    // Header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" }
      );
    }

    // Description animation
    if (descriptionRef.current) {
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: "power2.out" }
      );
    }

    // Buttons animation
    if (buttonsRef.current) {
      gsap.fromTo(
        buttonsRef.current.children,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: 1,
          stagger: 0.15,
          ease: "back.out(1.4)",
        }
      );
    }

    // Define heroImageContent once here to be accessible
    const heroImageElement = heroImageRef.current;
    const heroImageContent = heroImageElement?.querySelector("img");

    // Set initial state for hero image with less extreme values
    if (heroImageContent) {
      gsap.set(heroImageContent, {
        scale: 0.95,
        transformOrigin: "center bottom",
        filter: "blur(4px)",
        opacity: 0.3,
        y: 30,
      });
    }

    // Hero image animation with independent timing and fallback
    const animateHeroImage = () => {
      if (heroImageContent) {
        gsap.to(heroImageContent, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.0,
          delay: 0.1,
          ease: "power3.out",
        });
      }
    };

    // Features animation with independent hero image trigger
    if (featureItemsRef.current.length) {
      gsap.fromTo(
        featureItemsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        }
      );
    }

    // Independent hero image animation with fallback timer
    const heroImageTimer = setTimeout(() => {
      animateHeroImage();
    }, 1200);

    // Fallback timer to ensure hero image shows even if animations fail
    const fallbackTimer = setTimeout(() => {
      if (heroImageContent) {
        gsap.set(heroImageContent, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });
      }
    }, 3000);

    // Cleanup timers
    return () => {
      clearTimeout(heroImageTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative z-0 overflow-hidden mt-16 py-20 px-4 sm:px-6 md:px-8"
    >
      <Image
        src="/bg-hero.webp"
        alt="Hero background"
        fill
        priority
        quality={100}
        className="object-cover -z-10"
        onError={() => {
          console.warn("Hero background image failed to load");
        }}
      />
      <div className="relative z-0 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div
              ref={badgeRef}
              className="mb-6 inline-flex items-center space-x-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-lg px-4 py-2"
            >
              <div className="px-3 py-1 inline-flex items-center space-x-1 border-[1px] bg-stone-800 border-gray-300 dark:border-gray-600 rounded-md">
                <span className="h-2 w-2 bg-green-500 rounded-full flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  100% Transparent.
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Zero Greenwashing.
              </span>
              <FiArrowRight className="text-sm text-gray-800 dark:text-gray-200" />
            </div>
            <h1
              ref={headerRef}
              className="text-4xl md:text-5xl lg:text-8xl font-bold leading-tight"
            >
              Make Every{" "}
              <span className="whitespace-nowrap">
                Emission{" "}
                <Typewriter
                  text={["Count", "Matter", "Be Tracked", "Add Up"]}
                  speed={100}
                  deleteSpeed={80}
                  loop={true}
                  delay={2000}
                  className="font-bold"
                />
              </span>
            </h1>
            <p
              ref={descriptionRef}
              className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-xl pr-4 sm:pr-8 lg:pr-16"
            >
              Track emissions, earn blockchain-powered rewards, and trade carbon
              credits — all in real time, all in one intelligent platform.
            </p>
            <div
              ref={buttonsRef}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="text-white">
                Get Demo
              </Button>
              <Button size="lg" variant="outline">
                Try For Free
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={featuresRef}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 mb-40"
        >
          <div ref={addToFeatureRefs} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full p-1 flex items-center justify-center shadow-md border-3">
                <Image
                  src={trackingIcon}
                  alt="Tracking Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Real-Time Tracking</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Monitor emissions effortlessly with smart, real-time data
                capture and visualization.
              </p>
            </div>
          </div>
          <div ref={addToFeatureRefs} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full p-1 flex items-center justify-center shadow-md border-3">
                <Image
                  src={rewardIcon}
                  alt="Reward Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Reward & Incentivization
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Turn sustainable actions into value with blockchain-powered
                token rewards.
              </p>
            </div>
          </div>
          <div ref={addToFeatureRefs} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full p-1 flex items-center justify-center shadow-md border-3">
                <Image
                  src={tradeIcon}
                  alt="Trade Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Trade & Scale Transparently
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Access a built-in carbon marketplace and grow your impact with
                full transparency.
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-[350px] mt-20">
          <div
            ref={heroImageRef}
            className="absolute -top-[120px] left-0 w-full h-[600px] rounded-lg overflow-hidden shadow-2xl z-20"
          >
            <Image
              src={heroImage}
              alt="Dashboard preview"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 75vw"
              quality={90}
              className="object-cover"
              onError={() => {
                console.warn("Hero image failed to load");
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
