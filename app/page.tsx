import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "LetHerBloom | Women's Upper Body Calisthenics & Strength",
  description: "Join LetHerBloom for virtual ladies' upper body gymnastics, calisthenics, and posture correction. Transform your strength, mobility, and confidence online.",
  keywords: [
    "ladies upper part gym",
    "ladies upper body gymnastics",
    "women calisthenics",
    "ladies upper body workout",
    "posture correction for women",
    "female gymnastics online",
    "women's strength training virtual gym",
    "virtual gymnastics sessions for women",
    "online posture training classes",
    "live female fitness workouts",
    "female upper body gymnastics",
    "women shoulder and chest workout",
    "ladies arm toning exercises"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LetHerBloom | Women's Upper Body Calisthenics & Strength",
    description: "Empower your fitness journey with virtual gymnastics, calisthenics, and posture training designed specifically for women.",
    url: "https://letherbloom.com",
    siteName: "LetHerBloom",
    images: [
      {
        url: "/images/Gemini_Generated_Image_251cny251cny251c.png",
        width: 1200,
        height: 630,
        alt: "LetHerBloom Women's Strength Training",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LetHerBloom | Women's Upper Body Calisthenics & Strength",
    description: "Transform your upper body strength and posture with specialized virtual training classes for women.",
    images: ["/images/Gemini_Generated_Image_251cny251cny251c.png"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "LetHerBloom",
    "image": "https://www.lhbloom.org/images/Gemini_Generated_Image_251cny251cny251c.png",
    "@id": "https://letherbloom.com/#organization",
    "url": "https://letherbloom.com",
    "description": "Empowering women through focused upper-body strength, mobility, and confidence-building workouts.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "15",
      "highPrice": "59",
      "offerCount": "4"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
