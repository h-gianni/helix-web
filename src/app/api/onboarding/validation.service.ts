import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/types/api";
import { CompleteOnboardingInput } from "./route";

export interface ValidationResult {
  isValid: boolean;
  response?: NextResponse;
}

export const validateOnboardingInput = (
  input: CompleteOnboardingInput
): ValidationResult => {
  const { organization, teams, teamMembers } = input;

  // Validate organization
  if (!organization?.name?.trim()) {
    return {
      isValid: false,
      response: NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Organization name is required" },
        { status: 400 }
      ),
    };
  }

  // Validate teams
  if (!teams || teams.length === 0) {
    return {
      isValid: false,
      response: NextResponse.json<ApiResponse<never>>(
        { success: false, error: "At least one team is required" },
        { status: 400 }
      ),
    };
  }

  // Validate team members (optional validation)
  if (teamMembers && teamMembers.length > 0) {
    // Check if any team member is missing required fields
    for (const member of teamMembers) {
      if (!member.email?.trim() || !member.fullName?.trim()) {
        return {
          isValid: false,
          response: NextResponse.json<ApiResponse<never>>(
            {
              success: false,
              error: "Team members must have email and full name",
            },
            { status: 400 }
          ),
        };
      }
    }
  }

  // All validations passed
  return { isValid: true };
};
