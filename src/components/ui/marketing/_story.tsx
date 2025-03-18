"use client";

import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import Image from "next/image";

export const OurStory = () => {
  return (
    <section className="max-w-2xl mx-auto">
      <div className="section-container max-w-2xl">
        {/* Header Section */}
        <div className="section-header">
          <div><Badge variant="accent">Our Story</Badge></div>
          <h2 className="marketing-h1">
            From Frustration to Clarity: <br />The Birth of UpScore
          </h2>
        </div>

        {/* Narrative Section */}
        <div className="space-y-10 body-base leading-relaxed px-4 lg:px-0">
          <p>
            It was another late afternoon during our annual performance review, a room filled with leaders from Product, Engineering, and Design. 
            I remember one particular meeting where the conversation spiraled into confusion. One colleague insisted that a team member’s impressive 
            project delivery last month was the hallmark of a star performer, while another argued that his overall impact over the year was inconsistent. 
            The debate wasn’t about clear data—it was a clash of opinions, emotions, and recent events. We were making decisions on promotions and raises 
            based solely on snapshots of effort and potential, never the full picture.
          </p>

          {/* Image for Visual Break */}
          <div className="relative bg-muted w-full h-72 rounded-md overflow-hidden">
            <Image
              src="/images/performance-decision.jpg"
              alt="Performance Review Discussion"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>

          <p>
            In another meeting, the conversation shifted from celebrating achievements to discussing who should be let go. The room grew tense as we scrambled 
            to justify layoffs with fragmented recollections. I saw the strain on my fellow leaders; we were forced to defend gut feelings rather than objective 
            results. The uncertainty and disagreement weren’t just inconvenient—they were undermining our ability to lead effectively, and they were hurting our teams.
          </p>

          <p>
            Over the years, these situations repeated themselves in various organizations. Every time, the same questions surfaced: <strong>How can we truly 
            know who is performing well? What truly defines impact?</strong> Is it the late nights, the quick fixes, or the long-term results? Each meeting left me 
            with a deep sense of frustration, knowing that our decisions were built on something as fickle as memory and emotion.
          </p>

          {/* Quote Block */}
          <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
            "I began to wonder—was there a better way to assess our teams? A way to capture not just isolated moments but the complete, unfolding story of each 
            team member’s contributions throughout the year."
          </blockquote>

          <p>
            That’s when my co-founder, <strong>Jay</strong>, and I decided to take matters into our own hands. We envisioned <strong>UpScore</strong>—a tool designed 
            to gather data continuously, turning every action and result into a clear, unbiased picture. UpScore was born out of our collective frustration and our deep 
            commitment to leading with both heart and clarity.
          </p>

          {/* Image for Engagement */}
          <div className="relative bg-muted w-full h-72 rounded-md overflow-hidden">
            <Image
              src="/images/UpScore-dashboard.jpg"
              alt="Team photo"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>

          <p>
            Today, I invite you to join us on this journey. Let’s create a future where leadership is grounded in real insights, where every decision honors the true 
            potential of our teams, and where we all can lead with confidence and compassion.
          </p>
        </div>
      </div>
    </section>
  );
};
