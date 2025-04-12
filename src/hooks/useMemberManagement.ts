// hooks/useMemberManagement.ts used in th eonboarding process

import { useState, useEffect, useCallback } from 'react';

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
  formData: Omit<Member, 'id'>;
  formErrors: MemberFormErrors;
  selectedMemberId: string | null;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddMember: () => void;
  handleEditMember: (memberId: string) => void;
  handleRemoveMember: (memberId: string) => void;
  handleCancelEdit: () => void;
  validateMember: (data: Omit<Member, 'id'>) => MemberFormErrors;
}

export function useMemberManagement(): UseMemberManagementReturn {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    fullName: '',
    email: '',
    jobTitle: '',
  });
  const [formErrors, setFormErrors] = useState<MemberFormErrors>({});
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load members from localStorage on initialization
  useEffect(() => {
    if (isInitialized) return;

    try {
      const savedMembers = localStorage.getItem('onboarding_members');
      if (savedMembers) {
        setMembers(JSON.parse(savedMembers));
      }
    } catch (error) {
      console.error('Error loading members:', error);
    }

    setIsInitialized(true);
  }, [isInitialized]);

  // Save members to localStorage when they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('onboarding_members', JSON.stringify(members));
      } catch (error) {
        console.error('Error saving members:', error);
      }
    }
  }, [members, isInitialized]);

  // Validate member data
  const validateMember = useCallback((data: Omit<Member, 'id'>): MemberFormErrors => {
    const errors: MemberFormErrors = {};

    if (!data.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    } else {
      // Check for duplicate email
      const isDuplicate = members.some(
        member => 
          member.email.toLowerCase() === data.email.toLowerCase() && 
          (isEditing ? member.id !== selectedMemberId : true)
      );

      if (isDuplicate) {
        errors.email = 'This email is already used by another member';
      }
    }

    return errors;
  }, [members, isEditing, selectedMemberId]);

  // Handle form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error when user types
    if (formErrors[name as keyof MemberFormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [formErrors]);

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
      setMembers(
        members.map(member =>
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

      setMembers(prev => [...prev, newMember]);
    }

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      jobTitle: '',
    });
  }, [formData, isEditing, selectedMemberId, members, validateMember]);

  // Select a member for editing
  const handleEditMember = useCallback((memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMemberId(memberId);
      setIsEditing(true);
      setFormData({
        fullName: member.fullName,
        email: member.email,
        jobTitle: member.jobTitle || '',
      });
      setFormErrors({});
    }
  }, [members]);

  // Remove a member
  const handleRemoveMember = useCallback((memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));

    // If we're removing the member being edited, reset the form
    if (memberId === selectedMemberId) {
      handleCancelEdit();
    }
  }, [selectedMemberId]);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setSelectedMemberId(null);
    setFormData({
      fullName: '',
      email: '',
      jobTitle: '',
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