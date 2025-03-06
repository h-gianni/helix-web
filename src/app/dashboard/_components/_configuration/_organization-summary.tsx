import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/core/Button";
import { PenSquare } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/core/Card";
import { useConfigStore } from '@/store/config-store';
import OrganizationDialog from './_organization-edit-dialog';
import { useProfileSync,useProfileStore , useProfile} from '@/store/user-store';


const OrganizationSummary = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //const orgName = useConfigStore((state) => state.config.organization.name);
  // const { orgName, setOrgName, initializeFromProfile } = useProfileStore();
  const [orgNameValue, setOrgNameValue] = useState('');
  const { data: profile, isLoading, error } = useProfile();

  
  useEffect(() => {
    // Debug logging to see what's coming back from the API
    console.log("Profile data:", profile);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
    
    // Check if profile exists and has the expected structure
    if (profile) {
      // The most likely field names based on your API
      // Let's try different possible property names
      if (profile.orgName && profile.orgName.length > 0) {
        setOrgNameValue(profile.orgName[0].name);
        console.log("Found orgName in profile.orgNames[0]:", profile.orgName[0].name);
      } else if (profile.orgName && profile.orgName.length > 0) {
        setOrgNameValue(profile.orgName[0].name);
        console.log("Found orgName in profile.orgName[0]:", profile.orgName[0].name);
      } else if (profile.orgName) {
        console.log("orgNames exists but is empty or not an array:", profile.orgName);
      } else if (profile.orgName) {
        console.log("orgName exists but is empty or not an array:", profile.orgName);
      } else {
        // Check all top-level keys to find the organization data
        console.log("All profile keys:", Object.keys(profile));
        
        // Try to find any field that might contain "org" in its name
        const orgRelatedFields = Object.keys(profile).filter(key => 
          key.toLowerCase().includes('org')
        );
        console.log("Org-related fields:", orgRelatedFields);
      }
    }
  }, [profile, isLoading, error]);

if (isLoading) {
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
          <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
            <PenSquare /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-base">
            <span className="font-medium">Name: </span>
            <span>{profile?.orgName[0].name}</span>
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