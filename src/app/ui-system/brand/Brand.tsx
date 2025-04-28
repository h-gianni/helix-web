"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/core/Card";
import { BrandLogo } from "@/components/logo/BrandLogo";
import Image from "next/image";
import LogoImage from "@/assets/shared/logo.svg";
import { Separator } from "@/components/ui/core/Separator";
import { cn } from "@/lib/utils";

const TokensShowcase = () => {
  return (
    <div className="space-y-16 mt-8">
      <div className="grid grid-cols-2 p-4">
        <div className="flex flex-row items-center justify-center gap-4">
          <BrandLogo variant="vertical" size="lg" />
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          <BrandLogo variant="default" size="lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 p-4">
        <div className="flex flex-row items-center justify-center gap-4 p-4">
          <div className="flex justify-center">
            <BrandLogo variant="icon" size="xs" />
          </div>
          <div className="flex justify-center">
            <BrandLogo variant="icon" size="sm" />
          </div>
          <div className="flex justify-center">
            <BrandLogo variant="icon" size="base" />
          </div>
          <div className="flex justify-center">
            <BrandLogo variant="icon" size="lg" />
          </div>
          <div className="flex justify-center">
            <BrandLogo variant="icon" size="xl" />
          </div>
        </div>
        <div className="flex flex-col gap-8 items-center justify-center p-8">
          <div className="flex flex-row items-center justify-center gap-4">
            <BrandLogo variant="logotype" size="base" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 shadow rounded-xl">
        <div className="col-span-2">
          <div className="flex flex-col bg-primary-500 h-[200px] p-4 rounded-tl-xl">
            <div className="heading-upper !text-primary-100">Primary / Star Performer</div>
          </div>
          <div className="flex flex-col bg-secondary-500 h-[150px] p-4">
            <div className="heading-upper !text-secondary-100">Secondary / Strong Performer</div>
          </div>
          <div className="flex flex-col bg-tertiary-500 h-[50px] p-4 rounded-bl-xl">
            <div className="heading-upper !text-tertiary-100">Tertiary / Solid Performer</div>
          </div>
        </div>
        <div className="h-full">
          <div className="bg-accent h-[100px] p-4 rounded-tr-xl">
            <div className="heading-upper !text-accent-900">Accent</div>
          </div>
          <div className="bg-neutral-900 h-[100px] p-4">
            <div className="heading-upper !text-neutral-300">Neutral</div>
          </div>
          <div className="bg-neutral-200 h-[100px] p-4">
            <div className="heading-upper !text-neutral-600">Neutral</div>
          </div>
          <div className="bg-neutral-100 h-[100px] p-4 rounded-br-xl">
            <div className="heading-upper !text-neutral-600">Neutral</div>
          </div>
        </div>
      </div>

      <div className="">Content</div>

      <div className="grid grid-cols-3 shadow rounded-xl">
        <div className="col-span-2 flex flex-col h-full">
          <div className="bg-primary-500 p-16 rounded-tl-xl">
            <BrandLogo variant="logotype" color="light" size="sm" />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="bg-tertiary-500 via-primary-500 p-16 rounded-tr-xl">
            <BrandLogo variant="logotype" color="light" size="sm" />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="bg-neutral-900 p-16 rounded-bl-xl">
            <BrandLogo variant="logotype" color="light" size="sm" />
          </div>
        </div>

        <div className="col-span-2 flex flex-col h-full">
          <div className="bg-secondary-500 p-16 rounded-br-xl">
            <BrandLogo variant="logotype" color="light" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokensShowcase;
