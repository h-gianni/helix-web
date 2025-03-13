"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Label } from "@/components/ui/core/Label";
import { Checkbox } from "@/components/ui/core/Checkbox";
import { Loader } from "@/components/ui/core/Loader";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/core/Table";
import { Textarea } from "@/components/ui/core/Textarea";
import { Alert } from "@/components/ui/core/Alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/core/RadioGroup";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/core/Select";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import type { BusinessActivityResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import {
  useActivityCategories,
  useCreateActivity,
  useUpdateActivity,
  useImportActivities,
  useActivityModalStore,
} from "@/store/activity-modal-store";
import { useCategories } from "@/store/category-store";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: BusinessActivityResponse | null;
  onUpdate?: () => Promise<void>;
}

export function ActivityModal({
  isOpen,
  onClose,
  activity,
  onUpdate,
}: ActivityModalProps) {
  const {
    formData,
    dragActive,
    setFormData,
    setDragActive,
    reset,
    hasChanges,
  } = useActivityModalStore();

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const importActivities = useImportActivities();

  const isSubmitting =
    createActivity.isPending ||
    updateActivity.isPending ||
    importActivities.isPending;
  const error =
    createActivity.error || updateActivity.error || importActivities.error;

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.activity.name,
        description: activity.activity.description || "",
        activityType: "from-scratch",
      });
    } else {
      reset();
    }
  }, [activity, isOpen, setFormData, reset]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file?.type === "text/csv") {
      setFormData({ uploadedFile: file });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "text/csv") {
      setFormData({ uploadedFile: file });
    }
  };

  const handleSubmit = async () => {
    try {
      switch (formData.activityType) {
        case "from-import":
          if (formData.uploadedFile) {
            await importActivities.mutateAsync(formData.uploadedFile);
          }
          break;

        case "from-categories":
          if (formData.selectedCategories.length > 0) {
            // Create activities from selected categories
            await createActivity.mutateAsync({
              name: formData.name.trim(),
              categoryIds: formData.selectedCategories,
            });
          }
          break;

        case "from-scratch":
        default:
          if (activity) {
            // Editing an existing activity
            await updateActivity.mutateAsync({
              id: activity.id,
              name: formData.name.trim(),
              description: formData.description.trim() || undefined,
              impactScale: formData.impactScale,
            });
          } else {
            // Creating a new activity
            await createActivity.mutateAsync({
              name: formData.name.trim(),
              description: formData.description.trim() || undefined,
              impactScale: formData.impactScale,
            });
          }
          break;
      }

      onUpdate?.();
      onClose();
    } catch (err) {
      // Errors are handled by React Query
    }
  };

  const handleClose = () => {
    if (hasChanges(activity) && !confirm("Discard unsaved changes?")) return;
    onClose();
  };

  return (
    <Dialog data-slot="dialog" open={isOpen} onOpenChange={handleClose}>
      {/* Removed scrollable + removed DialogBody in favor of standard content + overflow if needed */}
      <DialogContent data-slot="dialog-content" className="max-w-6xl h-full overflow-y-auto">
        <DialogHeader data-slot="dialog-header" className="p-8 pt-6 pb-0">
          <DialogTitle data-slot="dialog-title">
            {activity ? "Edit Org Activities" : "Add Org Activities"}
          </DialogTitle>
        </DialogHeader>

        {/* Main content goes directly here */}
        <div className="space-y-6 px-8 py-4">
          {error && (
            <Alert data-slot="alert" variant="destructive">
              <AlertCircle className="size-4" />
              <p className="text-sm">{error.message}</p>
            </Alert>
          )}

          <RadioGroup
            data-slot="radio-group"
            value={formData.activityType}
            onValueChange={(value) =>
              setFormData({
                activityType: value as "from-categories" | "from-import" | "from-scratch",
              })
            }
            className="flex gap-8"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem data-slot="radio-group-item" value="from-categories" id="from-categories" />
              <Label htmlFor="from-categories">Select from pre-built categories</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem data-slot="radio-group-item" value="from-import" id="from-import" />
              <Label htmlFor="from-import">Import your own activities</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem data-slot="radio-group-item" value="from-scratch" id="from-scratch" />
              <Label htmlFor="from-scratch">Create from scratch</Label>
            </div>
          </RadioGroup>

          {/* from-categories */}
          {formData.activityType === "from-categories" && (
            <div className="space-y-4">
              <div className="w-fit space-y-0.5">
                <Label>Categories</Label>
                <Select data-slot="select">
                  <SelectTrigger data-slot="select-trigger">
                    <SelectValue data-slot="select-value" placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent data-slot="select-content">
                    {categories.map((category) => (
                      <SelectItem data-slot="select-item" key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Table data-slot="table">
                <TableHeader data-slot="table-header">
                  <TableRow data-slot="table-row">
                    <TableHead data-slot="table-head" className="w-0">
                      <Checkbox />
                    </TableHead>
                    <TableHead data-slot="table-head">Category</TableHead>
                    <TableHead data-slot="table-head">Activity</TableHead>
                    <TableHead data-slot="table-head">Description</TableHead>
                    <TableHead data-slot="table-head" className="w-[100px] text-center">
                      Impact Scale
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-slot="table-body">
                  {categories.map((category) =>
                    category.activities.map((act) => (
                      <TableRow data-slot="table-row" key={act.id}>
                        <TableCell data-slot="table-cell">
                          <Checkbox
                            checked={formData.selectedCategories.includes(act.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  selectedCategories: [...formData.selectedCategories, act.id],
                                });
                              } else {
                                setFormData({
                                  selectedCategories: formData.selectedCategories.filter(
                                    (id) => id !== act.id
                                  ),
                                });
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell data-slot="table-cell">{category.name}</TableCell>
                        <TableCell data-slot="table-cell">{act.name}</TableCell>
                        <TableCell data-slot="table-cell" className="max-w-md">
                          {act.description}
                        </TableCell>
                        <TableCell data-slot="table-cell" className="text-center">
                          {act.impactScale}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* from-scratch */}
          {formData.activityType === "from-scratch" && (
            <div className="flex max-w-copy-base flex-col gap-4">
              <div className="w-fit space-y-0.5">
                <Label>Categories</Label>
                <Select data-slot="select">
                  <SelectTrigger data-slot="select-trigger">
                    <SelectValue data-slot="select-value" placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent data-slot="select-content">
                    <SelectItem data-slot="select-item" value="01">
                      Custom
                    </SelectItem>
                    <SelectItem data-slot="select-item" value="02">
                      Must show the categories list
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="name">Activity Name</Label>
                <Input
                  data-slot="input"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Enter activity name"
                  required
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  data-slot="textarea"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ description: e.target.value })}
                  placeholder="Enter activity description"
                  rows={3}
                />
              </div>

              <div className="w-[200px]">
                <Label htmlFor="impact">Impact Scale</Label>
                {/* If you want a working select for impact scale, remove comment and add data-slot */}
                {/* <Select
                  data-slot="select"
                  id="impact"
                  value={formData.impactScale}
                  onValueChange={(value) => setFormData({ impactScale: value })}
                >
                  <SelectTrigger data-slot="select-trigger" id="impact">
                    <SelectValue data-slot="select-value" placeholder="Select impact..." />
                  </SelectTrigger>
                  <SelectContent data-slot="select-content">
                    {[...Array(10)].map((_, i) => (
                      <SelectItem data-slot="select-item" key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>
            </div>
          )}

          {/* from-import */}
          {formData.activityType === "from-import" && (
            <div className="grid gap-4">
              <div
                className={cn(
                  "relative flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-200",
                  dragActive ? "border-primary bg-primary/5" : "border-input hover:bg-secondary"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!formData.uploadedFile ? (
                  <>
                    <input
                      data-slot="file-input"
                      type="file"
                      accept=".csv"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleFileSelect}
                    />
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Upload className="size-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Drop CSV file here or click to upload</p>
                        <p className="text-sm">Only CSV files are supported</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex w-full items-center justify-between rounded-lg bg-accent p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <FileText className="size-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{formData.uploadedFile.name}</p>
                        <p className="text-sm">
                          {(formData.uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      data-slot="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFormData({ uploadedFile: null })}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Alert data-slot="alert">
                <AlertCircle className="size-4" />
                <div className="space-y-2 text-sm">
                  <p>Required CSV format:</p>
                  <ul className="list-disc space-y-1 pl-4">
                    <li>Category (text)</li>
                    <li>Action Title (text)</li>
                    <li>Description (text)</li>
                    <li>Impact Scale (1-10)</li>
                  </ul>
                </div>
              </Alert>
            </div>
          )}
        </div>

        <DialogFooter data-slot="dialog-footer" className="border-t p-6">
          <Button data-slot="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            data-slot="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !hasChanges(activity)}
          >
            {isSubmitting
              ? "Saving..."
              : activity
              ? "Save Changes"
              : "Add Activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
