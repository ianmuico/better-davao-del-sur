import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Better Davao del Sur";
const description =
  "Better Davao del Sur is under development. Coming soon for Digos City and the nine municipalities of Davao del Sur.";

export const metadata: Metadata = {
  metadataBase: new URL("https://betterdavaodelsur.org"),
  title: {
    default: `${siteName}: under development`,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName}: under development`,
    description,
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName}: under development`,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
