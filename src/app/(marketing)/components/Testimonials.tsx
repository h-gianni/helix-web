"use client";

import { User } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Card } from "@/components/ui/core/Card";
import StarRating from "@/components/ui/core/StarRating";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/core/Avatar";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const testimonials = [
  {
    name: "Caroline M.",
    title: "Director of Operations, InnovateCo",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "This app gave us total clarity in less than a week.",
    outcome:
      "Our team’s performance reviews went from guesswork to bulletproof data—everyone feels heard and fairly evaluated.",
  },
  {
    name: "James L.",
    title: "Team Lead, Bright Labs",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    quote: "Finally, a performance tool that actually feels human.",
    outcome:
      "The simple scoring interface cuts through the noise and lets me give immediate, meaningful feedback that my team loves.",
  },
  {
    name: "Sara H.",
    title: "Product Manager, FutureTech",
    avatar: "",
    quote: "It’s like having an extra manager who never misses a detail.",
    outcome:
      "We’ve spotted improvement opportunities way before they escalated—saving time, money, and morale.",
  },
  {
    name: "Miguel R.",
    title: "HR Manager, GlobalPulse",
    avatar: "",
    quote: "Data-driven insights that are easy to act on, not overwhelming.",
    outcome:
      "At our quarterly review, every conversation was grounded in real numbers—less arguing, more problem-solving.",
  },
  {
    name: "Tracy W.",
    title: "COO, NextGen Solutions",
    avatar: "",
    quote: "The most transparent performance reviews we’ve ever had.",
    outcome:
      "By scoring throughout the year, our employees knew exactly where they stood, so there were zero surprises come review time.",
  },
  {
    name: "Aaron D.",
    title: "Team Leader, Cloud9 Ventures",
    avatar: "https://randomuser.me/api/portraits/men/47.jpg",
    quote: "Perfect for our hybrid team—everyone feels included.",
    outcome:
      "Whether they’re in the office or remote, each member’s contributions are tracked and recognized, boosting overall engagement.",
  },
  {
    name: "Linda P.",
    title: "VP of People, StarWave Media",
    avatar: "",
    quote: "We cut our annual review prep down from days to a few hours.",
    outcome:
      "All the data was right there, beautifully organized. It’s saved us so much time—and improved accuracy along the way.",
  },
  {
    name: "Connor M.",
    title: "Head of Engineering, CodeCraft",
    avatar: "https://randomuser.me/api/portraits/men/50.jpg",
    quote: "We saw a 20% bump in productivity within two months.",
    outcome:
      "Real-time scoring motivated healthy competition and self-improvement—our weekly sprints have never looked better.",
  },
  {
    name: "Connor M.",
    title: "Head of Engineering, CodeCraft",
    avatar: "",
    quote: "We saw a 20% bump in productivity within two months.",
    outcome:
      "Real-time scoring motivated healthy competition and self-improvement—our weekly sprints have never looked better.",
  },
];

export const Testimonials = () => (
  <section>
    <div className="section-container">
      <div className="section-header">
        <Badge variant="accent">Our fuel</Badge>
        <h2 className="marketing-h1">Testimonials</h2>
        <p className="marketing-body-lg">
          See how our platform has transformed performance management for teams
          worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className={`bg-white border-0 rounded-md space-y-4 p-6 lg:aspect-auto flex justify-between flex-col ${
              index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
            }`}
          >
            <div className="flex items-start justify-between">
            <Avatar>
              <AvatarImage src={testimonial.avatar || ""} />
              <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
            </Avatar>
            <StarRating
              value={5}
              disabled
              size="sm"
            />
            </div>

            <div className="flex flex-col gap-1 flex-1 max-w-md">
              <h3 className="marketing-body font-semibold text-foreground-strong leading-tight">
                {testimonial.quote}
              </h3>
              <p className="marketing-body-sm">{testimonial.outcome}</p>
              <div className="mt-4 marketing-body-xs">
                — <span className="font-semibold text-foreground">{testimonial.name}</span>, {testimonial.title}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
