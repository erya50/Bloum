import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { IosInstallPrompt } from "@/components/ios-install-prompt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BLOUM – Woman. Human. Part of the story.",
  description:
    "BLOUM verbindet digitale Learning Journeys, Workshops & Events und einen kuratierten Concept Store, um Frauen ganzheitlich in ihrer beruflichen und persönlichen Entwicklung zu stärken.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BLOUM",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ef",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <ServiceWorkerRegistration />
        <SiteHeader userName={user?.name ?? null} />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
        <IosInstallPrompt />
      </body>
    </html>
  );
}
