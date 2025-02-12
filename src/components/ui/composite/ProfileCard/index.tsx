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

    const ProfileImage = () => (
      <div className="profile-card-image-container relative h-24 w-24">
        <Image
          src={imageUrl}
          alt="Profile"
          width={96}
          height={96}
          className="profile-card-image rounded-full object-cover"
        />
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
            <ProfileImage />
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
            <div className="flex items-center gap-4">
              <ProfileImage />
              {renderFields()}
            </div>
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