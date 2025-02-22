import React, { useState } from 'react';
import { Button } from "@/components/ui/core/Button";
import TeamCard from "@/components/ui/composite/Team-card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/core/Table";
import { Badge } from "@/components/ui/core/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/core/Avatar";
import { PenSquare } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/core/Card";
import { useConfigStore } from '@/store/config-store';
import TeamActionsDialog from './_team-actions-dialog';

interface Team {
  id: string;
  name: string;
  functions: string[];
}

interface TeamMember {
  id: string;
  name: string;
}

interface TeamsSummaryProps {
  onEdit: () => void;
  variant?: 'setup' | 'settings';
}

const MAX_AVATARS = 3;

const TeamsSummary: React.FC<TeamsSummaryProps> = ({ onEdit, variant = 'settings' }) => {
  const teams = useConfigStore((state) => state.config.teams);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleRefineActions = (team: Team) => {
    setSelectedTeam(team);
  };

  const renderAvatarGroup = (members: TeamMember[] = []) => (
    <div className="flex items-center gap-2">
      {members.length > 0 && (
        <div className="flex -space-x-2">
          {members.slice(0, MAX_AVATARS).map((member) => (
            <Avatar 
              key={member.id} 
              className="h-6 w-6 border-2 border-background"
            >
              <AvatarFallback className="text-xs">
                {member.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          ))}
          {members.length > MAX_AVATARS && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
              +{members.length - MAX_AVATARS}
            </div>
          )}
        </div>
      )}
      <p className="body-sm text-foreground-weak">
        {members.length} {members.length === 1 ? 'member' : 'members'}
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Teams</CardTitle>
        <Button variant="ghost" onClick={onEdit}>
          <PenSquare /> Edit
        </Button>
      </CardHeader>
      <CardContent>
        {teams.length <= 3 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                functions={team.functions}
                size={variant === 'setup' ? 'sm' : 'base'}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team name</TableHead>
                <TableHead>Functions</TableHead>
                {variant === 'settings' && (
                  <>
                    <TableHead>Members</TableHead>
                    <TableHead className="w-[200px]">Actions</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {team.functions.map((func) => (
                        <Badge key={func} variant="secondary">
                          {func}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  {variant === 'settings' && (
                    <>
                      <TableCell>
                        {renderAvatarGroup([])} {/* Pass actual members when available */}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRefineActions(team)}
                          >
                            Refine actions
                          </Button>
                          <Button variant="ghost" size="sm" onClick={onEdit}>
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {selectedTeam && (
        <TeamActionsDialog
          isOpen={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
          team={selectedTeam}
        />
      )}
    </Card>
  );
};

export default TeamsSummary;