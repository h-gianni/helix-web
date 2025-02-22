import React from 'react';
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { useConfigStore } from '@/store/config-store';

const OrganizationConfig = () => {
  const orgName = useConfigStore((state) => state.config.organization.name);
  const updateOrganization = useConfigStore((state) => state.updateOrganization);

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="org-name">Organisation name</Label>
        <Input
          type="text"
          id="org-name"
          value={orgName}
          onChange={(e) => updateOrganization(e.target.value)}
          placeholder="Enter organisation name"
        />
      </div>
    </div>
  );
};

export default OrganizationConfig;