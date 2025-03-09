import React, { useState } from "react";
import { Button } from "@/components/ui/core/Button";
import { PenSquare } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/core/Card";
import { useConfigStore } from "@/store/config-store";
import OrganizationDialog from "./_organization-edit-dialog";

interface OrganizationSummaryProps {
  onEdit?: () => void; // Optional or required, depending on your needs
}

function OrganizationSummary({ onEdit }: OrganizationSummaryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const orgName = useConfigStore((state) => state.config.organization.name);

  return (
    <>
      <Card data-slot="card">
        <CardHeader
          data-slot="card-header"
          className="flex flex-row items-center justify-between"
        >
          <CardTitle data-slot="card-title">Organization Details</CardTitle>
          <Button
            data-slot="button"
            variant="ghost"
            onClick={() => {
              setIsDialogOpen(true);
              onEdit?.();
            }}
          >
            <PenSquare /> Edit
          </Button>
        </CardHeader>

        <CardContent data-slot="card-content">
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
}

export default OrganizationSummary;
