"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/core/Badge";
import { GripVertical } from "lucide-react";

export const Craftsmanship = () => {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }

    const percentage = (x / rect.width) * 100;
    setInset(percentage);
  };

  return (
    <section>
      <div className="section-container">
        <div className="section-header">
          <div>
            <Badge>Our philosophy</Badge>
          </div>
            <h2 className="marketing-h1">
              Craftsmanship Meets Human-Centered Design
            </h2>
            <p className="marketing-body-lg">
              We believe technology should feel empowering, not overwhelming.
              That’s why every element of our app—down to each pixel and
              interaction—is crafted with purpose and care. Our design
              philosophy is rooted in simplicity and warmth, ensuring that
              whether you prefer light or dark mode, the experience feels
              intuitive, visually appealing, and utterly human. By blending
              thoughtful aesthetics with powerful functionality, we bring your
              team closer to the insights that matter—all while celebrating the
              art of great design.
            </p>
          </div>
          <div className="w-full">
            <div
              className="relative aspect-video w-full h-full overflow-hidden rounded-2xl select-none"
              onMouseMove={onMouseMove}
              onMouseUp={() => setOnMouseDown(false)}
              onTouchMove={onMouseMove}
              onTouchEnd={() => setOnMouseDown(false)}
            >
              <div
                className="bg-muted h-full w-1 absolute z-20 top-0 -ml-1 select-none"
                style={{
                  left: inset + "%",
                }}
              >
                <button
                  className="bg-muted rounded hover:scale-110 transition-all w-5 h-10 select-none -translate-y-1/2 absolute top-1/2 -ml-2 z-30 cursor-ew-resize flex justify-center items-center"
                  onTouchStart={(e) => {
                    setOnMouseDown(true);
                    onMouseMove(e);
                  }}
                  onMouseDown={(e) => {
                    setOnMouseDown(true);
                    onMouseMove(e);
                  }}
                  onTouchEnd={() => setOnMouseDown(false)}
                  onMouseUp={() => setOnMouseDown(false)}
                >
                  <GripVertical className="h-4 w-4 select-none" />
                </button>
              </div>
              <Image
                src="/feature8.png"
                alt="feature8"
                width={1920}
                height={1080}
                priority
                className="absolute left-0 top-0 z-10 w-full h-full aspect-video rounded-2xl select-none border"
                style={{
                  clipPath: "inset(0 0 0 " + inset + "%)",
                }}
              />
              <Image
                src="/darkmode-feature8.png"
                alt="darkmode-feature8.png"
                width={1920}
                height={1080}
                priority
                className="absolute left-0 top-0 w-full h-full aspect-video rounded-2xl select-none border"
              />
            </div>
          </div>
      </div>
    </section>
  );
};
