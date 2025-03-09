"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/composite/Page-header";
import { ActivitiesSection } from "../../_components/_business-activities/_actions-section";
import { Button } from "@/components/ui/core/Button";
import { Plus } from "lucide-react";
import { ActivityModal } from "../../_components/_business-activities/_actions-modal";

export default function BusinessActivitiesSettingsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefreshList, setShouldRefreshList] = useState(false);

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
      {/* 
        If you’d like to display breadcrumbs, you can uncomment or re-enable
        <PageBreadcrumbs items={[{ label: "Settings", href: "/dashboard/settings" }, { label: "Business Activities" }]} />
      */}

      <PageHeader
        title="Org Activities"
        caption="Select the activities relevant to your organisation so you can rate the team members' performance on what is relevant to the organization."
        backButton={{
          onClick: handleBackClick,
        }}
        actions={
          <Button data-slot="button" variant="default" onClick={() => setIsModalOpen(true)}>
            {/* Replaced any h-4 w-4 with size-4 */}
            <Plus className="size-4" /> Add Activity
          </Button>
        }
      />

      <main className="layout-page-main">
        <ActivitiesSection
          onUpdate={handleUpdate}
          shouldRefresh={shouldRefreshList}
          onRefreshComplete={() => setShouldRefreshList(false)}
        />
      </main>

      {/* Conditionally render the modal only when open */}
      {isModalOpen && (
        <ActivityModal
          data-slot="activity-modal"
          isOpen={true}
          onClose={handleModalClose}
          activity={null}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
