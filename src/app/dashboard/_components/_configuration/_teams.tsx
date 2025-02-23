import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/core/Input';
import { Button } from '@/components/ui/core/Button';
import { Label } from '@/components/ui/core/Label';
import { Card } from '@/components/ui/core/Card';
import { Checkbox } from '@/components/ui/core/Checkbox';
import { actionsCategories, activityData } from "@/data/org-actions-data";
import { useConfigStore } from '@/store/config-store';

interface Team {
  id: string;
  name: string;
  functions: string[];
}

const TeamSetup = () => {
  const selectedActivities = useConfigStore((state) => state.config.activities.selected);
  const updateTeams = useConfigStore((state) => state.updateTeams);
  const teams = useConfigStore((state) => state.config.teams);

  const selectedFunctions = [...new Set(
    Object.entries(activityData)
      .filter(([key, activities]) => 
        activities.some(activity => selectedActivities.includes(activity)) &&
        actionsCategories.core.some(category => category.key === key)
      )
      .map(([key]) => key)
  )];

  useEffect(() => {
    if (teams.length === 0) {
      updateTeams([{ 
        id: '1', 
        name: '', 
        functions: selectedFunctions 
      }]);
    }
  }, []);

  const handleTeamNameChange = (teamId: string, name: string) => {
    updateTeams(teams.map(team => 
      team.id === teamId ? { ...team, name } : team
    ));
  };

  const handleFunctionToggle = (teamId: string, functionName: string) => {
    updateTeams(teams.map(team => {
      if (team.id === teamId) {
        const functions = team.functions.includes(functionName)
          ? team.functions.filter(f => f !== functionName)
          : [...team.functions, functionName];
        return { ...team, functions };
      }
      return team;
    }));
  };

  const addTeam = () => {
    updateTeams([...teams, { 
      id: String(Date.now()), 
      name: '', 
      functions: selectedFunctions 
    }]);
  };

  const removeTeam = (teamId: string) => {
    updateTeams(teams.filter(team => team.id !== teamId));
  };

  return (
    <div className="space-y-6">
      {teams.map((team) => (
        <Card key={team.id}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-full space-y-1">
                <Label htmlFor={`team-name-${team.id}`}>Team name</Label>
                <Input
                  id={`team-name-${team.id}`}
                  value={team.name}
                  onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                  placeholder="Enter a fun or descriptive name"
                  className="max-w-copy-sm"
                />
              </div>
              {teams.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeTeam(team.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {selectedFunctions.length === 1 ? (
              <div className="text-sm text-foreground-muted">
                Team function: {selectedFunctions[0]}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label>Team functions</Label>
                <div className="flex gap-6">
                  {selectedFunctions.map((func) => {
                    const functionActivities = activityData[func].filter(activity => 
                      selectedActivities.includes(activity)
                    );
                    return (
                      <div key={func} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${team.id}-${func}`}
                          checked={team.functions.includes(func)}
                          onCheckedChange={() => {
                            const willUncheck = team.functions.includes(func);
                            const remainingFunctions = team.functions.filter(f => f !== func);
                            if (willUncheck && remainingFunctions.length === 0) {
                              return; // Prevent unchecking if it's the last function
                            }
                            handleFunctionToggle(team.id, func);
                          }}
                        />
                        <label
                          htmlFor={`${team.id}-${func}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {func} ({functionActivities.length})
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={addTeam}
        className="w-full"
      >
        <Plus />
        Add another team
      </Button>
    </div>
  );
};

export default TeamSetup;