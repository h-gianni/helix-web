// hooks/useMemberManagement.ts used in th eonboarding process

import { useState, useEffect, useCallback } from "react";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";

export interface Member {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
}

interface MemberFormErrors {
  fullName?: string;
  email?: string;
  jobTitle?: string;
}

interface UseMemberManagementReturn {
  members: Member[];
  formData: Omit<Member, "id">;
  formErrors: MemberFormErrors;
  selectedMemberId: string | null;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddMember: () => void;
  handleEditMember: (memberId: string) => void;
  handleRemoveMember: (memberId: string) => void;
  handleCancelEdit: () => void;
  validateMember: (data: Omit<Member, "id">) => MemberFormErrors;
}

export function useMemberManagement(): UseMemberManagementReturn {
  const { config, isStepComplete, updateTeamMembers } = useOnboardingConfig();
  const [members, setMembers] = useState<Member[]>(config.teamMembers || []);
  const [formData, setFormData] = useState<Omit<Member, "id">>({
    fullName: "",
    email: "",
    jobTitle: "",
  });
  const [formErrors, setFormErrors] = useState<MemberFormErrors>({});
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load members from localStorage on initialization
  useEffect(() => {
    if (isInitialized) return;

    try {
      const savedMembers = config.teamMembers;
      if (savedMembers.length > 0) {
        updateTeamMembers(config.teamMembers || []);
        setMembers(savedMembers || []);
      }
    } catch (error) {
      console.error("Error loading members:", error);
    }

    setIsInitialized(true);
  }, [isInitialized]);
  useEffect(() => {
    try {
      setMembers(config.teamMembers);
    } catch (error) {
      console.error("Error loading members:", error);
    }

    setIsInitialized(true);
  }, [config.teamMembers]);

  // Validate member data
  const validateMember = useCallback(
    (data: Omit<Member, "id">): MemberFormErrors => {
      const errors: MemberFormErrors = {};

      if (!data.fullName.trim()) {
        errors.fullName = "Full name is required";
      }

      if (!data.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Please enter a valid email address";
      } else {
        // Check for duplicate email
        const isDuplicate = (config.teamMembers || []).some(
          (member) =>
            member.email.toLowerCase() === data.email.toLowerCase() &&
            (isEditing ? member.id !== selectedMemberId : true)
        );

        if (isDuplicate) {
          errors.email = "This email is already used by another member";
        }
      }

      return errors;
    },
    [config.teamMembers, isEditing, selectedMemberId]
  );

  // Handle form input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear validation error when user types
      if (formErrors[name as keyof MemberFormErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [formErrors]
  );

  // Add or update a member
  const handleAddMember = useCallback(() => {
    // Validate form
    const errors = validateMember(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (isEditing && selectedMemberId) {
      // Update existing member
      updateTeamMembers(
        (config.teamMembers || []).map((member) =>
          member.id === selectedMemberId ? { ...member, ...formData } : member
        )
      );

      // Reset editing state
      setIsEditing(false);
      setSelectedMemberId(null);
    } else {
      // Add new member
      const newMember: Member = {
        id: `member-${Date.now()}`,
        ...formData,
      };

      updateTeamMembers([...(config.teamMembers || []), newMember]);
    }

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      jobTitle: "",
    });
  }, [
    formData,
    isEditing,
    selectedMemberId,
    config.teamMembers,
    validateMember,
  ]);

  // Select a member for editing
  const handleEditMember = useCallback(
    (memberId: string) => {
      const member = config.teamMembers.find((m) => m.id === memberId);
      if (member) {
        setSelectedMemberId(memberId);
        setIsEditing(true);
        setFormData({
          fullName: member.fullName,
          email: member.email,
          jobTitle: member.jobTitle || "",
        });
        setFormErrors({});
      }
    },
    [config.teamMembers]
  );

  // Remove a member
  const handleRemoveMember = useCallback(
    (memberId: string) => {
      updateTeamMembers([
        ...config.teamMembers.filter((member) => member.id !== memberId),
      ]);

      // If we're removing the member being edited, reset the form
      if (memberId === selectedMemberId) {
        handleCancelEdit();
      }
    },
    [selectedMemberId]
  );

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setSelectedMemberId(null);
    setFormData({
      fullName: "",
      email: "",
      jobTitle: "",
    });
    setFormErrors({});
  }, []);

  return {
    members,
    formData,
    formErrors,
    selectedMemberId,
    isEditing,
    handleInputChange,
    handleAddMember,
    handleEditMember,
    handleRemoveMember,
    handleCancelEdit,
    validateMember,
  };
}
