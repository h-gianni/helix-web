import React, { useState } from 'react';
import { useOrgActions } from '@/hooks/use-org-actions';
import { Checkbox } from '@/components/ui/core/Checkbox';

interface OrgActionsProps {
  orgId: string;
  onActionsChange: (actions: any[]) => void;
}

export function OrgActions({ orgId, onActionsChange }: OrgActionsProps) {
  const { data, isLoading } = useOrgActions(orgId);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const handleActionToggle = (actionId: string) => {
    const newSelected = selectedActions.includes(actionId)
      ? selectedActions.filter(id => id !== actionId)
      : [...selectedActions, actionId];
    
    setSelectedActions(newSelected);
    onActionsChange(newSelected);
  };

  if (isLoading) return <div>Loading actions...</div>;

  return (
    <div className="space-y-4">
      {data?.data?.actions.map((action: any) => (
        <div key={action.id} className="flex items-center space-x-2">
          <Checkbox 
            checked={selectedActions.includes(action.id)}
            onCheckedChange={() => handleActionToggle(action.id)}
          />
          <span>{action.action.name}</span>
        </div>
      ))}
    </div>
  );
}
