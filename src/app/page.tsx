import React from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import CTASection from "@/components/landing/CTASection";
import TeamSection from "@/components/landing/TeamSection";
import FAQSection from "@/components/landing/FAQSection";
import DomainChangeNotice from "@/components/landing/DomainChangeNotice";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <DomainChangeNotice />
      <LandingHeader />

      <main className="flex-grow">
        <HeroSection />

        {/* Problem Section with Gradient Background */}
        <div className="relative bg-[#060914]">
          {/* Background image wrapper */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Actual background div with image */}
            <div
              className="absolute h-[200%] w-full top-[-780px] left-[50px] z-0"
              style={{
                backgroundImage: 'url("/bg-marquee.webp")',
                backgroundSize: "1920px auto",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
                opacity: 0.8,
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <ProblemSection />
          </div>
        </div>

        <SolutionSection />
        {/* Additional sections would be added here */}
        {/* <TestimonialsSection /> */}
        <TeamSection />
        <FAQSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
}
