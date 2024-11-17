// app/dashboard/_component/_performersByCategory.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import {
  ChevronRight,
  Users,
  AlertCircle,
  PlusCircle,
  Star,
  Gem,
  Sparkles,
  Sparkle,
  Footprints,
  LifeBuoy,
  MinusCircle,
} from "lucide-react";

interface Performer {
  id: string;
  name: string;
  title: string | null;
  teamId: string;
  teamName: string;
  averageRating: number;
  ratingsCount: number;
}

interface PerformerCategory {
  title: string;
  minRating: number;
  maxRating: number;
  className: string;
  Icon: React.ComponentType<any>;
  description?: string;
}

interface PerformersByCategoryProps {
  category: PerformerCategory;
  performers: Performer[];
  isLoading?: boolean;
}

export const performanceCategories: PerformerCategory[] = [
  {
    title: "Top Performers",
    minRating: 4.6,
    maxRating: 5,
    className: "text-green-600",
    Icon: Gem,
    description: "Outstanding performance across all initiatives",
  },
  {
    title: "Strong Performers",
    minRating: 4,
    maxRating: 4.5,
    className: "text-emerald-600",
    Icon: Sparkles,
    description: "Consistently exceeding expectations",
  },
  {
    title: "Solid Performers",
    minRating: 3,
    maxRating: 3.9,
    className: "text-blue-600",
    Icon: Sparkle,
    description: "Meeting expectations consistently",
  },
  {
    title: "Weak Performers",
    minRating: 2.1,
    maxRating: 2.9,
    className: "text-amber-600",
    Icon: Footprints,
    description: "Need support to improve performance",
  },
  {
    title: "Poor Performers",
    minRating: 1,
    maxRating: 2,
    className: "text-red-600",
    Icon: LifeBuoy,
    description: "Requires immediate attention and support",
  },
  {
    title: "Not Rated",
    minRating: 0,
    maxRating: 0,
    className: "text-gray-600",
    Icon: MinusCircle,
    description: "Members awaiting their first performance rating",
  }
];

const StarRatingDisplay = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : index === fullStars && hasHalfStar
              ? "fill-yellow-400/50 text-yellow-400"
              : "fill-transparent text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export function PerformersByCategory({
  category,
  performers,
  isLoading = false,
}: PerformersByCategoryProps) {
  const router = useRouter();

  const categoryPerformers = performers.filter((performer) => {
    if (category.title === "Not Rated") {
      return performer.ratingsCount === 0;
    }
    return (
      performer.ratingsCount > 0 &&
      performer.averageRating >= category.minRating &&
      performer.averageRating <= category.maxRating
    );
  }).sort((a, b) => {
    if (category.title === "Not Rated") {
      return a.name.localeCompare(b.name);
    }
    return b.averageRating - a.averageRating;
  });

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className={`p-4 rounded-full bg-muted/50 ${category.className}`}>
        <category.Icon className="w-8 h-8" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">No {category.title}</h3>
        <p className="text-muted-foreground text-sm max-w-[400px]">
          {category.title === "Not Rated"
            ? "All team members have received at least one rating."
            : category.title === "Poor Performers" || category.title === "Weak Performers"
            ? "Great news! You don't have any team members performing below expectations."
            : `No team members currently fall into the ${category.title.toLowerCase()} category.`}
        </p>
      </div>
    </div>
  );

  if (categoryPerformers.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-gray-900`}>
          <category.Icon className={`w-5 h-5 ${category.className}`} />
          {category.title}
          {category.description && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              - {category.description}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryPerformers.map((performer) => (
              <TableRow key={performer.id}>
                <TableCell className="font-medium">
                  {performer.name}
                </TableCell>
                <TableCell>{performer.title || "No title"}</TableCell>
                <TableCell>{performer.teamName}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {performer.ratingsCount > 0 ? (
                      <>
                        <StarRatingDisplay rating={performer.averageRating} />
                        <div className="text-sm text-gray-500">
                          {performer.ratingsCount}{" "}
                          {performer.ratingsCount === 1 ? "rating" : "ratings"}
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">No ratings yet</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/dashboard/teams/${performer.teamId}/members/${performer.id}`
                      )
                    }
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}