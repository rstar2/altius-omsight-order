import type { Metadata } from "next";
import { Inter } from "next/font/google";

// and client providers (that use Browser API, etc... - that are client components) like Chakra-UI
import ClientProviders from "./client.providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Altius Omsight Orders",
  description: "Team members of Altius - Orders of Omsight products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
