import React from 'react';
import { Button } from "@/components/ui/core/Button";
import { PenSquare } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/core/Card";
import { useConfigStore } from '@/store/config-store';

interface OrganizationSummaryProps {
  onEdit: () => void;
}

const OrganizationSummary: React.FC<OrganizationSummaryProps> = ({ onEdit }) => {
  const orgName = useConfigStore((state) => state.config.organization.name);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Organization Details</CardTitle>
        <Button variant="ghost" onClick={onEdit}>
        <PenSquare /> Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-base">
          <span className="font-medium">Name: </span>
          <span>{orgName}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationSummary;