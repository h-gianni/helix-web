import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/core/Card";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { Users, Settings, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import TeamActionsDialog from '@/app/dashboard/_components/_configuration/_team-actions-dialog';

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
  members?: TeamMember[];
  averagePerformance?: number;
  size?: 'sm' | 'base' | 'lg';
  onClick?: () => void;
  onRefineActions?: () => void;
  onEdit?: () => void;
}

export const TeamCard = ({
  id,
  name,
  functions,
  members = [],
  averagePerformance,
  size = 'base',
  onClick,
  onEdit
}: TeamCardProps) => {
  const [isActionsDialogOpen, setIsActionsDialogOpen] = useState(false);
  const memberCount = members.length;

  const renderAvatarGroup = () => (
    <div className="flex items-center gap-2">
      {memberCount > 0 && (
        <div className="flex -space-x-2">
          {members.slice(0, MAX_AVATARS).map((member) => (
            <Avatar 
              key={member.id} 
              className="h-6 w-6 border-2 border-background"
            >
              <AvatarFallback className="text-xs">
                {member.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          ))}
          {memberCount > MAX_AVATARS && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
              +{memberCount - MAX_AVATARS}
            </div>
          )}
        </div>
      )}
      <p className="body-sm text-foreground-weak">
        {memberCount} {memberCount === 1 ? 'member' : 'members'}
      </p>
    </div>
  );

  const cardContent = {
    sm: (
      <>
        <CardContent className="space-y-4">
          <h3 className="heading-4">{name}</h3>
          <div className="flex flex-wrap gap-2">
            {functions.map((func) => (
              <Badge key={func} variant="secondary">{func}</Badge>
            ))}
          </div>
        </CardContent>
      </>
    ),
    base: (
      <>
        <CardContent className="space-y-4">
          <h3 className="heading-4">{name}</h3>
          {renderAvatarGroup()}
          <div className="flex flex-wrap gap-2">
            {functions.map((func) => (
              <Badge key={func} variant="secondary">{func}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              setIsActionsDialogOpen(true);
            }}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Refine actions
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <Settings className="h-4 w-4" />
            Edit
          </Button>
        </CardFooter>
      </>
    ),
    lg: (
      <>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start gap-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex flex-wrap gap-2">
              {functions.map((func) => (
                <Badge key={func} variant="secondary">{func}</Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4 pt-0">
          <div className="flex-1 text-left space-y-1.5">
            <h3 className="heading-2">{name}</h3>
            {renderAvatarGroup()}
          </div>
          <div className="text-sm text-foreground-muted">
            Average team performance:
            {averagePerformance?.toFixed(1) || "Not rated"}
          </div>
        </CardContent>
      </>
    )
  };

  return (
    <>
      <Card 
        onClick={onClick} 
        className={cn(
          "w-full",
          onClick && "hover:border-input hover:shadow transition-all cursor-pointer"
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
};

export default TeamCard;