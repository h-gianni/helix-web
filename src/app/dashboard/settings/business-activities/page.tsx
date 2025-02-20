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
import { Plus, Import } from "lucide-react";
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
        title="Org Activities"
        caption="Select the activities relevant to your organisation so you can rate the team members' performance on what is relevant to the organization."
        backButton={{
          onClick: () => router.push("/dashboard/settings/"),
        }}
        actions={
          <Button variant="default" onClick={() => setIsModalOpen(true)}>
            <Plus /> Add Activity
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

      <ActivityModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        activity={null}
        onUpdate={handleUpdate}
      />
    </>
  );
}
