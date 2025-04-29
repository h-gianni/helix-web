"use client";

import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/core/Card";
import { Label } from "@/components/ui/core/Label";
import { Button } from "@/components/ui/core/Button";
import { Pen } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface ProfileField {
  label: string;
  value: string | React.ReactNode;
  variant?: "default" | "title" | "strong";
}

export interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "horizontal" | "vertical";
  imageUrl?: string;
  fields: ProfileField[];
  onEdit?: () => void;
  editButtonPosition?: "topRight" | "footer";
  editButtonText?: string;
}

function ProfileCard({
  align = "vertical",
  imageUrl = "",
  fields,
  onEdit,
  editButtonPosition = "topRight",
  editButtonText = "Edit",
  className,
  ...props
}: ProfileCardProps) {
  const EditButton = () => (
    <Button
      data-slot="button"
      variant="ghost"
      icon
      onClick={onEdit}
      className={cn(editButtonPosition === "footer" && "w-full")}
    >
      <Pen />
    </Button>
  );

  const renderFields = () => (
    <div className="divide-y divide-border w-full">
      {fields.map((field, index) => (
        <div key={index} className="first:[&>Label]:hidden pt-2 pb-2.5">
          <Label data-slot="label">{field.label}</Label>
          <p
            className={cn(
              "",
              field.variant === "title" && "heading-3",
              field.variant === "strong" && "body-sm"
            )}
          >
            {field.value}
          </p>
        </div>
      ))}
    </div>
  );

  const ProfileImage = () => (
    <div className="relative h-full w-full">
      <Image
        src={imageUrl}
        alt="Profile"
        width={96}
        height={96}
        className="bg-neutral-900 rounded-full object-cover size-auto"
      />
    </div>
  );

  return (
    <Card
      data-slot="card"
      className={cn(
        "relative p-0",
        onEdit && editButtonPosition === "topRight" && "",
        className
      )}
      {...props}
    >
      {align === "vertical" ? (
        <>
          <CardContent data-slot="card-content" className="p-0">
            <div className="h-24">
              <div className="relative h-14 bg-neutral rounded-t-lg">
                <div className="size-20 absolute -bottom-10 left-4 rounded-full border-2 border-white shadow">
                  <ProfileImage />
                </div>
              </div>
            </div>
            <div className="p-4 pb-6 space-y-8">{renderFields()}</div>
          </CardContent>
          {onEdit && editButtonPosition === "footer" && (
            <CardFooter data-slot="card-footer" className="p-4 pt-0">
              <EditButton />
            </CardFooter>
          )}
        </>
      ) : (
        <>
          <CardContent data-slot="card-content" className="p-0">
            <div className="flex">
              <div className="bg-neutral p-8 rounded-l-lg">
                <div className="size-32 rounded-full border-2 border-white shadow">
                  <ProfileImage />
                </div>
              </div>
              <div className="flex flex-col items-start gap-6 p-8 w-full">
                {renderFields()}
              </div>
            </div>
          </CardContent>
        </>
      )}
      {onEdit && editButtonPosition === "topRight" && (
        <div className="absolute right-4 top-4">
          <EditButton />
        </div>
      )}
    </Card>
  );
}

export { ProfileCard };