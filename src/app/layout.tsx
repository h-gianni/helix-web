import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
      <html lang="en" suppressHydrationWarning>
        <body className={`${robotoFlex.variable} antialiased`}>
          <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}