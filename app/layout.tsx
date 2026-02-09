import { Header } from "@/components/Header";
import { ModalProvider } from "@/contexts/ModalContext";
import { RecordingsProvider } from "@/contexts/RecordingsContext";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/utils/constants";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ModalProvider>
          <RecordingsProvider>
            <Header />
            {children}
          </RecordingsProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
