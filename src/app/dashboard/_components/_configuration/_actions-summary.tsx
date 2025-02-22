import React from 'react';
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/core/Accordion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/core/Card";
import { PenSquare } from "lucide-react";
import { activityData } from "@/data/org-actions-data";
import { useConfigStore } from '@/store/config-store';

interface OrgActionsSummaryProps {
  onEdit: () => void;
}

const OrgActionsSummary: React.FC<OrgActionsSummaryProps> = ({ onEdit }) => {
  const selectedActivities = useConfigStore((state) => state.config.activities.selected);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Organisation's actions</CardTitle>
        <Button variant="ghost" onClick={onEdit}>
          <PenSquare /> Edit
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-1">
          {Object.entries(activityData)
            .filter(([key, activities]) =>
              activities.some((activity) => selectedActivities.includes(activity))
            )
            .map(([category, activities]) => (
              <AccordionItem
                key={category}
                value={category}
                className="border-b px-0"
              >
                <AccordionTrigger className="py-2">
                  <div className="flex justify-between items-center gap-2 w-full pr-4">
                    <span className="font-medium capitalize">{category}</span>
                    <Badge variant="secondary">
                      {activities.filter((a) => selectedActivities.includes(a)).length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pb-2">
                    {activities
                      .filter((activity) => selectedActivities.includes(activity))
                      .map((activity) => (
                        <li key={activity} className="text-sm text-foreground-weak">
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
  );
};

export default OrgActionsSummary;