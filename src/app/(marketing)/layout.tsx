import { ReactNode } from "react";
import { Navbar } from "../../components/ui/marketing/_navbar";
import '@/styles/globals-marketing.css';
import { MobileBottomNav } from "../../components/ui/marketing/_mobileBottomNav";

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
