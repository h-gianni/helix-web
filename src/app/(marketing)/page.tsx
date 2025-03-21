import { Button } from "@/components/ui/core/Button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import { Hero } from "./components/Hero";
import { Problems } from "./components/Problems";
import { How } from "./components/How";
import { Features } from "./components/Features";
import { Scenarios } from "./components/Scenarios";
import { Testimonials } from "./components/Testimonials";
import { Craftsmanship } from "./components/Craftsmanship";

import { Pricing } from "./components/Pricing";
import { CTA1 } from "./components/Cta1";
import { CTA2 } from "./components/Cta2";
import { Blog } from "./components/Blog";
import { FAQ } from "./components/Faq";
import { OurStory } from "./components/Story";
import { Footer } from "./components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <Case2 /> */}
       <Problems />
       <How />
     
      <Features />
       {/*
      <Scenarios /> */}
      {/* <Case1 /> */}
      <Testimonials />
      <Pricing />
      <CTA1 />
      <Craftsmanship />
     {/* <OurStory />
      <Blog />*/}
      
      <FAQ />
      <CTA2 />
      <Footer /> 
    </>
  );
}
