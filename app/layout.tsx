import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.lhbloom.org"),
  title: {
    default: "LetHerBloom | Women's Upper Body Strength Training",
    template: "%s | LetHerBloom",
  },
  description: "Empowering women through focused upper-body strength, mobility, and confidence-building workouts. Join our community designed for women at every fitness level.",
  keywords: [
    "ladies upper part gym",
    "women's upper body training",
    "female calisthenics upper body",
    "women posture correction",
    "ladies gymnastics upper body",
    "virtual ladies strength training",
    "online women's fitness class",
    "female upper body gymnastics",
    "women shoulder and chest workout",
    "ladies arm toning exercises"
  ],
  icons: {
    icon: "/logo/flower-logo.png",
    shortcut: "/logo/flower-logo.png",
    apple: "/logo/flower-logo.png",
  },
  openGraph: {
    title: "LetHerBloom | Women's Upper Body Strength Training",
    description: "Empowering women through focused upper-body strength, mobility, and confidence-building workouts. Join our community designed for women at every fitness level.",
    url: "https://www.lhbloom.org",
    siteName: "LetHerBloom",
    images: [
      {
        url: "/images/Gemini_Generated_Image_251cny251cny251c.png",
        width: 1200,
        height: 630,
        alt: "LetHerBloom Women's Upper Body Strength Training",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LetHerBloom | Women's Upper Body Strength Training",
    description: "Empowering women through focused upper-body strength, mobility, and confidence-building workouts.",
    images: ["/images/Gemini_Generated_Image_251cny251cny251c.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
