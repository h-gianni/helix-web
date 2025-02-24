"use client";

import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/core/Card";
import { Label } from "@/components/ui/core/Label";
import { Button } from "@/components/ui/core/Button";
import { PenSquare } from "lucide-react";
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

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    {
      align = "vertical",
      imageUrl = "",
      fields,
      onEdit,
      editButtonPosition = "topRight",
      editButtonText = "Edit Profile",
      className,
      ...props
    },
    ref
  ) => {
    const EditButton = () => (
      <Button
        variant="ghost"
        onClick={onEdit}
        className={cn("gap-2", editButtonPosition === "footer" && "w-full")}
      >
        <PenSquare />
        {editButtonText}
      </Button>
    );

    const renderFields = () => (
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={index} className="-space-y-1">
            <Label className="text-foreground-muted">{field.label}</Label>
            <p
              className={cn(
                "text-base",
                field.variant === "title" && "text-lg font-semibold",
                field.variant === "strong" && "font-medium"
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
          className="bg-accent rounded-full object-cover size-auto"
        />
      </div>
    );

    return (
      <Card
        ref={ref}
        className={cn(
          "relative p-0",
          onEdit && editButtonPosition === "topRight" && "",
          className
        )}
        {...props}
      >
        {align === "vertical" ? (
          <>
            <CardContent>
              <div className="h-24">
                <div className="relative h-14 bg-accent/10">
                  <div className="size-20 absolute -bottom-10 left-4 rounded-full border-2 border-white shadow">
                    <ProfileImage />
                  </div>
                </div>
              </div>
              <div className="px-4 pt-3 space-y-6">{renderFields()}</div>
            </CardContent>
            {onEdit && editButtonPosition === "footer" && (
              <CardFooter className="p-4 pt-2">
                <EditButton />
              </CardFooter>
            )}
          </>
        ) : (
          <>
            <CardContent>
              <div className="flex">
                <div className="bg-accent/10 p-8">
                  <div className="size-32 rounded-full border-2 border-white shadow">
                    <ProfileImage />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-6 p-8">
                  {renderFields()}
                </div>
              </div>
            </CardContent>
          </>
        )}
        {onEdit && editButtonPosition === "topRight" && (
          <div className="absolute right-4 top-0">
            <EditButton />
          </div>
        )}
      </Card>
    );
  }
);

ProfileCard.displayName = "ProfileCard";

export { ProfileCard };
