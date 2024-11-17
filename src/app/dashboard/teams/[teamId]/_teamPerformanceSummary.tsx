// app/dashboard/teams/[teamId]/_teamPerformanceSummary.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MoreVertical,
  Star,
} from "lucide-react";

interface MemberPerformance {
  id: string;
  name: string;
  title: string | null;
  averageRating: number;
  ratingsCount: number;
}

interface PerformanceCategory {
  label: string;
  minRating: number;
  maxRating: number;
  className: string;
  Icon: React.ComponentType<any>;
}

interface TeamPerformanceSummaryProps {
  teamId: string;
  teamName: string;
  members: MemberPerformance[];
}

const performanceCategories: PerformanceCategory[] = [
  {
    label: "Top",
    minRating: 4.6,
    maxRating: 5,
    className: "text-green-600",
    Icon: (props: any) => (
      <TrendingUp className="w-5 h-5 text-green-600" {...props} />
    ),
  },
  {
    label: "Strong",
    minRating: 4,
    maxRating: 4.5,
    className: "text-emerald-600",
    Icon: (props: any) => (
      <TrendingUp className="w-5 h-5 text-emerald-600" {...props} />
    ),
  },
  {
    label: "Solid",
    minRating: 3,
    maxRating: 3.9,
    className: "text-blue-600",
    Icon: (props: any) => (
      <TrendingUp className="w-5 h-5 text-blue-600" {...props} />
    ),
  },
  {
    label: "Lower",
    minRating: 2.1,
    maxRating: 2.9,
    className: "text-amber-600",
    Icon: (props: any) => (
      <TrendingDown className="w-5 h-5 text-amber-600" {...props} />
    ),
  },
  {
    label: "Poor",
    minRating: 1,
    maxRating: 2,
    className: "text-red-600",
    Icon: (props: any) => (
      <TrendingDown className="w-5 h-5 text-red-600" {...props} />
    ),
  },
];

const getPerformanceCategory = (
  rating: number,
  ratingsCount: number
): PerformanceCategory => {
  if (ratingsCount === 0) {
    return {
      label: "No Ratings",
      minRating: 0,
      maxRating: 0,
      className: "text-gray-500",
      Icon: (props: any) => (
        <Minus className="w-5 h-5 text-gray-500" {...props} />
      ),
    };
  }

  return (
    performanceCategories.find(
      (category) => rating >= category.minRating && rating <= category.maxRating
    ) || {
      label: "Unknown",
      minRating: 0,
      maxRating: 0,
      className: "text-gray-500",
      Icon: (props: any) => (
        <Minus className="w-5 h-5 text-gray-500" {...props} />
      ),
    }
  );
};

const StarRatingDisplay = ({
  rating,
  ratingsCount,
}: {
  rating: number;
  ratingsCount: number;
}) => {
  if (ratingsCount === 0) {
    return <span className="text-sm text-gray-500">No ratings yet</span>;
  }

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

export function TeamPerformanceSummary({
  teamId,
  teamName,
  members,
}: TeamPerformanceSummaryProps) {
  const router = useRouter();
  const [memberToDelete, setMemberToDelete] =
    useState<MemberPerformance | null>(null);

  // Check if there are no members and return null
  if (!members || members.length === 0) {
    return null;
  }

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      const response = await fetch(
        `/api/teams/${teamId}/members/${memberToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        // Refresh the page to show updated member list
        window.location.reload();
      } else {
        throw new Error(data.error || "Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      // You might want to add error handling UI here
    } finally {
      setMemberToDelete(null);
    }
  };

  // Sort members: rated members first (by rating), then unrated members
  const sortedMembers = [...members].sort((a, b) => {
    if (a.ratingsCount === 0 && b.ratingsCount === 0) return 0;
    if (a.ratingsCount === 0) return 1;
    if (b.ratingsCount === 0) return -1;
    return b.averageRating - a.averageRating;
  });

  return (
    <>
      <Card>
        <CardHeader>
          {/* <CardTitle className="text-lg font-semibold">
            Team {teamName} Performers
          </CardTitle> */}
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sr-only">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Ratings</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.map((member) => {
                const category = getPerformanceCategory(
                  member.averageRating,
                  member.ratingsCount
                );
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Avatar className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                          router.push(
                            `/dashboard/teams/${teamId}/members/${member.id}`
                          )
                        }
                      >
                        {member.name}
                      </button>
                    </TableCell>
                    <TableCell>{member.title || "No title"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {category.Icon && <category.Icon />}
                        <span className={`${category.className} font-medium`}>
                          {category.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarRatingDisplay
                        rating={member.averageRating}
                        ratingsCount={member.ratingsCount}
                      />
                    </TableCell>
                    <TableCell>To be added</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button>
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/teams/${teamId}/members/${member.id}`
                              )
                            }
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              console.log("Generate review clicked")
                            }
                          >
                            Generate Performance Review
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setMemberToDelete(member)}
                            className="text-red-500"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToDelete}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToDelete?.name} from the
              team? This action cannot be undone. All associated ratings and
              performance data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
