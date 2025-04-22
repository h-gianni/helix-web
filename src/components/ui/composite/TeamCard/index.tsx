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
import { Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import TeamActionsDialog from "@/app/dashboard/components/configuration/ConfigurationTeamActionsDialog";
import StarRating from "../../core/StarRating";
import Image from "next/image";
import TeamImage from "@/assets/shared/team04.svg";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";

const TEXT = {
  NO_PERFORMANCE_DATA: "No data available yet to show team performance rating",
  AVERAGE_PERFORMANCE: "Average team performance",
  NO_MEMBERS: "No members found. Please add members to the team.",
  MEMBER_SINGULAR: "member",
  MEMBERS_PLURAL: "members",
  TEAM_ACTIONS: "Team actions",
  EDIT: "Edit",
};

const MAX_AVATARS = 4;

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
  size?: "sm" | "base" | "lg" | "full";
  showImage?: boolean;
  showActions?: boolean;
  onClick?: () => void;
  onRefineActions?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function TeamCard({
  id,
  name,
  functions,
  members = [],
  averagePerformance,
  size = "base",
  showImage = true,
  showActions = false,
  onClick,
  onRefineActions,
  onEdit,
  className,
}: TeamCardProps) {
  const [isActionsDialogOpen, setIsActionsDialogOpen] = useState(false);
  const memberCount = members.length;
  const hasMembers = memberCount > 0;
  const hasPerformanceData = typeof averagePerformance === 'number';

  const handleRefineActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRefineActions) {
      onRefineActions();
    } else {
      setIsActionsDialogOpen(true);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const renderNoMembersAlert = () => {
    if (hasMembers) return null;
    
    return (
      <Alert variant="warning" className="mt-2">
        <AlertTriangle className="size-4" />
        <AlertDescription>
        {TEXT.NO_MEMBERS}
        </AlertDescription>
      </Alert>
    );
  };

  const renderAvatarGroup = () => {
    if (!hasMembers) return null;
    
    return (
      <div className="flex items-center gap-2">
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
            <div className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-neutral-100 text-2xs font-medium leading-0 z-10">
              +{memberCount - MAX_AVATARS}
            </div>
          )}
        </div>
        <p className="body-sm font-medium">
          {memberCount} {memberCount === 1 ? TEXT.MEMBER_SINGULAR : TEXT.MEMBERS_PLURAL}
        </p>
      </div>
    );
  };

  const renderTeamImage = () => {
    if (!showImage) return null;

    const imageStyles = {
      sm: "h-12 md:h-12 w-auto mt-5 mx-6 aspect-auto",
      base: "h-12 md:h-18 w-auto mt-6 mx-6 aspect-auto",
      lg: "h-16 md:h-24 w-auto mt-6 mx-6 aspect-auto",
      full: "w-32 md:w-56 h-auto object-cover aspect-auto",
    };

    return (
      <Image
        src={TeamImage}
        alt={`${name} team image`}
        className={cn(
          imageStyles[size],
          !hasMembers && "opacity-20 transition-opacity"
        )}
      />
    );
  };

  const renderPerformanceRating = () => {
    if (!hasMembers) return null;
    
    return (
      <div className={cn(
        "flex flex-col md:flex-row md:items-center md:gap-2",
        size === "sm" && "flex-col"
      )}>
        {hasPerformanceData ? (
          <>
            <StarRating
              value={averagePerformance || 0}
              disabled
              size="sm"
              showRatingsCount={false}
              className="flex-shrink-0"
            />
            {size !== "sm" && (
              <span className="hidden md:inline caption text-foreground-weak">
                {TEXT.AVERAGE_PERFORMANCE}
              </span>
            )}
          </>
        ) : (
          <span className="caption text-foreground-muted">
            {TEXT.NO_PERFORMANCE_DATA}
          </span>
        )}
      </div>
    );
  };

  const renderActions = () => {
    if (!showActions) return null;

    return (
      <>
        <Button
          data-slot="button"
          variant="ghost"
          size="sm"
          onClick={handleRefineActions}
        >
          {TEXT.TEAM_ACTIONS}
        </Button>
        <Button
          data-slot="button"
          variant="ghost"
          size="sm"
          onClick={handleEdit}
        >
          {TEXT.EDIT}
        </Button>
      </>
    );
  };

  const CardActionsFooter = () => {
    if (!showActions) return null;

    return (
      <CardFooter
        data-slot="card-footer"
        className="justify-end border-t border-border-weak p-4"
      >
        {renderActions()}
      </CardFooter>
    );
  };

  const cardContent = {
    sm: (
      <>
        {renderTeamImage()}
        <CardHeader data-slot="card-header" size="base">
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent data-slot="card-content" className="space-y-3 -mt-2">
          <div className="flex flex-wrap gap-1">
            {functions.map((func) => (
              <Badge key={func} data-slot="badge" variant="info-light">
                {func}
              </Badge>
            ))}
          </div>
          <div className="flex-1 text-left">
            {hasMembers ? renderAvatarGroup() : renderNoMembersAlert()}
          </div>
          {renderPerformanceRating()}
        </CardContent>
        {showActions && <CardActionsFooter />}
      </>
    ),
    base: (
      <>
        {renderTeamImage()}
        <CardHeader data-slot="card-header">
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent data-slot="card-content" className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {functions.map((func) => (
              <Badge key={func} data-slot="badge" variant="info-light">
                {func}
              </Badge>
            ))}
          </div>
          <div className="flex-1 text-left space-y-1.5">
            {hasMembers ? renderAvatarGroup() : renderNoMembersAlert()}
          </div>
          {renderPerformanceRating()}
        </CardContent>
        {showActions && <CardActionsFooter />}
      </>
    ),
    lg: (
      <>
        {renderTeamImage()}
        <CardHeader data-slot="card-header">
          <h3 className="heading-2">{name}</h3>
        </CardHeader>
        <CardContent
          data-slot="card-content"
          className="flex flex-col gap-3 pt-4"
        >
          <div className="flex flex-wrap gap-1">
            {functions.map((func) => (
              <Badge key={func} data-slot="badge" variant="info-light">
                {func}
              </Badge>
            ))}
          </div>
          <div className="flex-1 text-left">
            {hasMembers ? renderAvatarGroup() : renderNoMembersAlert()}
          </div>
          {renderPerformanceRating()}
        </CardContent>
        {showActions && <CardActionsFooter />}
      </>
    ),
    full: (
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex justify-center md:justify-start md:p-8">
          {renderTeamImage()}
        </div>
        <div className="flex-1">
          <CardHeader data-slot="card-header">
            <div className="flex items-start justify-between">
              <div className="pt-4">
                <h3 className="heading-2">{name}</h3>
              </div>
              {showActions && (
                <div className="flex gap-2 md:hidden">{renderActions()}</div>
              )}
            </div>
          </CardHeader>
          <CardContent data-slot="card-content" className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-1">
              {functions.map((func) => (
                <Badge key={func} data-slot="badge" variant="info-light">
                  {func}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex-1">
                {hasMembers ? renderAvatarGroup() : renderNoMembersAlert()}
              </div>
              {hasMembers && (
                <div className="flex items-center gap-2">
                  {hasPerformanceData ? (
                    <>
                      <StarRating
                        value={averagePerformance || 0}
                        disabled
                        size="sm"
                        showRatingsCount={false}
                        className="flex-shrink-0"
                      />
                      <span className="hidden md:inline caption text-foreground-weak">
                        {TEXT.AVERAGE_PERFORMANCE}
                      </span>
                    </>
                  ) : (
                    <span className="caption text-foreground-muted">
                      {TEXT.NO_PERFORMANCE_DATA}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          {showActions && (
            <CardFooter
              data-slot="card-footer"
              className="justify-end border-t border-border-weak p-4 hidden md:flex"
            >
              {renderActions()}
            </CardFooter>
          )}
        </div>
      </div>
    ),
  };

  return (
    <>
      <Card
        data-slot="card"
        onClick={onClick}
        className={cn(
          "w-full overflow-hidden",
          onClick &&
            "hover:border-border-weak hover:shadow transition-all cursor-pointer",
          className
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