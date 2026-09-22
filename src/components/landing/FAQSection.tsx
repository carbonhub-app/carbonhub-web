"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FaQ = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const faqItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faqItems = [
    {
      question: "How do I start trading carbon credits?",
      answer:
        "Simply create an account, verify your company details, and explore available carbon credit options on our transparent marketplace. Start trading instantly with confidence.",
    },
    {
      question: "What information is required to list my company?",
      answer:
        "You'll need to provide valid company registration documents, verified emissions data, and compliance certificates to ensure transparency and trustworthiness.",
    },
    {
      question: "Can I track my carbon footprint progress?",
      answer:
        "Absolutely! Our platform offers real-time tracking dashboards so you can monitor emissions, trading activities, and rewards all in one place.",
    },
    {
      question: "Are there any fees for trading?",
      answer:
        "We offer a competitive fee structure with no hidden charges. Transaction fees vary based on trade volume and type; detailed info is available in your account dashboard.",
    },
    {
      question: "Is the platform secure and compliant?",
      answer:
        "Yes, CarbonHub uses blockchain technology to ensure transparent, tamper-proof transactions. We adhere to international standards for carbon trading compliance.",
    },
    {
      question: "How can I get support if I have questions?",
      answer:
        "Our dedicated support team is available via chat, email, and phone. Visit our Contact page to reach out anytime — we're here to help you succeed.",
    },
  ];

  useEffect(() => {
    // Section fade in
    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) {
      gsap.fromTo(
        currentSectionRef,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: currentSectionRef,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    const validFaqItems = faqItemRefs.current.filter(
      (el) => el !== null
    ) as HTMLDivElement[];

    const cleanups: (() => void)[] = [];

    if (validFaqItems.length > 0) {
      gsap.fromTo(
        validFaqItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          scrollTrigger: {
            trigger: currentSectionRef,
            start: "top 70%",
            once: true,
          },
        }
      );

      // Hover effects for FAQ items
      validFaqItems.forEach((item) => {
        if (item) {
          const tl = gsap.timeline({ paused: true });
          tl.to(item, {
            scale: 1.02,
            duration: 0.3,
            ease: "power1.inOut",
          });

          const playAnim = () => tl.play();
          const reverseAnim = () => tl.reverse();

          item.addEventListener("mouseenter", playAnim);
          item.addEventListener("mouseleave", reverseAnim);

          cleanups.push(() => {
            item.removeEventListener("mouseenter", playAnim);
            item.removeEventListener("mouseleave", reverseAnim);
            tl.kill();
          });
        }
      });
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative py-20 pb-24 bg-transparent dark:bg-transparent"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-white text-center mb-12">
          Frequently Asked Questions
        </h1>

        <div className="space-y-8">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                ref={(el) => {
                  if (el && !faqItemRefs.current.includes(el)) {
                    faqItemRefs.current[index] = el as HTMLDivElement;
                  }
                }}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden mb-8"
              >
                <AccordionTrigger className="p-8 text-lg text-white font-medium hover:bg-white/15 hover:no-underline text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8 text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FaQ;
