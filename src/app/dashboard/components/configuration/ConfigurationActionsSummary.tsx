import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/core/Accordion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/core/Card";
import { PenSquare } from "lucide-react";
import { useConfigStore } from "@/store/config-store";
import { useActions } from "@/store/action-store";

interface OrgActionsSummaryProps {
  onEdit?: () => void;
  variant?: "setup" | "settings";
}

function OrgActionsSummary({
  onEdit,
  variant = "settings",
}: OrgActionsSummaryProps) {
  const { data: actionCategories, isLoading } = useActions();

  // Get the selected activities and categories from config store
  const selectedActivities = useConfigStore(
    (state) => state.config.activities.selected
  );
  const selectedByCategory = useConfigStore(
    (state) => state.config.activities.selectedByCategory
  );
  const organizationName = useConfigStore(
    (state) => state.config.organization.name
  );

  // Get action names for display
  const getActionNameById = (actionId: string) => {
    if (!actionCategories) return "Unknown Action";
    for (const category of actionCategories) {
      for (const action of category.actions) {
        if (action.id === actionId) {
          return action.name;
        }
      }
    }
    return "Unknown Action";
  };

  // Get category name for display
  const getCategoryNameById = (categoryId: string) => {
    if (!actionCategories) return "Loading...";
    const category = actionCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <>
      <Card data-slot="card">
        <CardHeader
          data-slot="card-header"
          className="flex flex-row items-center justify-between"
        >
          <CardTitle data-slot="card-title">
            {organizationName
              ? `${organizationName}'s actions`
              : "Organisation's actions"}
          </CardTitle>
          <Button
            data-slot="button"
            variant="ghost"
            onClick={onEdit}
          >
            <PenSquare /> Edit
          </Button>
        </CardHeader>
        <CardContent data-slot="card-content">
          {isLoading ? (
            <div className="text-center py-4 text-foreground-muted">
              Loading activities...
            </div>
          ) : !selectedActivities || selectedActivities.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-foreground-muted">
                No activities have been selected yet.
              </p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-1">
              {Object.entries(selectedByCategory || {})
                .filter(([_, activities]) => activities.length > 0)
                .map(([categoryId, activities]) => (
                  <AccordionItem
                    key={categoryId}
                    value={categoryId}
                    data-slot="accordion-item"
                    className="border-b px-0"
                  >
                    <AccordionTrigger
                      data-slot="accordion-trigger"
                      className="py-2"
                    >
                      <div className="flex justify-between items-center gap-2 w-full pr-4">
                        <span className="font-medium">
                          {getCategoryNameById(categoryId)}
                        </span>
                        <Badge data-slot="badge" variant="secondary">
                          {activities.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent data-slot="accordion-content">
                      <ul className="space-y-2 pb-2">
                        {activities.map((actionId) => (
                          <li key={actionId} className="text-sm">
                            {getActionNameById(actionId)}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default OrgActionsSummary;