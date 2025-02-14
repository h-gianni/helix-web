"use client";

import * as React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/core/Card";
import { Label } from "@/components/ui/core/Label";
import { Button } from "@/components/ui/core/Button";
import { PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from 'next/image';

export interface ProfileField {
  label: string;
  value: string | React.ReactNode;
  variant?: 'default' | 'title' | 'strong';
}

export interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'horizontal' | 'vertical';
  imageUrl?: string;
  fields: ProfileField[];
  onEdit?: () => void;
  editButtonPosition?: 'topRight' | 'footer';
  editButtonText?: string;
}

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  ({
    align = 'vertical',
    imageUrl = "",
    fields,
    onEdit,
    editButtonPosition = 'topRight',
    editButtonText = 'Edit Profile',
    className,
    ...props
  }, ref) => {
    const EditButton = () => (
      <Button
        variant="outline"
        onClick={onEdit}
        className={cn("gap-2", editButtonPosition === 'footer' && 'w-full')}
      >
        <PenSquare className="h-4 w-4" />
        {editButtonText}
      </Button>
    );

    const renderFields = () => (
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="space-y-1.5">
            <Label>{field.label}</Label>
            <p className={cn(
              "text-sm",
              field.variant === 'title' && "text-lg font-semibold",
              field.variant === 'strong' && "font-medium"
            )}>
              {field.value}
            </p>
          </div>
        ))}
      </div>
    );

    const ProfileImage = () => (
      <div className="relative h-24 w-24">
        <Image
          src={imageUrl}
          alt="Profile"
          width={96}
          height={96}
          className="rounded-full object-cover"
        />
      </div>
    );

    return (
      <Card
        ref={ref}
        className={cn(
          "relative",
          onEdit && editButtonPosition === 'topRight' && "pt-14",
          className
        )}
        {...props}
      >
        {align === 'vertical' ? (
          <>
            <div className="flex justify-center pt-6">
              <ProfileImage />
            </div>
            <CardContent className="space-y-6">
              {renderFields()}
            </CardContent>
            {onEdit && editButtonPosition === 'footer' && (
              <CardFooter>
                <EditButton />
              </CardFooter>
            )}
          </>
        ) : (
          <CardContent>
            <div className="flex items-start gap-6">
              <ProfileImage />
              {renderFields()}
            </div>
          </CardContent>
        )}
        {onEdit && editButtonPosition === 'topRight' && (
          <div className="absolute right-4 top-4">
            <EditButton />
          </div>
        )}
      </Card>
    );
  }
);

ProfileCard.displayName = 'ProfileCard';

export { ProfileCard };