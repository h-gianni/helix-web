"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/core/Radio-group";
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
  useActivityModalStore
} from '@/store/activity-modal-store';
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



  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories()
  const createActivity = useCreateActivity()
  const updateActivity = useUpdateActivity()
  const importActivities = useImportActivities()

  


  const isSubmitting =
    createActivity.isPending ||
    updateActivity.isPending ||
    importActivities.isPending;
  const error =
    createActivity.error || updateActivity.error || importActivities.error;

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        description: activity.description || "",
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
          if (activity) {
            await updateActivity.mutateAsync({
              id: activity.id,
              name: formData.name.trim(),
              description: formData.description.trim() || undefined,
              impactScale: formData.impactScale,
            });
          } else {
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
      // Error handling is managed by React Query
    }
  };

  const handleClose = () => {
    if (hasChanges(activity) && !confirm("Discard unsaved changes?")) return;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-full" scrollable>
        <DialogHeader className="p-8 pt-6 pb-0">
          <DialogTitle>
            {activity ? "Edit Org Activities" : "Add Org Activities"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error.message}</p>
            </Alert>
          )}

          <RadioGroup
            value={formData.activityType}
            onValueChange={(value) =>
              setFormData({
                activityType: value as
                  | "from-categories"
                  | "from-import"
                  | "from-scratch",
              })
            }
            className="flex gap-8"
          >
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="from-categories" id="from-categories" />
              <Label htmlFor="from-categories">
                Select from pre-built categories
              </Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="from-import" id="from-import" />
              <Label htmlFor="from-import">Import your own activities</Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="from-scratch" id="from-scratch" />
              <Label htmlFor="from-scratch">Create from scratch</Label>
            </div>
          </RadioGroup>

          {formData.activityType === "from-categories" && (
            <div className="space-y-4">
              <div className="w-fit space-y-0.5">
                <Label>Categories</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
  {categories.map((category) => (
    <SelectItem key={category.id} value={category.id}>
      {category.name}
    </SelectItem>
  ))}
</SelectContent>
                </Select>
              </div>
<Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-0">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px] text-center">
                      Impact Scale
                    </TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
  {categories.map((category) => 
    category.activities.map((activity) => (
      <TableRow key={activity.id}>
        <TableCell>
          <Checkbox 
            checked={formData.selectedCategories.includes(activity.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setFormData({
                  selectedCategories: [...formData.selectedCategories, activity.id]
                })
              } else {
                setFormData({
                  selectedCategories: formData.selectedCategories.filter(id => id !== activity.id)
                })
              }
            }}
          />
        </TableCell>
        <TableCell>{category.name}</TableCell>
        <TableCell>{activity.name}</TableCell>
        <TableCell className="max-w-md">{activity.description}</TableCell>
        <TableCell className="text-center">{activity.impactScale}</TableCell>
      </TableRow>
    ))
  )}
</TableBody>
              </Table>
              </div>
          )}

          {formData.activityType === "from-scratch" && (
            <div className="flex flex-col max-w-copy-base gap-4">
              <div className="w-fit space-y-0.5">
                <Label>Categories</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">
                      Custom
                    </SelectItem>
                    <SelectItem value="02">
                      Must show the categories list
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="name">Activity Name</Label>
                <Input
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
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ description: e.target.value })}
                  placeholder="Enter activity description"
                  rows={3}
                />
              </div>

              <div className="w-[200px]">
                <Label htmlFor="impact">Impact Scale</Label>
                {/* <Select 
                  id="impact"
                  value={formData.impactScale}
                  onValueChange={(value) => setFormData({ impactScale: value })}
                >
                  <SelectTrigger id="impact">
                    <SelectValue placeholder="Select impact..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>
            </div>
          )}

          {formData.activityType === "from-import" && (
            <div className="grid gap-4">
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-input hover:bg-secondary",
                  "transition-colors duration-200"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!formData.uploadedFile ? (
                  <>
                    <input
                      type="file"
                      accept=".csv"
                      // onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">
                          Drop CSV file here or click to upload
                        </p>
                        <p className="text-sm text-foreground-muted">
                          Only CSV files are supported
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {formData.uploadedFile.name}
                        </p>
                        <p className="text-sm text-foreground-muted">
                          {(formData.uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFormData({ uploadedFile: null })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <div className="text-sm space-y-2">
                  <p>Required CSV format:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Category (text)</li>
                    <li>Action Title (text)</li>
                    <li>Description (text)</li>
                    <li>Impact Scale (1-10)</li>
                  </ul>
                </div>
              </Alert>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="p-6 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
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
