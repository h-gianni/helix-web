"use client";

import React from "react";
import { Button } from "@/components/ui/core/Button";
import { Star } from "lucide-react";
import { usePerformanceRatingStore } from "@/store/performance-rating-store";
import PerformanceRatingModal from "@/app/dashboard/_component/_performanceRatingModal";

interface AddRatingButtonProps {
  teamId?: string;
  memberId?: string;
  memberName?: string;
  memberTitle?: string | null;
}

export default function AddRatingButton({
  teamId,
  memberId,
  memberName,
  memberTitle,
}: AddRatingButtonProps) {
  const { setIsOpen } = usePerformanceRatingStore();

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="primary"
        volume="loud"
        iconOnly={false}
        leadingIcon={<Star />}
        onClick={handleClick}
      >
        Rate Performance
      </Button>

      <PerformanceRatingModal 
        teamId={teamId}
        memberId={memberId}
        memberName={memberName}
        memberTitle={memberTitle}
      />
    </>
  );
}