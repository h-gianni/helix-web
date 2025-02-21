import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/core/Input';
import { Button } from '@/components/ui/core/Button';
import { Label } from '@/components/ui/core/Label';
import { Checkbox } from '@/components/ui/core/Checkbox';
import { activityCategories, activityData } from "@/data/org-activity-data";

interface Team {
  id: string;
  name: string;
  functions: string[];
}

interface TeamSetupProps {
  selectedActivities: string[];
}

const TeamSetup = ({ selectedActivities }: TeamSetupProps) => {
  const selectedFunctions = [...new Set(
    Object.entries(activityData)
      .filter(([key, activities]) => 
        activities.some(activity => selectedActivities.includes(activity)) &&
        activityCategories.core.some(category => category.key === key)
      )
      .map(([key]) => key)
  )];

  const [teams, setTeams] = useState<Team[]>([{ 
    id: '1', 
    name: '', 
    functions: selectedFunctions 
  }]);

  const handleTeamNameChange = (teamId: string, name: string) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, name } : team
    ));
  };

  const handleFunctionToggle = (teamId: string, functionName: string) => {
    setTeams(prev => prev.map(team => {
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
    setTeams(prev => [...prev, { 
      id: String(Date.now()), 
      name: '', 
      functions: selectedFunctions 
    }]);
  };

  const removeTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  };

  return (
    <div className="space-y-6">
      {teams.map((team) => (
        <div key={team.id} className="rounded-lg border p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-full">
                <Label htmlFor={`team-name-${team.id}`}>Team name</Label>
                <Input
                  id={`team-name-${team.id}`}
                  value={team.name}
                  onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                  placeholder="Enter team name"
                  className="mt-1.5"
                />
              </div>
              {teams.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-4 text-destructive hover:text-destructive hover:bg-destructive/10"
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
              <div className="space-y-2">
                <Label>Team functions</Label>
                <div className="space-y-2">
                  {selectedFunctions.map((func) => (
                    <div key={func} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${team.id}-${func}`}
                        checked={team.functions.includes(func)}
                        onCheckedChange={() => handleFunctionToggle(team.id, func)}
                      />
                      <label
                        htmlFor={`${team.id}-${func}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {func}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={addTeam}
        className="w-full"
      >
        <Plus className="mr-2" />
        Add another team
      </Button>
    </div>
  );
};

export default TeamSetup;