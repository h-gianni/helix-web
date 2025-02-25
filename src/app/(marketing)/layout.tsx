import { ReactNode } from "react";
import { Navbar } from "./_components/_navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
