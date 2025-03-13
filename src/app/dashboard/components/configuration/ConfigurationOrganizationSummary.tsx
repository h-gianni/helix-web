import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/core/Button";
import { PenSquare } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/core/Card";
import { useConfigStore } from "@/store/config-store";
import OrganizationDialog from "./ConfigurationOrganizationEditDialog";
import {
  useProfileSync,
  useProfileStore,
  useProfile,
} from "@/store/user-store";

interface OrganizationSummaryProps {
  onEdit?: () => void;
  variant?: "setup" | "settings";
}

function OrganizationSummary({
  onEdit,
  variant = "settings",
}: OrganizationSummaryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get organization name directly from config store
  const configStore = useConfigStore();
  const configOrgName = configStore.config.organization.name;

  // Use profile data for non-setup mode
  const { data: profile, isLoading, error } = useProfile();
  const [orgNameValue, setOrgNameValue] = useState("");

  // Determine which data source to use based on variant
  const useConfigData = variant === "setup";

  // Log the data sources for debugging
  useEffect(() => {
    console.log("OrganizationSummary - Config org name:", configOrgName);
    console.log("OrganizationSummary - Using config data:", useConfigData);

    if (!useConfigData && profile) {
      // Try to get org name from profile
      if (profile.orgName && profile.orgName.length > 0) {
        setOrgNameValue(profile.orgName[0]?.name);
        console.log("Found orgName in profile:", profile.orgName[0]?.name);
      } else if (profile.customFields?.organizationName) {
        setOrgNameValue(profile.customFields.organizationName);
        console.log(
          "Found orgName in customFields:",
          profile.customFields.organizationName
        );
      }
    }
  }, [profile, useConfigData, configOrgName]);

  // Get the organization name to display
  const displayOrgName = useConfigData ? configOrgName : orgNameValue;

  if (!useConfigData && isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-base">Loading organization details...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Organization Details</CardTitle>
          <Button
            variant="ghost"
            onClick={() => {
              setIsDialogOpen(true);
              onEdit?.();
            }}
          >
            <PenSquare className="size-4 mr-2" /> Edit
          </Button>
        </CardHeader>

        <CardContent data-slot="card-content">
          <div className="text-base">
            <span className="font-medium">Name: </span>
            <span>
              {displayOrgName || "[Please set your organization name]"}
            </span>
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
