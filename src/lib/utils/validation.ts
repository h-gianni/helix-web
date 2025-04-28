// lib/utils/validation.ts used in onboarding

import { TeamErrors } from "@/hooks/useTeams";

/**
 * Email validation utility
 */
export function isValidEmail(email: string): boolean {
  // RFC 5322 compliant email regex
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

/**
 * Member validation utility
 */
export interface MemberData {
  fullName: string;
  email: string;
  jobTitle?: string;
}

export interface MemberErrors {
  fullName?: string;
  email?: string;
  jobTitle?: string;
}

export function validateMember(
  data: MemberData, 
  existingMembers: Array<MemberData & { id: string }> = [],
  currentId?: string
): MemberErrors {
  const errors: MemberErrors = {};

  // Validate full name
  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.length > 100) {
    errors.fullName = 'Name must be less than 100 characters';
  }

  // Validate email
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  } else {
    // Check for duplicate email
    const isDuplicate = existingMembers.some(
      member => 
        member.email.toLowerCase() === data.email.toLowerCase() && 
        (currentId ? member.id !== currentId : true)
    );

    if (isDuplicate) {
      errors.email = 'This email is already used by another member';
    }
  }

  // Validate job title if provided
  if (data.jobTitle && data.jobTitle.length > 100) {
    errors.jobTitle = 'Job title must be less than 100 characters';
  }

  return errors;
}

/**
 * Team validation utility
 */
export interface TeamData {
  name: string;
  functions: string[];
  members: string[];
}

export function validateTeam(data: TeamData): TeamErrors {
  const errors: TeamErrors = {};
  
  // Validate team name
  if (!data.name.trim()) {
    errors.teamName = 'Team name is required';
  } else if (data.name.length > 100) {
    errors.teamName = 'Team name must be less than 100 characters';
  }
  
  // Validate functions
  if (data.functions.length === 0) {
    errors.functions = 'Please select at least one function';
  }
  
  // Validate members
  if (data.members.length === 0) {
    errors.members = 'Please select at least one team member';
  }
  
  return errors;
}

/**
 * Organisation validation utility
 */
export interface OrgErrors {
  name?: string;
}

export function validateOrganisation(name: string): OrgErrors {
  const errors: OrgErrors = {};
  
  if (!name.trim()) {
    errors.name = 'Organisation name is required';
  } else if (name.length > 100) {
    errors.name = 'Organisation name must be less than 100 characters';
  }
  
  return errors;
}