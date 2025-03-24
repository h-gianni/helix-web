import { ReactNode } from "react";
import { Navbar } from "./components/Navbar";
import '@/styles/globals-marketing.css';
import { MobileBottomNav } from "./components/MobileBottomNav";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
        {children}
      <div className="h-16 lg:hidden">
      <MobileBottomNav />
      </div>
    </div>
  );
}
