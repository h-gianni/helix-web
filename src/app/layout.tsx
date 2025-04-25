import type { Metadata } from "next";
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TeamsProvider } from "@/lib/context/teams-context";
import { ClientToaster } from "@/components/ui/core/Toast/ClientToaster"
import Providers from "@/app/components/Provider";

export const metadata: Metadata = {
  title: "JustScore",
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
        {/* <head>
          <link rel="stylesheet" href="https://use.typekit.net/hxf0vyi.css" />
        </head> */}
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="ui-theme"
          >
            <TeamsProvider>
              <Providers>
                {children}
                <ClientToaster />
              </Providers>
            </TeamsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
