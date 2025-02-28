"use client";

import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Film } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import Image from "next/image";
// import heroImage from '@/assets/marketing/hero.webp'

export const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["effortlessly", "instantly", "reliably", "smartly"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="pb-0 bg-white">
      <div className="section-container">
        <div className="hero-centered">
        <p className="lg:hidden marketing-h4">UpScore</p>
          <div>
            <Badge variant="secondary">Powered by AI, for humans</Badge>
            {/* <Button variant="secondary" size="sm" className="gap-4">
              Read our launch article <ArrowRight className="w-4 h-4" />
            </Button> */}
          </div>
          <h1 className="marketing-display">
            <span className="">I want to know how my team is performing—</span>
            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-2 md:pt-1">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute"
                  initial={{ opacity: 0, y: "-100" }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? {
                          y: 0,
                          opacity: 1,
                        }
                      : {
                          y: titleNumber > index ? -150 : 150,
                          opacity: 0,
                        }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>

          <p className="marketing-body-lg text-foreground-weak max-w-2xl text-center mx-auto">
            Refuse to leave success to chance. Quickly score and track team
            actions and behaviors in real time—unlocking data-driven insights to
            make you the most effective team leader in the organization.
          </p>
          <div className="flex flex-col md:flex-row gap-4 mx-auto">
            <Button size="lg" variant="outline">
              Show me a short demo <Film />
            </Button>
            <SignUpButton>
              <Button size="lg">
                I want to try it <ArrowRight />
              </Button>
            </SignUpButton>
          </div>
          <p className="marketing-body-xs text-foreground-muted text-left lg:text-center max-w-xs lg:max-w-sm mx-auto pt-0 lg:pt-8">
            UpScore is a mobile and desktop app that lets you score your team’s
            performance in real-time—in less than 20 seconds per entry. Set up
            your organization in just 5 minutes, and let our AI transform your
            scores into clear, actionable dashboards and periodic performance
            reviews in your desired format. It’s effortless, data-driven
            leadership that delivers measurable ROI.
          </p>
        </div>
      </div>

      <Image
        // src={heroImage}
        src={""}
        alt="Hero Image"
        width={1080}
        height={600}
        className="mx-auto min-h-56 bg-muted"
      />
    </section>
  );
};
