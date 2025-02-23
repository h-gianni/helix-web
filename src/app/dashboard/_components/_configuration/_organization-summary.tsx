import React, { useState } from 'react';
import { Button } from "@/components/ui/core/Button";
import { PenSquare } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/core/Card";
import { useConfigStore } from '@/store/config-store';
import OrganizationDialog from './_organization-edit-dialog';

const OrganizationSummary = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const orgName = useConfigStore((state) => state.config.organization.name);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Organization Details</CardTitle>
          <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
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

      <OrganizationDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default OrganizationSummary;