import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanCard from "./PlanCard";

export default function PricingSection({
  selectedType,
  onTypeChange
}: {
  selectedType: "personal" | "group" | "functional";
  onTypeChange: (type: "personal" | "group" | "functional") => void;
}) {
  const [eliteDuration, setEliteDuration] = useState(3); // months

  const eliteMonthlyPrice = 40;
  const eliteTotalPrice = eliteMonthlyPrice * eliteDuration;

  const getTiers = () => {
    switch (selectedType) {
      case "personal":
        return [
          {
            name: "Personal Training",
            price: eliteTotalPrice.toString(),
            priceNote: `for ${eliteDuration} months`,
            description: "One-on-one sessions tailored specifically to your goals and pace.",
            features: [
              "Custom workout plans",
              "Progress tracking & analytics",
              "Community access",
              "Priority support",
              "Monthly form check-ins",
              "Direct messaging with trainer",
            ],
            hasSelector: true,
            priceId: "price_1Elite",
            featured: true,
          },
        ];
      case "group":
        return [
          {
            name: "Individual Group",
            price: "40",
            priceNote: "month",
            description: "Join our vibrant community for group training.",
            features: [
              "2-3 Sessions per week.",
              "Unlimited group classes",
              "Community events",
              "Group progress tracking",
              "Expert instruction",

            ],
            priceId: "price_group_ind",
            featured: true,
          },
          {
            name: "Corporate Group",
            price: "29.99",
            priceNote: "group/month",
            description: "Structured group training for organizations.",
            features: [
              "Dedicated class slots",
              "Team building focus",
              "Usage analytics",
              "Custom onboarding",
            ],
            isOrganization: true,
          },
        ];
      case "functional":
        return [
          {
            name: "Functional Core",
            price: "49",
            priceNote: "month",
            description: "Master real-world movement and strength.",
            features: [
              "Mobility workshops",
              "Strength & agility focus",
              "Real-world application guides",
              "Advanced equipment access",
            ],
            priceId: "price_functional_core",
            featured: true,
          },
        ];
      default:
        return [];
    }
  };

  const tiers = getTiers();

  return (
    <section id="plans" className="bg-gradient-to-b from-white to-rose-50 py-20 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
              Pricing Plans
            </p>
            <h2 className="mt-2 text-4xl font-bold text-zinc-900 md:text-5xl">
              Investment for <span className="capitalize">{selectedType}</span>
            </h2>
            <p className="mt-4 text-zinc-600">Transparent pricing for your transformation</p>
          </div>
        </motion.div>

        <div className="flex justify-center mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedType}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-8 w-full max-w-6xl place-items-center ${tiers.length === 1 ? "md:grid-cols-1 max-w-md" : "md:grid-cols-2 lg:grid-cols-2 max-w-4xl"
                }`}
            >
              {tiers.map((tier) => (
                <div key={tier.name} className="h-full w-full">
                  {/* @ts-ignore - PlanCard props mismatch with tiers object */}
                  <PlanCard
                    {...tier}
                    eliteDuration={tier.name === "Personal Training" ? eliteDuration : undefined}
                    onDurationChange={tier.name === "Personal Training" ? setEliteDuration : undefined}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

