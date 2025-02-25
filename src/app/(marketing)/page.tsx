import { Button } from "@/components/ui/core/Button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import { Hero } from "./_components/_hero";
import { Problems } from "./_components/_problems";
import { How } from "./_components/_how";
import { Features } from "./_components/_features";
import { Scenarios } from "./_components/_scenarios";
import { Testimonials } from "./_components/_testimonials";
import { Craftsmanship } from "./_components/_craftsmanship";
import { Case1 } from "./_components/_case1";
import { Case2 } from "./_components/_case2";
import { Pricing } from "./_components/_pricing";
import { CTA1 } from "./_components/_cta1";
import { CTA2 } from "./_components/_cta2";
import { Blog } from "./_components/_blog";
import { FAQ } from "./_components/_faq";
import { Contact } from "./_components/_contact";
import { Footer } from "./_components/_footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="container">
      <div className="h-80 bg-slate-200 p-64 text-center">Image</div>
      {/* <Case2 /> */}
      <Problems />
      <How />
      <Features />
      <Scenarios />
      {/* <Case1 /> */}
      <Testimonials />
      <Pricing />
      <CTA1 />
      <Craftsmanship />
      <Blog />
      <FAQ />
      <Contact />
      </div>
      <CTA2 />
      <Footer />
    </>
  );
}
