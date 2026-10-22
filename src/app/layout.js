import { Geist, Geist_Mono } from "next/font/google";
import "react-photo-view/dist/react-photo-view.css";
import "./globals.css";
import { Toaster } from "sonner";
import { ProductProvider } from "../context/ProductContext";
import GlobalAppShell from "@/components/common/GlobalAppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DACBY Dashboard | Operations & Analytics",
  description: "DACBY internal operations, inventory, orders, customer CRM, live data, and SLA breach management.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ProductProvider>
          <GlobalAppShell>{children}</GlobalAppShell>
        </ProductProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
