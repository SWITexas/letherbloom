import { Metadata } from "next";
import Footer from "@/components/Footer";
import LiveTrainingPage from "@/components/LiveTraining/view";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Live Virtual Sessions | LetHerBloom - Ladies Upper Body Gym & Gymnastics",
  description: "Join our live-streamed, virtual training classes focusing on ladies' upper body calisthenics, strength conditioning, posture correction, and gymnastics.",
  keywords: [
    "live ladies upper body gym",
    "virtual gymnastics sessions for women",
    "online posture training classes",
    "live female fitness workouts",
    "calisthenics live stream women"
  ],
  alternates: {
    canonical: "/live-training",
  },
  openGraph: {
    title: "Live Virtual Sessions | LetHerBloom - Ladies Upper Body Gym",
    description: "Join our live-streamed virtual training classes for ladies' upper body calisthenics, strength conditioning, posture correction, and gymnastics.",
    url: "https://letherbloom.com/live-training",
    siteName: "LetHerBloom",
    images: [
      {
        url: "/images/Gemini_Generated_Image_japhwjjaphwjjaph.png",
        width: 1200,
        height: 630,
        alt: "LetHerBloom Live Sessions",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Virtual Sessions | LetHerBloom",
    description: "Join live virtual training for women’s upper body gymnastics and calisthenics.",
    images: ["/images/Gemini_Generated_Image_251cny251cny251c.png"],
  },
};

export default function LiveContentPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Live Virtual Training Sessions",
    "description": "Live-streamed virtual training classes focusing on ladies' upper body gymnastics, calisthenics, and posture correction.",
    "startDate": "2026-07-01T18:00:00Z",
    "endDate": "2026-07-01T19:00:00Z",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "VirtualLocation",
      "url": "https://letherbloom.com/live-training"
    },
    "organizer": {
      "@type": "Organization",
      "name": "LetHerBloom",
      "url": "https://letherbloom.com"
    }
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <LiveTrainingPage />
      <Footer />
    </div>
  );
}
