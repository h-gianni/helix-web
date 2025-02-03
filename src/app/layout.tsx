import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TeamsProvider } from "@/lib/context/teams-context";

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto-flex',
  axes: [
    'wdth',
    'opsz',
    'slnt',
    'GRAD',
    'XTRA',
    'YTAS',
    'YTDE',
    'YTFI',
    'YTLC',
    'YTUC',
  ]
});

export const metadata: Metadata = {
  title: "UpScore",
  description: "Performance Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning style={{ fontSize: "14px" }}>
        <body className={`${robotoFlex.variable} antialiased`}>
          <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <TeamsProvider>
              {children}
            </TeamsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}