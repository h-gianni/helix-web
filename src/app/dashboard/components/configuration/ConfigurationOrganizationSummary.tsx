import React, { useState } from "react";
import { Button } from "@/components/ui/core/Button";
import { Building2, Pen, PenSquare } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/core/Card";
import { useConfigStore } from "@/store/config-store";
import OrganizationDialog from "./ConfigurationOrganizationEditDialog";
import { useProfile, useUpdateOrgName } from "@/store/user-store";
import { Loader } from "@/components/ui/core/Loader";

interface OrganizationSummaryProps {
  onEdit?: () => void;
  variant?: "setup" | "settings";
}

function OrganizationSummary({
  onEdit,
  variant = "settings",
}: OrganizationSummaryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get organization name directly from config store for setup mode
  const configStore = useConfigStore();
  const configOrgName = configStore.config.organization.name;

  // Use React Query hook for API data
  const { data: profileData, isLoading, error } = useProfile();

  // Get org name from the profile data
  const orgName = profileData?.organization?.name || "";

  // Determine which data source to use based on variant
  const useConfigData = variant === "setup";

  // Get the organization name to display
  const displayOrgName = useConfigData ? configOrgName : orgName;

  const handleEdit = () => {
    setIsDialogOpen(true);
    onEdit?.();
  };

  if (!useConfigData && isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="loader">
            <Loader size="sm" label="Loading organization details..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <CardTitle>
            <div className="flex-shrink-0 mb-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-lightest">
                <Building2 className="size-5 text-primary" />
              </div>
            </div>
            {displayOrgName}
          </CardTitle>
          <Button variant="ghost" onClick={handleEdit}>
            <Pen />
          </Button>
        </CardHeader>

        {/* <CardContent data-slot="card-content">
          <div className="text-base">
            <span className="font-medium">Name: </span>
            <span>
              {displayOrgName || "[Please set your organization name]"}
            </span>
          </div>
        </CardContent> */}
      </Card>

      <OrganizationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}

export default OrganizationSummary;
