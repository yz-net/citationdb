import { GeistSans } from "geist/font/sans";

import SiteBanner from "~/components/SiteBanner";

import "~/styles/globals.css";

export const metadata = {
  title: "CitationDB - Fortunoff Video Archive for Holocaust Testimonies",
  description: "A database for video testimony citations",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-[#f5f5f5]">
        <SiteBanner />
        {children}
      </body>
    </html>
  );
}
