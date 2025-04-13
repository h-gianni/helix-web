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
    <div className="space-y-8 mt-8">
      <div className="grid grid-cols-3 gap-8 pt-12 pb-16">
        {/* Logo 1 */}
        <div className="flex flex-row items-center justify-center gap-4">
          <BrandLogo variant="hero" />
        </div>
        {/* Logo 2 */}
        <div className="flex flex-col gap-8 items-center justify-center">
          <div className="flex flex-row items-center justify-center gap-4">
            <BrandLogo />
          </div>
        </div>
        {/* Logo 3 */}
        <div className="flex flex-row items-center justify-center gap-8">
          <div className="flex justify-center">
            <BrandLogo variant="icon" className="size-4" />
          </div>
          <div className="flex justify-center">
          <BrandLogo variant="icon" className="size-6" />
          </div>
          <div className="flex justify-center">
          <BrandLogo variant="icon" className="size-8" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="heading-1">Design Tokens</h2>
        <p className="body-lg">
          Visual design tokens for colors, typography, spacing, and shadows
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>UI Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Primary Colors */}
            <div>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-0">
                {[
                  { level: "lightest", class: "bg-primary-lightest" },
                  { level: "lighter", class: "bg-primary-lighter" },
                  { level: "light", class: "bg-primary-light" },
                  { level: "base", class: "bg-primary-base" },
                  { level: "dark", class: "bg-primary-dark" },
                  { level: "darker", class: "bg-primary-darker" },
                  { level: "darkest", class: "bg-primary-darkest" },
                ].map((item) => (
                  <div key={item.level} className="space-y-1">
                    <div className={`h-16 w-full ${item.class}`}></div>
                    <div className="flex justify-between">
                      <code className="text-xs">--primary-{item.level}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neutral (Grayscale) */}
            <div>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-0">
                {[
                  { level: "lightest", class: "bg-neutral-lightest" },
                  { level: "lighter", class: "bg-neutral-lighter" },
                  { level: "light", class: "bg-neutral-light" },
                  { level: "base", class: "bg-neutral-base" },
                  { level: "dark", class: "bg-neutral-dark" },
                  { level: "darker", class: "bg-neutral-darker" },
                  { level: "darkest", class: "bg-neutral-darkest" },
                ].map((item) => (
                  <div key={item.level} className="space-y-1">
                    <div className={`h-16 w-full ${item.class}`}></div>
                    <div className="flex justify-between">
                      <code className="text-xs">--neutral-{item.level}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Colors */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
              {/* Success */}
              <div>
                <h3 className="heading-5 mb-2">Success</h3>
                <div className="space-y-0">
                  {[
                    { level: "lightest", class: "bg-success-lightest" },
                    { level: "lighter", class: "bg-success-lighter" },
                    { level: "light", class: "bg-success-light" },
                    { level: "base", class: "bg-success-base" },
                    { level: "dark", class: "bg-success-dark" },
                    { level: "darker", class: "bg-success-darker" },
                    { level: "darkest", class: "bg-success-darkest" },
                  ].map((item) => (
                    <div key={item.level} className="space-y-0">
                      <div className={`h-16 w-full ${item.class}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div>
                <h3 className="heading-5 mb-2">Warning</h3>
                <div className="space-y-0">
                  {[
                    { level: "lightest", class: "bg-warning-lightest" },
                    { level: "lighter", class: "bg-warning-lighter" },
                    { level: "light", class: "bg-warning-light" },
                    { level: "base", class: "bg-warning-base" },
                    { level: "dark", class: "bg-warning-dark" },
                    { level: "darker", class: "bg-warning-darker" },
                    { level: "darkest", class: "bg-warning-darkest" },
                  ].map((item) => (
                    <div key={item.level} className="space-y-0">
                      <div className={`h-16 w-full ${item.class}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destructive */}
              <div>
                <h3 className="heading-5 mb-2">Destructive</h3>
                <div className="space-y-0">
                  {[
                    { level: "lightest", class: "bg-destructive-lightest" },
                    { level: "lighter", class: "bg-destructive-lighter" },
                    { level: "light", class: "bg-destructive-light" },
                    { level: "base", class: "bg-destructive-base" },
                    { level: "dark", class: "bg-destructive-dark" },
                    { level: "darker", class: "bg-destructive-darker" },
                    { level: "darkest", class: "bg-destructive-darkest" },
                  ].map((item) => (
                    <div key={item.level} className="space-y-0">
                      <div className={`h-16 w-full ${item.class}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accent */}
              <div>
                <h3 className="heading-5 mb-2">Accent</h3>
                <div className="space-y-0">
                  {[
                    { level: "lightest", class: "bg-accent-lightest" },
                    { level: "lighter", class: "bg-accent-lighter" },
                    { level: "light", class: "bg-accent-light" },
                    { level: "base", class: "bg-accent-base" },
                    { level: "dark", class: "bg-accent-dark" },
                    { level: "darker", class: "bg-accent-darker" },
                    { level: "darkest", class: "bg-accent-darkest" },
                  ].map((item) => (
                    <div key={item.level} className="space-y-0">
                      <div className={`h-16 w-full ${item.class}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="heading-5 mb-2">Info</h3>
                <div className="space-y-0">
                  {[
                    { level: "lightest", class: "bg-info-lightest" },
                    { level: "lighter", class: "bg-info-lighter" },
                    { level: "light", class: "bg-info-light" },
                    { level: "base", class: "bg-info-base" },
                    { level: "dark", class: "bg-info-dark" },
                    { level: "darker", class: "bg-info-darker" },
                    { level: "darkest", class: "bg-info-darkest" },
                  ].map((item) => (
                    <div key={item.level} className="space-y-0">
                      <div className={`h-16 w-full ${item.class}`}></div>
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
                  <div className="w-full rounded-md bg-background">
                    <div className="p-4 text-foreground">
                      <div className="grid grid-cols-2 text-sm gap-2">
                        <div>
                          <code>--background</code>
                          <div className="text-xs text-foreground-weak">
                            var(--neutral-lightest)
                          </div>
                        </div>
                        <div>
                          <code>--foreground</code>
                          <div className="text-xs text-foreground-weak">
                            var(--neutral-darker)
                          </div>
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
                    <div className="p-4 font-medium text-foreground">
                      <div className="grid grid-cols-2 text-sm gap-2">
                        <div>
                          <code>--card</code>
                          <div className="text-xs text-foreground-weak">
                            var(--white)
                          </div>
                        </div>
                        <div>
                          <code>--card-foreground</code>
                          <div className="text-xs text-foreground-weak">
                            var(--neutral-darker)
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-2">
                  <div className="w-full rounded-md bg-popover">
                    <div className="p-4 font-medium text-popover-foreground">
                      <div className="grid grid-cols-2 text-sm gap-2">
                        <div>
                          <code>--popover</code>
                          <div className="text-xs text-foreground-weak">
                            var(--neutral-weakest)
                          </div>
                        </div>
                        <div>
                          <code>--popover-foreground</code>
                          <div className="text-xs text-foreground-weak">
                            var(--neutral-strongest)
                          </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="w-full text-center p-4 font-semibold bg-secondary text-secondary-foreground">
                    Secondary
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--secondary</code>
                    </div>
                    <div>
                      <code>--secondary-foreground</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full text-center p-4 font-semibold bg-destructive text-destructive-foreground">
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

                <div className="space-y-2">
                  <div className="w-full text-center p-4 border border-border">
                    Border
                  </div>
                  <div className="text-xs">
                    <div>
                      <code>--border</code>
                    </div>
                    <div>
                      <code>--border-border</code>
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
                      <code>--input</code>
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
          <CardTitle>Font Families</CardTitle>
          <CardDescription>
            Typography foundation for the design system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Sans Serif</div>
              <div className="p-4 border rounded-md bg-card">
                <p style={{ fontFamily: "var(--font-sans)" }}>
                  The quick brown fox jumps over the lazy dog. 0123456789
                </p>
              </div>
              <code className="text-xs">--font-sans</code>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Monospace</div>
              <div className="p-4 border rounded-md bg-card">
                <p style={{ fontFamily: "var(--font-mono)" }}>
                  The quick brown fox jumps over the lazy dog. 0123456789
                </p>
              </div>
              <code className="text-xs">--font-mono</code>
            </div>
          </div>

          <div className="space-y-4 py-4">
            <h3 className="heading-3">Font Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <div className="heading-5 mb-1">2XS (10px)</div>
                  <p style={{ fontSize: "var(--text-2xs)" }}>
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-2xs</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">XS (11px)</div>
                  <p style={{ fontSize: "var(--text-xs)" }}>
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-xs</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">SM (12px)</div>
                  <p style={{ fontSize: "var(--text-sm)" }}>
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-sm</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">Base (14px)</div>
                  <p style={{ fontSize: "var(--text-base)" }}>
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-base</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">LG (16px)</div>
                  <p style={{ fontSize: "var(--text-lg)" }}>
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-lg</code>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="heading-5 mb-1">XL (20px)</div>
                  <p style={{ fontSize: "var(--text-xl)" }}>
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-xl</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">2XL (24px)</div>
                  <p style={{ fontSize: "var(--text-2xl)" }}>
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-2xl</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">3XL (28px)</div>
                  <p style={{ fontSize: "var(--text-3xl)" }}>
                    The five boxing wizards jump quickly.
                  </p>
                  <code className="text-xs">--text-3xl</code>
                </div>

                <div>
                  <div className="heading-5 mb-1">4XL (34px)</div>
                  <p style={{ fontSize: "var(--text-4xl)" }}>
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
                This smaller text size is used for secondary information,
                supportive text, and areas where space is limited.
              </p>
              <code className="text-xs">.body-sm</code>
            </div>

            <div>
              <div className="heading-6">Body Extra Small</div>
              <p className="body-xs">
                This smaller text size is used for secondary information,
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
                    <th className="text-left p-2 border-b">Token</th>
                    <th className="text-left p-2 border-b">Value</th>
                    <th className="text-left p-2 border-b">Pixels</th>
                    <th className="text-left p-2 border-b">Example</th>
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
                    <tr key={token} className="border-b">
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
                    <th className="text-left p-2 border-b">Token</th>
                    <th className="text-left p-2 border-b">Value</th>
                    <th className="text-left p-2 border-b">Pixels</th>
                    <th className="text-left p-2 border-b">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["--height-control-sm", "2rem", "32px"],
                    ["--height-control-base", "2.5rem", "38px"],
                    ["--height-control-lg", "2.75rem", "44px"],
                  ].map(([token, value, pixels]) => (
                    <tr key={token} className="border-b">
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
                    <th className="text-left p-2 border-b">Token</th>
                    <th className="text-left p-2 border-b">Value</th>
                    <th className="text-left p-2 border-b">Pixels</th>
                    <th className="text-left p-2 border-b">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["--size-icon-sm", "0.75rem", "12px"],
                    ["--size-icon-base", "1rem", "16px"],
                    ["--size-icon-lg", "1.25rem", "20px"],
                  ].map(([token, value, pixels]) => (
                    <tr key={token} className="border-b">
                      <td className="p-2">
                        <code>{token}</code>
                      </td>
                      <td className="p-2">{value}</td>
                      <td className="p-2">{pixels}</td>
                      <td className="p-2">
                        <div
                          className="bg-primary rounded-full"
                          style={{
                            width: value,
                            height: value,
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
              <div className="h-24 w-full rounded-md bg-card shadow-base"></div>
              <code className="text-xs">--shadow-base</code>
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
    </div>
  );
};

export default TokensShowcase;
