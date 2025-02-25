import { User } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";

const testimonials = [
  {
    name: "Caroline M.",
    title: "Director of Operations, InnovateCo",
    quote: "This app gave us total clarity in less than a week.",
    outcome:
      "Our team’s performance reviews went from guesswork to bulletproof data—everyone feels heard and fairly evaluated.",
  },
  {
    name: "James L.",
    title: "Team Lead, Bright Labs",
    quote: "Finally, a performance tool that actually feels human.",
    outcome:
      "The simple scoring interface cuts through the noise and lets me give immediate, meaningful feedback that my team loves.",
  },
  {
    name: "Sara H.",
    title: "Product Manager, FutureTech",
    quote: "It’s like having an extra manager who never misses a detail.",
    outcome:
      "We’ve spotted improvement opportunities way before they escalated—saving time, money, and morale.",
  },
  {
    name: "Miguel R.",
    title: "HR Manager, GlobalPulse",
    quote: "Data-driven insights that are easy to act on, not overwhelming.",
    outcome:
      "At our quarterly review, every conversation was grounded in real numbers—less arguing, more problem-solving.",
  },
  {
    name: "Tracy W.",
    title: "COO, NextGen Solutions",
    quote: "The most transparent performance reviews we’ve ever had.",
    outcome:
      "By scoring throughout the year, our employees knew exactly where they stood, so there were zero surprises come review time.",
  },
  {
    name: "Aaron D.",
    title: "Team Leader, Cloud9 Ventures",
    quote: "Perfect for our hybrid team—everyone feels included.",
    outcome:
      "Whether they’re in the office or remote, each member’s contributions are tracked and recognized, boosting overall engagement.",
  },
  {
    name: "Linda P.",
    title: "VP of People, StarWave Media",
    quote: "We cut our annual review prep down from days to a few hours.",
    outcome:
      "All the data was right there, beautifully organized. It’s saved us so much time—and improved accuracy along the way.",
  },
  {
    name: "Connor M.",
    title: "Head of Engineering, CodeCraft",
    quote: "We saw a 20% bump in productivity within two months.",
    outcome:
      "Real-time scoring motivated healthy competition and self-improvement—our weekly sprints have never looked better.",
  },
  {
    name: "Connor M.",
    title: "Head of Engineering, CodeCraft",
    quote: "We saw a 20% bump in productivity within two months.",
    outcome:
      "Real-time scoring motivated healthy competition and self-improvement—our weekly sprints have never looked better.",
  },
];

export const Testimonials = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start">
          <Badge>Platform</Badge>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-light">
              Testimonials
            </h2>
            <p className="text-lg max-w-xl leading-relaxed text-muted-foreground">
              See how our platform has transformed performance management for
              teams worldwide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-muted rounded-md p-6 flex flex-col justify-between ${
                index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <User className="w-8 h-8 stroke-1 mb-4" />
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{testimonial.quote}</h3>
                <p className="text-muted-foreground text-base">
                  {testimonial.outcome}
                </p>
                <div className="mt-4 text-sm font-medium">
                  — {testimonial.name}, {testimonial.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
