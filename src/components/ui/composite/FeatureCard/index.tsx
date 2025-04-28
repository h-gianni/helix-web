// components/ui/core/FeatureCard.tsx

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/core/Card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  children?: React.ReactNode;
}

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  href,
  children,
}: FeatureCardProps) => (
    <Link href={href} className="w-full">
    <Card className="hover:shadow transition-shadow">
      <CardHeader size="sm" className="flex-row gap-3 items-start pt-5">
        <div className="p-2 rounded-md bg-neutral-50">
          <Icon className="size-5 text-primary-500" />
        </div>
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
      {children}
      </CardContent>
    </Card>
    </Link>
);
