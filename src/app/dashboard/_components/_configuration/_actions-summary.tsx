import React, { useState } from 'react';
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/core/Accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/core/Card";
import { PenSquare } from "lucide-react";
import { activityData } from "@/data/org-actions-data";
import { useConfigStore } from '@/store/config-store';
import ActionsDialog from './_actions-edit-dialog';

interface OrgActionsSummaryProps {
  onEdit?: () => void;
}

function OrgActionsSummary({ onEdit }: OrgActionsSummaryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const selectedActivities = useConfigStore((state) => state.config.activities.selected);

  return (
    <>
      <Card data-slot="card">
        <CardHeader data-slot="card-header" className="flex flex-row items-center justify-between">
          <CardTitle data-slot="card-title">Organisation's actions</CardTitle>
          <Button data-slot="button" variant="ghost" 
                      onClick={() => {
                        setIsDialogOpen(true);
                        onEdit?.();
                      }}
          >
            <PenSquare className="size-4" /> Edit
          </Button>
        </CardHeader>
        <CardContent data-slot="card-content">
          <Accordion type="multiple" className="space-y-1">
            {Object.entries(activityData)
              .filter(([key, activities]) =>
                activities.some((activity) => selectedActivities.includes(activity))
              )
              .map(([category, activities]) => (
                <AccordionItem
                  key={category}
                  value={category}
                  data-slot="accordion-item"
                  className="border-b px-0"
                >
                  <AccordionTrigger data-slot="accordion-trigger" className="py-2">
                    <div className="flex justify-between items-center gap-2 w-full pr-4">
                      <span className="font-medium capitalize">{category}</span>
                      <Badge data-slot="badge" variant="secondary">
                        {activities.filter((a) => selectedActivities.includes(a)).length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent data-slot="accordion-content">
                    <ul className="space-y-2 pb-2">
                      {activities
                        .filter((activity) => selectedActivities.includes(activity))
                        .map((activity) => (
                          <li key={activity} className="text-sm">
                            {activity}
                          </li>
                        ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </CardContent>
      </Card>

      <ActionsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}

export default OrgActionsSummary;