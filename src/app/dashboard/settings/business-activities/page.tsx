"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { ActivitiesSection } from "./_components/_activitiesSection";
import { Button } from "@/components/ui/core/Button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/core/ToggleGroup";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/core/Select";
import { PlusCircle, Import } from "lucide-react";
import { ActivityModal } from "./_components/_activityModal";

export default function BusinessActivitiesSettingsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefreshList, setShouldRefreshList] = useState(false);

  const breadcrumbItems = [
    { label: "Settings", href: "/dashboard/settings" },
    { label: "Business Activities" },
  ];

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleUpdate = useCallback(async () => {
    setShouldRefreshList(true);
    return Promise.resolve();
  }, []);

  return (
    <>
      <PageBreadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Business Activities"
        caption="Add all activities will be tracked in your business that are relevant to you and your teams."
        backButton={{
          onClick: () => router.push("/dashboard/settings/"),
        }}
        // actions={
        //   <Button
        //     variant="primary"
        //     onClick={() => setIsModalOpen(true)}
        //     leadingIcon={<PlusCircle />}
        //   >
        //     Add Activity
        //   </Button>
        // }
      />
      <main className="ui-layout-page-main">
        <div className="ui-view-controls-bar">
          <div className="flex gap-xs p-xxs">
            {/* <div className="ui-text-heading-5 text-foreground-weak">View:</div>
            <ToggleGroup type="single" defaultValue="left" className="gap-sm">
              <ToggleGroupItem value="a">All</ToggleGroupItem>
              <ToggleGroupItem value="b">Selected</ToggleGroupItem>
            </ToggleGroup> */}
          </div>
          <div>
            <Button
              size="sm"
              variant="default"
              onClick={() => setIsModalOpen(true)}
            >
              Add activity
            </Button>
          </div>
        </div>
        <ActivitiesSection
          onUpdate={handleUpdate}
          shouldRefresh={shouldRefreshList}
          onRefreshComplete={() => setShouldRefreshList(false)}
        />
      </main>

      <ActivityModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        activity={null}
        onUpdate={handleUpdate}
      />
    </>
  );
}
