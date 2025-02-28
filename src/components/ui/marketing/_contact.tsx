"use client";

import { CalendarIcon, Check, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/core/Badge";
import { Button } from "@/components/ui/core/Button";
import { Calendar } from "@/components/ui/core/Calendar";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/core/Popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/core/Label";
import { Input } from "@/components/ui/core/Input";

export const Contact = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <section>
      <div className="section-container grid lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
          <div className="section-header">
            <div>
              <Badge>Contact</Badge>
            </div>
              <h4 className="marketing-h1">Something new</h4>
              <p className="marketing-body-lg">
                Managing a small business today is already tough. Avoid further
                complications by ditching outdated, tedious trade methods.
              </p>
          </div>
          <div className="flex flex-row gap-6 items-start text-left">
            <Check className="w-4 h-4 mt-2 text-primary" />
            <div className="flex flex-col gap-1">
              <p>Easy to use</p>
              <p className="marketing-body-sm">
                We&apos;ve made it easy to use and understand.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-6 items-start text-left">
            <Check className="w-4 h-4 mt-2 text-primary" />
            <div className="flex flex-col gap-1">
              <p>Fast and reliable</p>
              <p className="marketing-body-sm">
                We&apos;ve made it easy to use and understand.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-6 items-start text-left">
            <Check className="w-4 h-4 mt-2 text-primary" />
            <div className="flex flex-col gap-1">
              <p>Beautiful and modern</p>
              <p className="marketing-body-sm">
                We&apos;ve made it easy to use and understand.
              </p>
            </div>
          </div>
        </div>

        <div className="justify-center flex items-center">
          <div className="rounded-md max-w-sm flex flex-col border p-8 gap-4">
            <p>Book a meeting</p>
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="picture">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full max-w-sm justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" type="text" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" type="text" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1">
              <Label htmlFor="picture">Upload resume</Label>
              <Input id="picture" type="file" />
            </div>

            <Button className="gap-4 w-full">
              Book the meeting <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
