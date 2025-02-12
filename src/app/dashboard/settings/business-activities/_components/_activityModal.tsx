import { useState, useEffect } from "react";
import { DialogWithConfig } from "@/components/ui/core/Dialog";
import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Checkbox } from "@/components/ui/core/Checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/core/Table";
import { Textarea } from "@/components/ui/core/Textarea";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/core/RadioGroup";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/core/Select";
import {
  PlusCircle,
  Import,
  Upload,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { BusinessActivityResponse } from "@/lib/types/api";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: BusinessActivityResponse | null;
  onUpdate: () => Promise<void>;
}

export function ActivityModal({
  isOpen,
  onClose,
  activity,
  onUpdate,
}: ActivityModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activityType, setActivityType] = useState("from-categories");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setDescription(activity.description || "");
    } else {
      setName("");
      setDescription("");
    }
    setError(null);
    setUploadedFile(null);
  }, [activity, isOpen]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") {
      setUploadedFile(file);
    } else {
      setError("Please upload a CSV file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setUploadedFile(file);
    } else {
      setError("Please upload a CSV file");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      if (activityType === "from-import" && uploadedFile) {
        // Handle CSV file upload and processing
        const formData = new FormData();
        formData.append("file", uploadedFile);

        const response = await fetch("/api/business-activities/import", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to import business activities");
        }
      } else {
        // Handle regular activity creation/update
        const method = activity ? "PATCH" : "POST";
        const url = activity
          ? `/api/business-activities/${activity.id}`
          : "/api/business-activities";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to save business activity");
        }
      }

      await onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    if (activityType === "from-import") {
      return !!uploadedFile;
    }
    if (!activity) return name.trim() !== "" || description.trim() !== "";
    return (
      name !== activity.name || description !== (activity.description || "")
    );
  };

  const handleClose = () => {
    if (
      hasChanges() &&
      !confirm("You have unsaved changes. Are you sure you want to close?")
    ) {
      return;
    }
    onClose();
  };

  const footerConfig = {
    primaryAction: {
      label: activity ? "Save Changes" : "Add Activity",
      onClick: handleSubmit,
      isLoading: saving,
      disabled:
        saving ||
        !hasChanges() ||
        (activityType === "from-scratch" && !name.trim()),
    },
    secondaryAction: {
      label: "Cancel",
      onClick: handleClose,
      disabled: saving,
    },
  };

  return (
    <DialogWithConfig
      open={isOpen}
      onOpenChange={handleClose}
      title={activity ? "Edit Business Activity" : "Add Business Activity"}
      size="xl"
      footer="two-actions"
      fullHeight
      footerConfig={footerConfig}
    >
      <div className="space-y-6">
        {error && (
          <Alert variant="danger">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="w-auto">
          <RadioGroup
            className="radio-group-base"
            defaultValue="from-categories"
            orientation="horizontal"
            variant="default"
            value={activityType}
            onValueChange={setActivityType}
          >
            <div className="">
              <RadioGroupItem
                description="You can select one or more activities from pre-built categories"
                id="default-from-categories"
                label="Select from existing categories"
                value="from-categories"
              />
            </div>
            <div className="">
              <RadioGroupItem
                description="Start from scratch by creating you own custom activity"
                id="default-from-import"
                label="Import your own category"
                value="from-import"
              />
            </div>
            <div className="">
              <RadioGroupItem
                description="Start from scratch by creating you own custom activity"
                id="default-from-scratch"
                label="Create new custom activity"
                value="from-scratch"
              />
            </div>
          </RadioGroup>
        </div>

        {activityType === "from-categories" && (
          <div className="flex flex-col space-y-base">
            <div className="w-[320px]">
              <Select
                label="Select a function's category"
                showItemIndicator
                size="base"
                width="inline"
                withLabel
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">General</SelectItem>
                  <SelectItem value="option2">Product Management</SelectItem>
                  <SelectItem value="option3">Engineering</SelectItem>
                  <SelectItem value="option3">Design</SelectItem>
                  <SelectItem value="option3">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Table size="sm">
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
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Strategy Planning</TableCell>
                    <TableCell className="max-w-md">
                      Develop and implement strategic plans to achieve
                      organizational goals
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Resource Allocation</TableCell>
                    <TableCell className="max-w-md">
                      Optimize distribution of resources across projects and
                      teams
                    </TableCell>
                    <TableCell className="text-center">5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Performance Review</TableCell>
                    <TableCell className="max-w-md">
                      Conduct regular performance evaluations and provide
                      constructive feedback
                    </TableCell>
                    <TableCell className="text-center">3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Risk Assessment</TableCell>
                    <TableCell className="max-w-md">
                      Identify and evaluate potential risks to project success
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Team Building</TableCell>
                    <TableCell className="max-w-md">
                      Foster team collaboration and positive work environment
                    </TableCell>
                    <TableCell className="text-center">3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Process Improvement</TableCell>
                    <TableCell className="max-w-md">
                      Streamline workflows and enhance operational efficiency
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Budget Management</TableCell>
                    <TableCell className="max-w-md">
                      Monitor and control project expenses within budget
                      constraints
                    </TableCell>
                    <TableCell className="text-center">5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Stakeholder Communication</TableCell>
                    <TableCell className="max-w-md">
                      Maintain effective communication with all project
                      stakeholders
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Quality Assurance</TableCell>
                    <TableCell className="max-w-md">
                      Ensure deliverables meet quality standards and
                      requirements
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Knowledge Transfer</TableCell>
                    <TableCell className="max-w-md">
                      Facilitate sharing of information and best practices
                      across teams
                    </TableCell>
                    <TableCell className="text-center">3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Vendor Management</TableCell>
                    <TableCell className="max-w-md">
                      Manage relationships with external vendors and service
                      providers
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Change Management</TableCell>
                    <TableCell className="max-w-md">
                      Guide organizational transitions and process changes
                      effectively
                    </TableCell>
                    <TableCell className="text-center">5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Data Analysis</TableCell>
                    <TableCell className="max-w-md">
                      Analyze and interpret data to support decision-making
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Documentation</TableCell>
                    <TableCell className="max-w-md">
                      Create and maintain comprehensive project documentation
                    </TableCell>
                    <TableCell className="text-center">3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Training Coordination</TableCell>
                    <TableCell className="max-w-md">
                      Organize and facilitate team training and development
                      programs
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Compliance Monitoring</TableCell>
                    <TableCell className="max-w-md">
                      Ensure adherence to regulations and internal policies
                    </TableCell>
                    <TableCell className="text-center">5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Project Planning</TableCell>
                    <TableCell className="max-w-md">
                      Develop detailed project plans and timelines
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Client Relationship</TableCell>
                    <TableCell className="max-w-md">
                      Build and maintain strong relationships with clients
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Meeting Facilitation</TableCell>
                    <TableCell className="max-w-md">
                      Plan and lead effective team meetings and workshops
                    </TableCell>
                    <TableCell className="text-center">3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>General</TableCell>
                    <TableCell>Resource Optimization</TableCell>
                    <TableCell className="max-w-md">
                      Maximize efficiency of team resources and tools
                    </TableCell>
                    <TableCell className="text-center">4</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activityType === "from-scratch" && (
          <div className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter activity name"
              required
              data-size="base"
              withLabel
              label="Name"
            />

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter activity description"
              rows={3}
              data-size="base"
              withLabel
              label="Description"
            />

            <Select
              label="Impact Scale"
              showItemIndicator
              size="base"
              width="inline"
              withLabel
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select impact scale..." />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {activityType === "from-import" && (
          <div className="w-full space-y-4">
            <div
              className={`relative flex flex-col items-center justify-center w-full h-64 p-6 border-2 border-dashed rounded-lg transition-colors duration-200 
                ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-neutral-base bg-surface"
                } 
                ${uploadedFile ? "bg-surface" : "hover:bg-surface-hover"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!uploadedFile ? (
                <>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-medium">
                        Drop your CSV file here or click to upload
                      </p>
                      <p className="text-sm text-weak">
                        Only CSV files are supported
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between w-full p-4 rounded-lg bg-surface-hover">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-weak">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1 rounded-full hover:bg-surface-hover"
                  >
                    <X className="w-5 h-5 text-weak" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 p-4 text-sm text-weak bg-surface-hover rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p>
                  Your CSV file should follow this format with the following
                  columns:
                </p>
                <ul className="space-y-1">
                  <li>
                    <span className="font-medium">Category</span>: The main
                    category name (text)
                  </li>
                  <li>
                    <span className="font-medium">Action Title</span>: The title
                    of the activity (text)
                  </li>
                  <li>
                    <span className="font-medium">Description</span>: Detailed
                    description of the activity (text)
                  </li>
                  <li>
                    <span className="font-medium">Impact Scale</span>: Numerical
                    value (from 1 to 10)
                  </li>
                </ul>
                <p className="text-xs mt-2">
                  Example: "Marketing, Create Social Media Strategy, Develop
                  comprehensive social media plan..., 8"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DialogWithConfig>
  );
}
