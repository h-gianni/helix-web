'use client'
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageBreadcrumbs } from "@/components/ui/composite/AppHeader";
import { PageHeader } from "@/components/ui/composite/PageHeader";
import { ActivitiesSection } from "./_components/_activitiesSection";
import { Button } from "@/components/ui/core/Button";
import { ActivityModal } from "./_components/_activityModal";

export default function BusinessActivitiesSettingsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefreshList, setShouldRefreshList] = useState(false);

  // Ensure breadcrumb items are properly typed
  const breadcrumbItems = [
    { 
      label: "Settings", 
      href: "/dashboard/settings" 
    },
    { 
      label: "Business Activities",
      href: undefined // explicitly set undefined for the current page
    }
  ] as const;

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleUpdate = useCallback(async () => {
    setShouldRefreshList(true);
    return Promise.resolve();
  }, []);

  const handleAddActivity = () => {
    setIsModalOpen(true);
  };

  const handleBackClick = () => {
    router.push("/dashboard/settings/");
  };

  return (
    <>
      {/* <PageBreadcrumbs items={breadcrumbItems} /> */}
      
      <PageHeader
        title="Business Activities"
        caption="Add all activities will be tracked in your business that are relevant to you and your teams."
        backButton={{
          onClick: handleBackClick,
        }}
      />

      <main className="ui-layout-page-main">
        <div className="ui-view-controls-bar flex items-center justify-between p-4 border-b">
          <div className="flex gap-2" />
          <div>
            <Button
              size="sm"
              variant="default"
              onClick={handleAddActivity}
            >
              Add activity
            </Button>
          </div>
        </div>

        <div className="p-4">
          <ActivitiesSection
            onUpdate={handleUpdate}
            shouldRefresh={shouldRefreshList}
            onRefreshComplete={() => setShouldRefreshList(false)}
          />
        </div>
      </main>

      {/* Only render modal when open to avoid unnecessary rendering */}
      {isModalOpen && (
        <ActivityModal
          isOpen={true}
          onClose={handleModalClose}
          activity={null}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}