import { Button } from "@/components/ui/core/Button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import { Hero } from "../../components/ui/marketing/_hero";
import { Problems } from "../../components/ui/marketing/_problems";
import { How } from "../../components/ui/marketing/_how";
import { Features } from "../../components/ui/marketing/_features";
import { Scenarios } from "../../components/ui/marketing/_scenarios";
import { Testimonials } from "../../components/ui/marketing/_testimonials";
import { Craftsmanship } from "../../components/ui/marketing/_craftsmanship";
import { Case1 } from "../../components/ui/marketing/_case1";
import { Case2 } from "../../components/ui/marketing/_case2";
import { Pricing } from "../../components/ui/marketing/_pricing";
import { CTA1 } from "../../components/ui/marketing/_cta1";
import { CTA2 } from "../../components/ui/marketing/_cta2";
import { Blog } from "../../components/ui/marketing/_blog";
import { FAQ } from "../../components/ui/marketing/_faq";
import { OurStory } from "../../components/ui/marketing/_story";
import { Footer } from "../../components/ui/marketing/_footer";

export default function HomePage() {
  return (
    <>
      <Hero />
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
      <OurStory />
      <Blog />
      <FAQ />
      <CTA2 />
      <Footer />
    </>
  );
}
