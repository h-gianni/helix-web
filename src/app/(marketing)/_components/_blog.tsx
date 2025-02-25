import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/core/Button";

const blogPosts = [
  {
    title:
      "From Annual Hassles to Ongoing Wins: How Real-Time Scoring Transforms Performance Reviews",
    description:
      "Are you tired of scrambling to recall your team’s performance when annual review time rolls around? Real-time scoring offers a dynamic alternative that keeps everyone on track throughout the year. In this post, we’ll explore how day-to-day insights can elevate team engagement, reduce administrative headaches, and foster a culture of continuous improvement—no more last-minute guesswork.",
  },
  {
    title: "AI-Driven Insights: The Secret Weapon for Building Unstoppable Teams",
    description:
      "In today’s competitive landscape, the difference between a good team and a game-changing one often comes down to having the right data at your fingertips. Enter AI-driven analytics. This article dives into how artificial intelligence can shine a light on hidden performance patterns, empower leaders with actionable recommendations, and ultimately transform the way you motivate and manage your people.",
  },
  {
    title:
      "The 5 Common Pitfalls of Old-School Performance Reviews—and How to Fix Them",
    description:
      "If you’re using the same annual review process from a decade ago, you could be missing out on major breakthroughs in team productivity and morale. In this piece, we’ll highlight the most frequent mistakes leaders make—from fuzzy metrics to one-size-fits-all evaluations—and share how modern tools and techniques (including real-time scoring) can help you avoid them.",
  },
  {
    title: "Gamification in the Workplace: How Simple Scoring Can Fuel Motivation",
    description:
      "Even top performers sometimes need a nudge to maintain their momentum. That’s where gamification comes in. This blog post explores how scoring systems, leaderboards, and immediate feedback can turn everyday tasks into achievable milestones, boosting morale and lighting a spark under every member of your team—no matter where they’re working from.",
  },
];

export const Blog = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto flex flex-col gap-14">
      <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
        <h4 className="text-3xl md:text-5xl tracking-tighter font-light">
          Latest Articles
        </h4>
        <Button className="gap-2">
          View all articles <MoveRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {blogPosts.map((post, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="bg-muted rounded-md aspect-video mb-4"></div>
            <h3 className="text-xl font-semibold tracking-tight">{post.title}</h3>
            <p className="text-muted-foreground text-base">{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
