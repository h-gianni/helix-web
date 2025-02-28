"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/core/Button";
import { Smartphone, Play, User, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { navConfig } from "@/app/(marketing)/config/navigation-config";

// Mobile Navigation Item Component for the drawer
const MobileNavItem = ({ 
  title, 
  href, 
  description,
  onClick
}: { 
  title: string; 
  href: string; 
  description: string;
  onClick?: () => void;
}) => {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex flex-col gap-1 p-4 hover:bg-accent rounded-md"
    >
      <span className="font-medium">{title}</span>
      <span className="text-sm text-muted-foreground">{description}</span>
    </Link>
  );
};

// Mobile Navigation Section Component for the drawer
const MobileNavSection = ({ 
  title, 
  items,
  onClick
}: { 
  title: string; 
  items: Array<{ title: string; href: string; description: string }>;
  onClick?: () => void;
}) => {
  return (
    <div className="py-4">
      <h3 className="px-4 text-sm font-semibold text-foreground/70 mb-2">{title}</h3>
      <div className="flex flex-col">
        {items.map((item) => (
          <MobileNavItem 
            key={item.title} 
            {...item} 
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

export const MobileBottomNav = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Fullscreen Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background z-40 flex flex-col lg:hidden">
          {/* Fixed top header */}
          <div className="sticky top-0 bg-background z-10 border-b">
            <div className="container px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="marketing-h4">UpScore</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:text-primary"
                  onClick={closeMenu}
                >
                  <X className="size-6" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pb-32">
            <div className="container px-4">
              <MobileNavSection 
                title="Features" 
                items={navConfig.features} 
                onClick={closeMenu}
              />
              
              <MobileNavSection 
                title="Resources" 
                items={navConfig.resources} 
                onClick={closeMenu}
              />
              
              <div className="py-4">
                <h3 className="px-4 text-sm font-semibold text-foreground/70 mb-2">Pages</h3>
                {navConfig.mainLinks.map((link) => (
                  <Link 
                    key={link.title}
                    href={link.href} 
                    onClick={closeMenu}
                    className="flex items-center gap-2 p-4 hover:bg-accent rounded-md"
                  >
                    <span className="font-medium">{link.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Fixed bottom actions */}
          <div className="fixed bottom-16 left-0 right-0 bg-background border-t py-4 px-4">
            <div className="container flex flex-col gap-2">
              <Button className="w-full" asChild>
                <Link href="/get-app" onClick={closeMenu}>
                  Get the Mobile App
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/demo" onClick={closeMenu}>
                  Watch a demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar - Always visible */}
      <div className="fixed bottom-0 left-0 z-50 w-full bg-background border-t lg:hidden">
        <div className="grid grid-cols-5 h-16">
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center ${isMenuOpen ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            {isMenuOpen ? (
              <>
                <X className="size-5" />
                <span className="text-xs mt-1">Close</span>
              </>
            ) : (
              <>
                <Menu className="size-5" />
                <span className="text-xs mt-1">Menu</span>
              </>
            )}
          </button>
          
          <Link
            href="/demo"
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary"
          >
            <Play className="size-5" />
            <span className="text-xs mt-1">Demo</span>
          </Link>
          
          <Link
            href="/get-app"
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary"
          >
            <Smartphone className="size-5" />
            <span className="text-xs mt-1">Download App</span>
          </Link>
          
          <SignedOut>
            <Link
              href="/sign-in"
              className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary"
            >
              <User className="size-5" />
              <span className="text-xs mt-1">Sign In</span>
            </Link>
          </SignedOut>
          
          <SignedIn>
            <Link
              href="/dashboard"
              className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary"
            >
              <BookOpen className="size-5" />
              <span className="text-xs mt-1">Docs</span>
            </Link>
          </SignedIn>
          
          <SignedOut>
            <Link
              href="/sign-up"
              className="flex flex-col items-center justify-center text-primary font-medium"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                <span className="text-primary-foreground text-xs font-bold">+</span>
              </div>
              <span className="text-xs mt-1">Try it</span>
            </Link>
          </SignedOut>
          
          <SignedIn>
            <Link
              href="/dashboard"
              className="flex flex-col items-center justify-center text-primary font-medium"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                <span className="text-primary-foreground text-xs font-bold">+</span>
              </div>
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
          </SignedIn>
        </div>
      </div>
    </>
  );
};