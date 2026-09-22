"use client";

import React, { useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const originalTeam = [
  {
    avatar: "https://imgur.com/GidbcdB.jpg",
    name: "Jihan Aurelia",
    title: "Frontend Developer",
    linkedin: "https://www.linkedin.com/in/jihanaurelia/",
    github: "https://github.com/jijiau",
  },
  {
    avatar: "https://i.imgur.com/GiAfcdB.jpg",
    name: "Serenada Cinta",
    title: "UI/UX Designer",
    linkedin: "https://www.linkedin.com/in/serenada-cinta-sunindyo-77aa55283/",
    github: "https://github.com/Serenadacinta",
  },
  {
    avatar: "https://i.imgur.com/3VujJJ3.jpg",
    name: "Aththariq Lisan",
    title: "Frontend Developer",
    linkedin: "https://www.linkedin.com/in/aththariqlisan/",
    github: "https://github.com/aththariq",
  },
  {
    avatar: "https://imgur.com/gzPRLy3.jpg",
    name: "Nasywaa Anggun",
    title: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/nasywaa-anggun-athiefah/",
    github: "https://github.com/nasywaanaa",
  },
  {
    avatar: "https://imgur.com/6RA9RL6.jpg",
    name: "Faiz Atharrahman",
    title: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/faizath/",
    github: "https://github.com/faizath",
  },
];

const CARD_WIDTH_MD = 320; // md:w-80 from Tailwind
const CARD_GAP = 32; // gap-8 from Tailwind (2rem = 32px)
const ITEM_TOTAL_WIDTH = CARD_WIDTH_MD + CARD_GAP;
const NUM_CLONE_CARDS = 3; // Number of cards cloned on each side for smooth looping. Renamed for clarity.

const createDisplayTeam = () => {
  if (originalTeam.length === 0) return [];
  const itemsToClone = Math.min(NUM_CLONE_CARDS, originalTeam.length);
  const startClones = originalTeam.slice(originalTeam.length - itemsToClone);
  const endClones = originalTeam.slice(0, itemsToClone);
  return [...startClones, ...originalTeam, ...endClones];
};

const displayTeam = createDisplayTeam();

const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const teamListRef = useRef<HTMLUListElement>(null);
  const teamItemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const progress = useRef(NUM_CLONE_CARDS); // Initial progress points to the start of the actual originalTeam segment
  const isAnimating = useRef(false);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const titleEl = titleRef.current;
    const paragraphEl = paragraphRef.current;
    const teamListEl = teamListRef.current;
    const validTeamItems = teamItemRefs.current.filter(
      Boolean
    ) as HTMLLIElement[];

    if (sectionEl) {
      gsap.fromTo(
        sectionEl,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: { trigger: sectionEl, start: "top 80%", once: true },
        }
      );
    }
    if (titleEl) {
      gsap.fromTo(
        titleEl,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          scrollTrigger: { trigger: titleEl, start: "top 85%", once: true },
        }
      );
    }
    if (paragraphEl) {
      gsap.fromTo(
        paragraphEl,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.4,
          scrollTrigger: { trigger: paragraphEl, start: "top 85%", once: true },
        }
      );
    }
    if (teamListEl && validTeamItems.length > 0) {
      gsap.fromTo(
        validTeamItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          delay: 0.6,
          scrollTrigger: { trigger: teamListEl, start: "top 80%", once: true },
        }
      );
    }
  }, []);

  useLayoutEffect(() => {
    if (teamListRef.current) {
      gsap.set(teamListRef.current, {
        x: -(progress.current * ITEM_TOTAL_WIDTH),
      });
    }
  }, []);

  const handleScroll = (direction: 1 | -1) => {
    if (isAnimating.current || !teamListRef.current || displayTeam.length === 0)
      return;
    isAnimating.current = true;

    const targetProgress = progress.current + direction;

    gsap.to(teamListRef.current, {
      x: -(targetProgress * ITEM_TOTAL_WIDTH),
      duration: 0.5, // Slightly faster for snappier feel
      ease: "power1.inOut",
      onComplete: () => {
        // Check if we need to wrap around
        if (
          direction === 1 &&
          targetProgress >= originalTeam.length + NUM_CLONE_CARDS
        ) {
          // Moved past the end clones, jump to the start of original items
          progress.current = NUM_CLONE_CARDS; // Start of original items in displayTeam
          gsap.set(teamListRef.current, {
            x: -(progress.current * ITEM_TOTAL_WIDTH),
          });
        } else if (direction === -1 && targetProgress < NUM_CLONE_CARDS) {
          // Moved before the start clones, jump to the end of original items
          progress.current = originalTeam.length + NUM_CLONE_CARDS - 1; // End of original items in displayTeam
          gsap.set(teamListRef.current, {
            x: -(progress.current * ITEM_TOTAL_WIDTH),
          });
        } else {
          progress.current = targetProgress;
        }
        isAnimating.current = false;
      },
    });
  };

  const handlePrev = () => handleScroll(-1);
  const handleNext = () => handleScroll(1);

  if (displayTeam.length === 0) {
    return null; // Or a loading/empty state
  }

  return (
    <section ref={sectionRef} className="py-14 bg-transparent">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h3
            ref={titleRef}
            className="text-gray-100 text-3xl font-semibold sm:text-4xl"
          >
            Meet the CarbonHub Team!
          </h3>
          <p ref={paragraphRef} className="text-gray-400 mt-3 max-w-md mx-auto">
            Driven by passion and innovation, we create cutting-edge,
            transparent, and user-friendly carbon trading solutions that empower
            a sustainable future.
          </p>
        </div>

        <div className="mt-16 relative">
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-100 hover:bg-white/20 transition-all focus:outline-none"
            aria-label="Previous team member"
          >
            <IoIosArrowBack size={24} />
          </button>

          <div className="overflow-hidden max-w-5xl mx-auto">
            <ul ref={teamListRef} className="flex">
              {displayTeam.map((member, idx) => (
                <li
                  key={`${member.name}-clone-${idx}`}
                  ref={(el) => {
                    teamItemRefs.current[idx] = el;
                  }} // This might overpopulate if not careful, but GSAP targets the UL
                  className="flex flex-col items-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl w-72 md:w-80 flex-shrink-0 list-none"
                  style={{ marginRight: `${CARD_GAP}px` }}
                >
                  <div className="relative w-28 h-28 mb-5 rounded-full overflow-hidden shadow-lg border-2 border-indigo-500">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                      priority={
                        idx >= NUM_CLONE_CARDS &&
                        idx < NUM_CLONE_CARDS + originalTeam.length &&
                        idx - NUM_CLONE_CARDS < NUM_CLONE_CARDS
                      }
                      sizes="112px"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-gray-100 font-semibold text-xl">
                      {member.name}
                    </h4>
                    <p className="text-indigo-400 text-sm mt-1">
                      {member.title}
                    </p>
                    <div className="mt-4 flex justify-center gap-5 text-gray-400">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} GitHub`}
                          className="hover:text-indigo-400 transition"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 16.299 24 12c0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} LinkedIn`}
                          className="hover:text-indigo-400 transition"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 48 48"
                          >
                            <g clipPath="url(#clip0_17_68)">
                              <path
                                fill="currentColor"
                                d="M44.447 0H3.544C1.584 0 0 1.547 0 3.46V44.53C0 46.444 1.584 48 3.544 48h40.903C46.407 48 48 46.444 48 44.54V3.46C48 1.546 46.406 0 44.447 0zM14.24 40.903H7.116V17.991h7.125v22.912zM10.678 14.87a4.127 4.127 0 01-4.134-4.125 4.127 4.127 0 014.134-4.125 4.125 4.125 0 010 8.25zm30.225 26.034h-7.115V29.766c0-2.653-.047-6.075-3.704-6.075-3.703 0-4.265 2.896-4.265 5.887v11.325h-7.107V17.991h6.826v3.13h.093c.947-1.8 3.272-3.702 6.731-3.702 7.21 0 8.541 4.744 8.541 10.912v12.572z"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_17_68">
                                <path fill="currentColor" d="M0 0h48v48H0z" />
                              </clipPath>
                            </defs>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-100 hover:bg-white/20 transition-all focus:outline-none"
            aria-label="Next team member"
          >
            <IoIosArrowForward size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Team;
