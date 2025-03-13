import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/core/Card";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { Users, Settings, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import TeamActionsDialog from "@/app/dashboard/components/configuration/ConfigurationTeamActionsDialog";

const MAX_AVATARS = 5;

interface TeamMember {
  id: string;
  name: string;
  email: string;
  title?: string | null;
}

interface TeamCardProps {
  id: string;
  name: string;
  functions: string[];
  categories?: string[];
  members?: TeamMember[];
  averagePerformance?: number;
  size?: "sm" | "base" | "lg";
  onClick?: () => void;
  onRefineActions?: () => void;
  onEdit?: () => void;
}

export function TeamCard({
  id,
  name,
  functions,
  members = [],
  averagePerformance,
  size = "base",
  onClick,
  onEdit,
}: TeamCardProps) {
  const [isActionsDialogOpen, setIsActionsDialogOpen] = useState(false);
  const memberCount = members.length;

  const renderAvatarGroup = () => (
    <div className="flex items-center gap-2">
      {memberCount > 0 && (
        <div className="flex -space-x-2">
          {members.slice(0, MAX_AVATARS).map((member) => (
            <Avatar
              key={member.id}
              data-slot="avatar"
              className="size-8 border-2 border-white"
            >
              <AvatarFallback data-slot="avatar-fallback" className="text-xs">
                {member.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          ))}
          {memberCount > MAX_AVATARS && (
            <div className="flex size-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
              +{memberCount - MAX_AVATARS}
            </div>
          )}
        </div>
      )}
      <p className="body-sm">
        {memberCount} {memberCount === 1 ? "member" : "members"}
      </p>
    </div>
  );

  const cardContent = {
    sm: (
      <>
      <CardHeader data-slot="card-header">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
        <CardContent data-slot="card-content" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {functions.map((func) => (
              <Badge key={func} data-slot="badge" variant="secondary">
                {func}
              </Badge>
            ))}
          </div>
        </CardContent>
      </>
    ),
    base: (
      <>
        <CardHeader data-slot="card-header">
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent data-slot="card-content" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {functions.map((func) => (
                <Badge key={func} data-slot="badge" variant="secondary">
                  {func}
                </Badge>
              ))}
            </div>
          {renderAvatarGroup()}
        </CardContent>
        <CardFooter
          data-slot="card-footer"
          className="justify-end border-t border-border-light p-2"
        >
          <Button
            data-slot="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsActionsDialogOpen(true);
            }}
          >
            <FileSpreadsheet className="size-4" />
            Refine actions
          </Button>
          <Button
            data-slot="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <Settings className="size-4" />
            Edit
          </Button>
        </CardFooter>
      </>
    ),
    lg: (
      <>
        <CardHeader data-slot="card-header">
          <div className="relative">
            <div className="space-y-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                <Users className="size-4" />
              </div>
              <h3 className="heading-2">{name}</h3>
            </div>
            <div className="absolute top-0 right-0 flex flex-wrap gap-2">
              {functions.map((func) => (
                <Badge key={func} data-slot="badge" variant="secondary">
                  {func}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent
          data-slot="card-content"
          className="flex flex-col gap-4 pt-0"
        >
          <div className="flex-1 text-left space-y-1.5">
            {renderAvatarGroup()}
          </div>
          <div className="text-sm">
            Average team performance:
            {averagePerformance?.toFixed(1) || "Not rated"}
          </div>
        </CardContent>
      </>
    ),
  };

  return (
    <>
      <Card
        data-slot="card"
        onClick={onClick}
        className={cn(
          "w-full",
          onClick &&
            "hover:border-border hover:shadow-base transition-all cursor-pointer"
        )}
      >
        {cardContent[size]}
      </Card>

      <TeamActionsDialog
        isOpen={isActionsDialogOpen}
        onClose={() => setIsActionsDialogOpen(false)}
        team={{ id, name, functions }}
      />
    </>
  );
}

export default TeamCard;
