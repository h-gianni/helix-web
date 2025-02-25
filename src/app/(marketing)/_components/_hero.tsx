"use client";

import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { SignUpButton } from "@clerk/nextjs";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/core/Button";

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
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              Read our launch article <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="display-1 max-w-2xl text-center">
              <span className="">
                I want to be a leader who always knows how my team is
                performing—
              </span>
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
              {/* <span className="block mt-2 text-5xl md:text-5xl tracking-tight">
                Turn your Team into gold standard.
              </span> */}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center mx-auto">
              Refuse to leave success to chance. Quickly score and track team
              actions and behaviors in real time—unlocking data-driven insights
              to make you the most effective team leader in the organization.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button size="lg" variant="outline">
              Show me a short demo <PhoneCall />
            </Button>
            <SignUpButton>
              <Button size="lg">
                I want to try it <MoveRight />
              </Button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </div>
  );
};
