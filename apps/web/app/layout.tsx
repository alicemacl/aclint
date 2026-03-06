import type { Metadata } from "next";
import "./globals.css";
import { A11yDevToolsWrapper } from "./A11yDevToolsWrapper";
import { Header } from "@/src/layout";

export const metadata: Metadata = {
  title: "A11y Lens – Test",
  description: "Test app for a11y-companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>

        <A11yDevToolsWrapper />
      </body>
    </html>
  );
}
