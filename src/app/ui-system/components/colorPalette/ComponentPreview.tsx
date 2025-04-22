import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { Badge } from "@/components/ui/core/Badge";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { Label } from "@/components/ui/core/Label";

const ComponentPreview: React.FC = () => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          See how your color changes affect UI components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Button Previews */}
          <div className="space-y-3">
            <Label>Buttons</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="neutral">Neutral</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          
          {/* Badge Previews */}
          <div className="space-y-3">
            <Label>Badges</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="primary-light">Primary Light</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </div>
          
          {/* Alert Previews */}
          <div className="space-y-3">
            <Label>Alerts</Label>
            <div className="space-y-2">
              <Alert variant="primary">
                <AlertDescription>Primary alert message</AlertDescription>
              </Alert>
              
              <Alert variant="info">
                <AlertDescription>Information alert message</AlertDescription>
              </Alert>
              
              <Alert variant="warning">
                <AlertDescription>Warning alert message</AlertDescription>
              </Alert>
              
              <Alert variant="destructive">
                <AlertDescription>Error alert message</AlertDescription>
              </Alert>
            </div>
          </div>
          
          {/* Indicator Dots */}
          <div className="space-y-3">
            <Label>Indicators</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-primary-500"></div>
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-accent-500"></div>
                <span className="text-sm">Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-success-500"></div>
                <span className="text-sm">Success</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-warning-500"></div>
                <span className="text-sm">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-info-500"></div>
                <span className="text-sm">Info</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-destructive-500"></div>
                <span className="text-sm">Destructive</span>
              </div>
            </div>
          </div>
          
          {/* Card Examples */}
          <div className="space-y-3">
            <Label>Card Accents</Label>
            <div className="space-y-2">
              <div className="h-10 rounded-md border-l-4 border-primary-500 bg-primary-50/30 p-2">
                Primary card accent
              </div>
              <div className="h-10 rounded-md border-l-4 border-destructive-500 bg-destructive-50/30 p-2">
                Destructive card accent
              </div>
              <div className="h-10 rounded-md border-l-4 border-success-500 bg-success-50/30 p-2">
                Success card accent
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentPreview;