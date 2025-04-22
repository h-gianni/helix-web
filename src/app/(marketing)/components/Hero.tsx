"use client";

import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Film } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
// import Image from "next/image";
// import LogoImage from "@/assets/shared/logo.svg";
// import HeroImage from "@/assets/marketing/hero.svg";
import { BrandLogo } from "@/components/logo/BrandLogo";

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
    <section className="bg-white pb-0 px-0">
      <div className="section-container">
        <div className="hero-centered">
          <div className="lg:hidden flex flex-col pt-6 pb-2">
          <BrandLogo variant="vertical" size="hero" />
          </div>
          <div>
            <Badge variant="primary-light">Powered by AI, for humans</Badge>
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

          <p className="marketing-body-lg max-w-2xl text-center mx-auto">
            Refuse to leave success to chance. Quickly score and track team
            actions and behaviors in real time—unlocking data-driven insights to
            make you the most effective and efficient team leader in the
            organization.
          </p>
          <div className="flex flex-col md:flex-row gap-4 mx-auto">
            <Button size="xl" variant="outline">
              Show me a short demo <Film />
            </Button>
            <SignUpButton>
              <Button size="xl" variant="primary" className="shadow-lg">
                I want to try it <ArrowRight />
              </Button>
            </SignUpButton>
          </div>
        </div>
      </div>
      <div className="relative w-full flex flex-col items-center mt-4 md:mt-0">
        <p className="hidden md:block absolute top-0 z-20 bg-white rounded-b-lg marketing-body-xs text-center text-foreground-weak max-w-xs lg:max-w-sm mx-auto px-4 py-2">
          UpScore is a app that lets you score your team’s performance in
          real-time—in less than 20 seconds per entry. Set up your org in just 5
          minutes, and let our AI transform your scores into clear, actionable
          dashboards and periodic performance reviews in your desired format.
          It’s effortless, data-driven leadership that delivers measurable ROI.
        </p>

        {/* SVG Pointer */}
        {/* <svg
          className="hidden md:block absolute top-0 left-0 w-full h-[240px] z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon points="0,0 100,0 50,100" fill="white" />
        </svg> */}

        {/* <Image
          src={HeroImage}
          alt="Hero Image"
          // width={1080}
          // height={600}
          className="relative z-0 mx-auto min-h-56 bg-white"
        /> */}
      </div>
    </section>
  );
};
