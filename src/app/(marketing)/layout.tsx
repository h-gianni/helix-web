import { ReactNode } from "react";
import { Navbar } from "../../components/ui/marketing/_navbar";
import '@/styles/globals-marketing.css';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
