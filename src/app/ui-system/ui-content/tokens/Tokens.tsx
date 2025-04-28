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
  const colorScales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // This ensures the color classes are recognized by Tailwind
  const ensureColors = () => {
    // This function is never called, it just makes the classes available
    return (
      <>
        {/* Neutral */}
        <div className="bg-neutral-50 bg-neutral-100 bg-neutral-200 bg-neutral-300 bg-neutral-400 bg-neutral-500 bg-neutral-600 bg-neutral-700 bg-neutral-800 bg-neutral-900 bg-neutral-950"></div>

        {/* Primary */}
        <div className="bg-primary-50 bg-primary-100 bg-primary-200 bg-primary-300 bg-primary-400 bg-primary-500 bg-primary-600 bg-primary-700 bg-primary-800 bg-primary-900 bg-primary-950"></div>

        {/* Secondary */}
        <div className="bg-secondary-50 bg-secondary-100 bg-secondary-200 bg-secondary-300 bg-secondary-400 bg-secondary-500 bg-secondary-600 bg-secondary-700 bg-secondary-800 bg-secondary-900 bg-secondary-950"></div>

        {/* Tertiary */}
        <div className="bg-tertiary-50 bg-tertiary-100 bg-tertiary-200 bg-tertiary-300 bg-tertiary-400 bg-tertiary-500 bg-tertiary-600 bg-tertiary-700 bg-tertiary-800 bg-tertiary-900 bg-tertiary-950"></div>

        {/* Success */}
        <div className="bg-success-50 bg-success-100 bg-success-200 bg-success-300 bg-success-400 bg-success-500 bg-success-600 bg-success-700 bg-success-800 bg-success-900 bg-success-950"></div>

        {/* Warning */}
        <div className="bg-warning-50 bg-warning-100 bg-warning-200 bg-warning-300 bg-warning-400 bg-warning-500 bg-warning-600 bg-warning-700 bg-warning-800 bg-warning-900 bg-warning-950"></div>

        {/* Destructive */}
        <div className="bg-destructive-50 bg-destructive-100 bg-destructive-200 bg-destructive-300 bg-destructive-400 bg-destructive-500 bg-destructive-600 bg-destructive-700 bg-destructive-800 bg-destructive-900 bg-destructive-950"></div>

        {/* Accent */}
        <div className="bg-accent-50 bg-accent-100 bg-accent-200 bg-accent-300 bg-accent-400 bg-accent-500 bg-accent-600 bg-accent-700 bg-accent-800 bg-accent-900 bg-accent-950"></div>

        {/* Info */}
        <div className="bg-info-50 bg-info-100 bg-info-200 bg-info-300 bg-info-400 bg-info-500 bg-info-600 bg-info-700 bg-info-800 bg-info-900 bg-info-950"></div>
      </>
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>UI Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Neutral (Grayscale) */}
            <div>
              <h3 className="heading-4 mb-3">Neutral</h3>
              <div className="grid grid-cols-2 md:grid-cols-11 gap-0">
                {colorScales.map((level) => (
                  <div key={`neutral-${level}`} className="space-y-1">
                    <div className={`h-16 w-full bg-neutral-${level}`}></div>
                    <div className="flex justify-between">
                      <code className="text-xs">{level}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Colors */}
            <div>
              <h3 className="heading-4 mb-3">Primary</h3>
              <div className="grid grid-cols-2 md:grid-cols-11 gap-0">
                {colorScales.map((level) => (
                  <div key={`primary-${level}`} className="space-y-1">
                    <div className={`h-16 w-full bg-primary-${level}`}></div>
                    <div className="flex justify-between">
                      <code className="text-xs">{level}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Colors */}
            <div>
              <h3 className="heading-4 mb-3">Secondary</h3>
              <div className="grid grid-cols-2 md:grid-cols-11 gap-0">
                {colorScales.map((level) => (
                  <div key={`secondary-${level}`} className="space-y-1">
                    <div className={`h-16 w-full bg-secondary-${level}`}></div>
                    <div className="flex justify-between">
                      <code className="text-xs">{level}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tertiary Colors */}
            <div>
              <h3 className="heading-4 mb-3">Tertiary</h3>
              <div className="grid grid-cols-2 md:grid-cols-11 gap-0">
                {colorScales.map((level) => (
                  <div key={`tertiary-${level}`} className="space-y-1">
                    <div className={`h-16 w-full bg-tertiary-${level}`}></div>
                    <div className="flex justify-between">
                      <code className="text-xs">{level}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Colors */}
            <div className="flex w-full">
              {/* Success */}
              <div className="w-full">
                <h3 className="heading-4 mb-2">Success</h3>
                <div>
                  {colorScales.map((level) => (
                    <div key={`success-${level}`}>
                      <div className={`h-8 w-full bg-success-${level}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="w-full">
                <h3 className="heading-4 mb-2">Warning</h3>
                <div>
                  {colorScales.map((level) => (
                    <div key={`warning-${level}`}>
                      <div className={`h-8 w-full bg-warning-${level}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destructive */}
              <div className="w-full">
                <h3 className="heading-4 mb-2">Destructive</h3>
                <div>
                  {colorScales.map((level) => (
                    <div key={`destructive-${level}`}>
                      <div
                        className={`h-8 w-full bg-destructive-${level}`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accent */}
              <div className="w-full">
                <h3 className="heading-4 mb-2">Accent</h3>
                <div>
                  {colorScales.map((level) => (
                    <div key={`accent-${level}`}>
                      <div className={`h-8 w-full bg-accent-${level}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="w-full">
                <h3 className="heading-4 mb-2">Info</h3>
                <div>
                  {colorScales.map((level) => (
                    <div key={`info-${level}`}>
                      <div className={`h-8 w-full bg-info-${level}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* values */}
              <div className="w-min px-4">
                <h3 className="heading-5 h-8"></h3>
                <div>
                  {colorScales.map((level) => (
                    <div key={`level-${level}`} className="h-8">
                      <code className="text-xs">{level}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bg, Foreground & Surface Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Background & Foreground */}
              <div className="space-y-4">
                <h3 className="heading-4 mb-3">Background & Foreground</h3>

                <div className="space-y-2">
                  <div className="w-full rounded-md bg-background text-foreground">
                    <div className="p-4 text-foreground">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <code>--background</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-16 w-full rounded-md flex items-center text-sm p-4 gap-4 bg-background">
                    <span className="text-foreground-strong">
                      --foreground-strong
                    </span>
                    <span className="text-foreground">--foreground</span>
                    <span className="text-foreground-weak">
                      --foreground-weak
                    </span>
                    <span className="text-foreground-muted">
                      --foreground-muted
                    </span>
                  </div>
                </div>
              </div>

              {/* Surface Colors */}
              <div className="space-y-4">
                <h3 className="heading-4 mb-3">Surface Colors</h3>

                <div className="space-y-2">
                  <Card>
                    <div className="p-4">
                      <div className="grid grid-cols-2 text-sm gap-2">
                        <div>
                          <code>--card</code>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-2 grid grid-cols-2 gap-4">
                  <div className="w-full rounded-md bg-popover text-popover-foreground">
                    <div className="p-4">
                      <div className="grid grid-cols-2 text-sm gap-2">
                        <div>
                          <code>--popover</code>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full rounded-md bg-raised text-foreground shadow-sm">
                    <div className="p-4">
                      <div className="grid grid-cols-2 text-sm gap-2">
                        <div>
                          <code>--raised</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* UI Interactive Colors */}
            <div className="pb-8">
              <h3 className="heading-4 mb-3">Interactive Elements</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-full text-center p-4 font-semibold bg-primary text-primary-foreground">
                    Primary
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--primary</code>
                    </div>
                    <div>
                      <code>--primary-foreground</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full text-center p-4 font-semibold bg-neutral text-neutral-foreground">
                    neutral
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--neutral</code>
                    </div>
                    <div>
                      <code>--neutral-foreground</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full text-center p-4 font-semibold bg-destructive text-white">
                    Destructive
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--destructive</code>
                    </div>
                    <div>
                      <code>--destructive-foreground</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full text-center p-4 font-semibold bg-muted text-muted-foreground">
                    Muted
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--muted</code>
                    </div>
                    <div>
                      <code>--muted-foreground</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Borders */}
            <div className="pb-8">
              <h3 className="heading-4 mb-3">Borders</h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="w-full text-center p-4 border border-border-weak">
                    Weak Border
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--border</code>
                    </div>
                    <div>
                      <code>-border-weak</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full text-center p-4 border border-border">
                    Default Border
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--border</code>
                    </div>
                    <div>
                      <code>-border-border</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full text-center p-4 border border-border-strong">
                    Strong Border
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--border</code>
                    </div>
                    <div>
                      <code>-border-strong</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full text-center p-4 border border-input">
                    Input Border
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--border</code>
                    </div>
                    <div>
                      <code>-input</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full text-center p-4 border border-ring">
                    Border Ring
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--border</code>
                    </div>
                    <div>
                      <code>-ring</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Typography foundation for the design system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Sans Serif</div>
              <div className="p-4 border border-border rounded-md bg-card">
                <p className="font-sans">
                  The quick brown fox jumps over the lazy dog. 0123456789
                </p>
              </div>
              <code className="text-xs">--font-sans</code>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Monospace</div>
              <div className="p-4 border border-border rounded-md bg-card">
                <p className="font-mono">
                  The quick brown fox jumps over the lazy dog. 0123456789
                </p>
              </div>
              <code className="text-xs">--font-mono</code>
            </div>
          </div>

          <div className="space-y-4 py-4">
            <h3 className="heading-4">Font Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <div className="heading-5 mb-1">2XS (10px)</div>
                  <p className="text-2xs">
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-2xs</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">XS (11px)</div>
                  <p className="text-xs">
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-xs</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">SM (12px)</div>
                  <p className="text-sm">
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-sm</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">Base (14px)</div>
                  <p className="text-base">
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-base</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">LG (16px)</div>
                  <p className="text-lg">
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-lg</code>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="heading-5 mb-1">XL (20px)</div>
                  <p className="text-xl">
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-xl</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">2XL (24px)</div>
                  <p className="text-2xl">
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-2xl</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">3XL (28px)</div>
                  <p className="text-3xl">
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-3xl</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">4XL (34px)</div>
                  <p className="text-4xl">
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-4xl</code>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 py-4">
            <h3 className="heading-3">Display & Headings</h3>
            <div className="space-y-4">
              <div>
                <div className="display-1">Display 1</div>
                <code className="text-xs">.display-1</code>
              </div>

              <div>
                <div className="display-2">Display 2</div>
                <code className="text-xs">.display-2</code>
              </div>

              <div>
                <div className="heading-1">Heading 1</div>
                <code className="text-xs">.heading-1</code>
              </div>

              <div>
                <div className="heading-2">Heading 2</div>
                <code className="text-xs">.heading-2</code>
              </div>

              <div>
                <div className="heading-3">Heading 3</div>
                <code className="text-xs">.heading-3</code>
              </div>

              <div>
                <div className="heading-4">Heading 4</div>
                <code className="text-xs">.heading-4</code>
              </div>

              <div>
                <div className="heading-5">Heading 5</div>
                <code className="text-xs">.heading-5</code>
              </div>

              <div>
                <div className="heading-6">Heading 6</div>
                <code className="text-xs">.heading-5</code>
              </div>

              <div>
                <div className="heading-upper">Heading Upper</div>
                <code className="text-xs">.heading-upper</code>
              </div>
            </div>
          </div>

          <div className="space-y-4 py-4">
            <h3 className="heading-3">Body text</h3>
            <div>
              <div className="heading-6">Body Large</div>
              <p className="body-lg">
                This text is designed for main content areas where readability
                is important. It uses a larger size to improve the reading
                experience for longer blocks of text.
              </p>
              <code className="text-xs">.body-lg</code>
            </div>

            <div>
              <div className="heading-6">Body Base</div>
              <p className="body-base">
                This is the standard text size used throughout the interface for
                most content. It balances readability with space efficiency.
              </p>
              <code className="text-xs">.body-base</code>
            </div>

            <div>
              <div className="heading-6">Body Small</div>
              <p className="body-sm">
                This smaller text size is used for neutral information,
                supportive text, and areas where space is limited.
              </p>
              <code className="text-xs">.body-sm</code>
            </div>

            <div>
              <div className="heading-6">Body Extra Small</div>
              <p className="body-xs">
                This smaller text size is used for neutral information,
                supportive text, and areas where space is limited.
              </p>
              <code className="text-xs">.body-xs</code>
            </div>

            <div>
              <div className="label-lg">Large Label</div>
              <code className="text-xs">.label-lg</code>
            </div>

            <div>
              <div className="label-base">Base Label</div>
              <code className="text-xs">.label-base</code>
            </div>

            <div>
              <div className="label-sm">Small Label</div>
              <code className="text-xs">.label-sm</code>
            </div>

            <div>
              <div className="heading-6">Caption</div>
              <div className="caption">
                Caption text for images and supplementary information
              </div>
              <code className="text-xs">.caption</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
          <CardDescription>
            Consistent spacing units for layouts and components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Token
                    </th>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Value
                    </th>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Pixels
                    </th>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["--space-2xs", "0.25rem", "4px"],
                    ["--space-xs", "0.5rem", "8px"],
                    ["--space-sm", "0.75rem", "12px"],
                    ["--space-base", "1rem", "16px"],
                    ["--space-md", "1.25rem", "20px"],
                    ["--space-lg", "1.5rem", "24px"],
                    ["--space-xl", "2rem", "32px"],
                    ["--space-2xl", "2.5rem", "40px"],
                    ["--space-3xl", "3rem", "48px"],
                    ["--space-4xl", "4rem", "64px"],
                  ].map(([token, value, pixels]) => (
                    <tr key={token} className="border-b border-border">
                      <td className="p-2">
                        <code>{token}</code>
                      </td>
                      <td className="p-2">{value}</td>
                      <td className="p-2">{pixels}</td>
                      <td className="p-2">
                        <div
                          className={`bg-primary`}
                          style={{
                            width: value,
                            height: "1rem",
                          }}
                        ></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Component Heights</CardTitle>
          <CardDescription>
            Standard heights for interactive components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Token
                    </th>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Value
                    </th>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Pixels
                    </th>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["--height-control-sm", "2rem", "32px"],
                    ["--height-control-base", "2.5rem", "38px"],
                    ["--height-control-lg", "2.75rem", "44px"],
                  ].map(([token, value, pixels]) => (
                    <tr key={token} className="border-b border-border">
                      <td className="p-2">
                        <code>{token}</code>
                      </td>
                      <td className="p-2">{value}</td>
                      <td className="p-2">{pixels}</td>
                      <td className="p-2">
                        <div
                          className="bg-primary flex items-center justify-center text-white text-xs rounded"
                          style={{
                            height: value,
                            width: "100%",
                          }}
                        >
                          Button
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Icon Sizes</CardTitle>
          <CardDescription>Standard sizes for icons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Token
                    </th>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Value
                    </th>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Pixels
                    </th>
                    <th className="text-sm text-left p-2 border-b border-border">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["--size-icon-sm", "size-4", "16px"],
                    ["--size-icon-base", "size-5", "20px"],
                    ["--size-icon-lg", "size-6", "24px"],
                  ].map(([token, value, pixels]) => (
                    <tr key={token} className="border-b border-border">
                      <td className="p-2">
                        <code>{token}</code>
                      </td>
                      <td className="p-2">{value}</td>
                      <td className="p-2">{pixels}</td>
                      <td className="p-2">
                        <div
                          className="bg-neutral-500 rounded-full"
                          style={{
                            width: pixels,
                            height: pixels,
                          }}
                        ></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shadow Scale</CardTitle>
          <CardDescription>
            Shadow tokens for depth and elevation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Shadow SM</div>
              <div className="h-24 w-full rounded-md bg-card shadow-sm"></div>
              <code className="text-xs">--shadow-sm</code>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Shadow Base</div>
              <div className="h-24 w-full rounded-md bg-card shadow"></div>
              <code className="text-xs">--shadow</code>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Shadow MD</div>
              <div className="h-24 w-full rounded-md bg-card shadow-md"></div>
              <code className="text-xs">--shadow-md</code>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Shadow LG</div>
              <div className="h-24 w-full rounded-md bg-card shadow-lg"></div>
              <code className="text-xs">--shadow-lg</code>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Shadow XL</div>
              <div className="h-24 w-full rounded-md bg-card shadow-xl"></div>
              <code className="text-xs">--shadow-xl</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden">{ensureColors()}</div>
    </div>
  );
};

export default TokensShowcase;
