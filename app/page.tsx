"use client";
import { useState } from "react";

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AccessibilitySection from "@/components/AccessibilitySection";
import TrainingsSection from "@/components/TrainingsSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PhilosophySection from "@/components/PhilosophySection";
import CommunitySection from "@/components/CommunitySection";
import EmpowermentSection from "@/components/EmpowermentSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [trainingType, setTrainingType] = useState<"personal" | "group" | "functional">("personal");

  return (
    <div className="bg-white font-sans text-foreground">
      <Navigation />
      <HeroSection />
      <AccessibilitySection />
      <TrainingsSection selectedType={trainingType} onSelect={setTrainingType} />
      <PricingSection selectedType={trainingType} onTypeChange={setTrainingType} />
      <TestimonialsSection />
      <PhilosophySection />
      <CommunitySection />
      <EmpowermentSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
