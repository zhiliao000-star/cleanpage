import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CleanPage",
  description: "Paste a link and get a clean readable markdown page.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
