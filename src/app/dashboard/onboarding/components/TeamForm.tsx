// app/dashboard/onboarding/components/TeamForm.tsx

import React, { useRef, useMemo } from "react";
import { Button } from "@/components/ui/core/Button";
import {
  Plus,
  Save,
  SquareCheck,
  Square,
  AlertCircle,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/core/Tooltip";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
}

interface TeamFormProps {
  teamName: string;
  selectedFunctions: string[];
  selectedMembers: string[];
  formError: string;
  formErrors: {
    teamName?: string;
    functions?: string;
    members?: string;
  };
  isEditing: boolean;
  members: TeamMember[];
  displayCategories: string[];
  onTeamNameChange: (name: string) => void;
  onFunctionToggle: (categoryId: string, checked: boolean) => void;
  onMemberToggle: (memberId: string, checked: boolean) => void;
  onCreateTeam: () => void;
  onUpdateTeam: () => void;
  onCancelEdit: () => void;
  getCategoryNameById: (categoryId: string) => string | undefined;
  getActionCountForCategory: (categoryId: string) => number;
  assignedMemberIds?: string[];
  allMembersAssigned?: boolean;
}

export default function TeamForm({
  teamName,
  selectedFunctions,
  selectedMembers,
  formError,
  formErrors = {},
  isEditing,
  members,
  displayCategories,
  onTeamNameChange,
  onFunctionToggle,
  onMemberToggle,
  onCreateTeam,
  onUpdateTeam,
  onCancelEdit,
  getCategoryNameById,
  getActionCountForCategory,
  assignedMemberIds = [],
  allMembersAssigned = false,
}: TeamFormProps) {
  const teamNameInputRef = useRef<HTMLInputElement>(null);

  // Memoize computed values to prevent recalculations on re-renders
  const availableMembers = useMemo(() => {
    return members.filter(
      (member) =>
        !assignedMemberIds.includes(member.id) ||
        selectedMembers.includes(member.id)
    );
  }, [members, assignedMemberIds, selectedMembers]);

  const sortedCategories = useMemo(() => {

   

    return [...displayCategories].sort((a, b) => {
      const nameA = getCategoryNameById(a) || "";
      const nameB = getCategoryNameById(b) || "";
      return nameA.localeCompare(nameB);
    });
  }, [displayCategories, getCategoryNameById]);

  // Focus the team name input on mount when creating a new team
  React.useEffect(() => {
    console.log('displayCategories:', displayCategories);
    if (!isEditing && teamNameInputRef.current) {
      teamNameInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <div className="p-8 space-y-4">
        <h3 className="heading-3">
          {isEditing ? "Edit Team" : "Create New Team"}
        </h3>

        <div className="flex flex-col gap-6">
          {/* Team info column */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="team-name">
                Team Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="team-name"
                inputSize="xl"
                value={teamName}
                onChange={(e) => onTeamNameChange(e.target.value)}
                placeholder="Give your team a descriptive name"
                ref={teamNameInputRef}
                className={formErrors.teamName ? "border-destructive" : ""}
                aria-invalid={Boolean(formErrors.teamName)}
                aria-errormessage={
                  formErrors.teamName ? "team-name-error" : undefined
                }
              />
              {formErrors.teamName && (
                <p
                  id="team-name-error"
                  className="text-destructive text-xs mt-1"
                >
                  {formErrors.teamName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 divide-x divide-border-weak">
            {/* Members column */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <h3 className="heading-4">
                  Team Members{" "}
                  {!isEditing && <span className="text-primary">*</span>}
                </h3>
                {formErrors.members && (
                  <p className="text-destructive text-xs">
                    {formErrors.members}
                  </p>
                )}
              </div>

              {members.length > 0 ? (
                <div className="space-y-4 overflow-y-auto">
                  {members.map((member) => {
                    const isChecked = selectedMembers.includes(member.id);
                    // Check if member is already assigned to another team
                    // Exception: if we're editing, don't disable members that are part of current selection
                    const isAssigned =
                      assignedMemberIds.includes(member.id) &&
                      (!isEditing || !selectedMembers.includes(member.id));

                    // Determine if the member can be selected/deselected
                    const isDisabled = isAssigned;

                    return (
                      <TooltipProvider key={`member-${member.id}`}>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "flex items-center gap-2 group",
                                isDisabled
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-pointer"
                              )}
                              onClick={() => {
                                if (!isDisabled) {
                                  onMemberToggle(member.id, !isChecked);
                                }
                              }}
                              role="checkbox"
                              aria-checked={isChecked}
                              aria-disabled={isDisabled}
                              tabIndex={isDisabled ? -1 : 0}
                              onKeyDown={(e) => {
                                if (
                                  !isDisabled &&
                                  (e.key === "Enter" || e.key === " ")
                                ) {
                                  e.preventDefault();
                                  onMemberToggle(member.id, !isChecked);
                                }
                              }}
                            >
                              <div className="size-5 flex items-center">
                                {isChecked ? (
                                  <SquareCheck className="text-primary-500 size-5" />
                                ) : isDisabled ? (
                                  <div className="relative">
                                    <Lock className="text-neutral-300 size-5" />
                                  </div>
                                ) : (
                                  <Square className="text-neutral-300 size-5" />
                                )}
                              </div>
                              <Label
                                className={cn(
                                  "flex-1",
                                  isDisabled
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                )}
                              >
                                {member.fullName}
                              </Label>
                            </div>
                          </TooltipTrigger>
                          {isDisabled && (
                            <TooltipContent side="top">
                              <p className="text-xs">
                                Member already assigned to another team
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    No members available. Please go back and add team members
                    first.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Functions column */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <h3 className="heading-4">
                  Team Function/s <span className="text-primary">*</span>
                </h3>
                {formErrors.functions && (
                  <p className="text-destructive text-xs">
                    {formErrors.functions}
                  </p>
                )}
              </div>

              {sortedCategories.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {sortedCategories.map((categoryId) => {
                    const categoryName = getCategoryNameById(categoryId);
                    const isChecked = selectedFunctions.includes(categoryId);
                    const actionCount = getActionCountForCategory(categoryId);

                    return (
                      <div
                        key={`function-${categoryId}`}
                        className="flex items-center gap-2 group cursor-pointer"
                        onClick={() => onFunctionToggle(categoryId, !isChecked)}
                        role="checkbox"
                        aria-checked={isChecked}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onFunctionToggle(categoryId, !isChecked);
                          }
                        }}
                      >
                        <div className="size-5 flex items-center">
                          {isChecked ? (
                            <SquareCheck className="text-primary-500 size-5" />
                          ) : (
                            <Square className="text-neutral-300 size-5" />
                          )}
                        </div>
                        <Label className="cursor-pointer flex-1">
                          {categoryName} ({actionCount})
                        </Label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    No function categories with selected actions. Please go back
                    and select function actions.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>

        {/* Warning about all members being assigned */}
        {allMembersAssigned && members.length > 0 && (
          <div className="pt-4 -mb-0">
            <Alert variant="warning">
              <AlertCircle className="size-4" />
              <AlertDescription>
                All members have been assigned to teams.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="pt-4 flex flex-row-reverse gap-3">
          {isEditing ? (
            <>
              <Button
                variant="primary"
                onClick={onUpdateTeam}
                size="xl"
                className="w-full"
              >
                Update Team
              </Button>
              <Button
                variant="default"
                onClick={onCancelEdit}
                size="xl"
                className="w-full"
              >
                Cancel Edit
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={onCreateTeam}
              size="xl"
              className="w-full"
            >
              <Plus /> Create Team
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
