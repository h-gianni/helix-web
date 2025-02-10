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
    imageUrl = "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    fields,
    onEdit,
    editButtonPosition = 'topRight',
    editButtonText = 'Edit Profile',
    className,
    ...props
  }, ref) => {
    const EditButton = () => (
      <Button
        variant="neutral"
        volume="soft"
        onClick={onEdit}
        leadingIcon={<PenSquare />}
        className={cn(editButtonPosition === 'footer' && 'w-full')}
      >
        {editButtonText}
      </Button>
    );

    const renderFields = () => (
      <div className="profile-card-fields">
        {fields.map((field, index) => (
          <div key={index} className="profile-card-field">
            <Label className="profile-card-label">{field.label}</Label>
            <p className="profile-card-value" data-variant={field.variant}>
              {field.value}
            </p>
          </div>
        ))}
      </div>
    );

    return (
      <Card
        ref={ref}
        className={cn('profile-card', className)}
        data-align={align}
        {...props}
      >
        {align === 'vertical' ? (
          <>
            <div className="profile-card-image-container">
              <Image
                src={imageUrl}
                alt="Profile background"
                className="profile-card-image"
              />
            </div>
            <CardContent className="profile-card-content">
              {renderFields()}
            </CardContent>
            {onEdit && editButtonPosition === 'footer' && (
              <CardFooter className="profile-card-footer">
                <EditButton />
              </CardFooter>
            )}
          </>
        ) : (
          <CardContent className="profile-card-content">
            <div className="profile-card-image-container">
              <Image
                src={imageUrl}
                alt="Profile background"
                className="profile-card-image"
              />
            </div>
            {renderFields()}
          </CardContent>
        )}
        {onEdit && editButtonPosition === 'topRight' && (
          <div className="profile-card-edit">
            <EditButton />
          </div>
        )}
      </Card>
    );
  }
);

ProfileCard.displayName = 'ProfileCard';

export { ProfileCard };