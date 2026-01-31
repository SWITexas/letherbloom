import { useState } from "react";
import PlanCard from "./PlanCard";
import Link from "next/link";

export default function PlansSection({
  onSelect,
}: {
  onSelect?: (plan: { name: string; priceId: string; duration?: number }) => void;
}) {
  const [trainingType, setTrainingType] = useState<"personal" | "group" | "functional">("personal");
  const [eliteDuration, setEliteDuration] = useState(3); // months

  const eliteMonthlyPrice = 59;
  const eliteTotalPrice = eliteMonthlyPrice * eliteDuration;

  const getPlans = () => {
    switch (trainingType) {
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
            priceId: "price_1Elite",
            hasSelector: true,
            eliteDuration: eliteDuration,
            onDurationChange: setEliteDuration,
            featured: true,
          },
        ];
      case "group":
        return [
          {
            name: "Individual Group",
            price: "39",
            priceNote: "month",
            description: "Join our vibrant community for group training.",
            features: [
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
            price: "15",
            priceNote: "per user/month",
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

  const currentPlans = getPlans();

  const trainingOptions = [
    { type: "personal", label: "Personal", icon: "💪" },
    { type: "group", label: "Group", icon: "👥" },
    { type: "functional", label: "Functional", icon: "🎯" },
  ];

  return (
    <section id="plans" className="mt-8 mb-12">
      <div className="flex flex-col items-center justify-center mb-12">
        <h2 className="text-4xl font-bold text-zinc-900 md:text-5xl">Select Your Training</h2>
        <p className="mt-4 text-zinc-600">Choose a category to view tailored plans</p>

        {/* Improved Training Type Selector Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl px-4">
          {trainingOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setTrainingType(opt.type as any)}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${trainingType === opt.type
                ? "border-rose-600 bg-rose-50 shadow-md ring-1 ring-rose-600"
                : "border-zinc-200 bg-white hover:border-rose-200 hover:bg-zinc-50"
                }`}
            >
              <span className="text-3xl mb-3">{opt.icon}</span>
              <span className={`font-bold capitalize ${trainingType === opt.type ? "text-rose-600" : "text-zinc-900"
                }`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 rounded-3xl bg-zinc-50/50 border border-zinc-100 shadow-inner">
        <div className="flex justify-center">
          <div className={`grid gap-8 w-full place-items-center ${currentPlans.length === 1 ? "md:grid-cols-1 max-w-md" : "md:grid-cols-2 lg:grid-cols-2 max-w-4xl"
            }`}>
            {currentPlans.map((plan) => (
              <div key={plan.name} className="h-full w-full">
                {/* @ts-ignore - PlanCard props mismatch with dynamic Elite props */}
                <PlanCard {...plan} onSelect={onSelect ? (p) => onSelect({ ...p, duration: plan.eliteDuration }) : undefined} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


