import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Outfit } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const themeInitScript = `
  (() => {
    try {
      const storedTheme = window.localStorage.getItem("gocart-theme");
      if (storedTheme === "dark") {
        document.documentElement.classList.add("theme-dark");
      }
    } catch {}
  })();
`;

export const metadata: Metadata = {
  title: "GoCart. - Shop smarter",
  description: "GoCart. - Shop smarter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ClerkProvider>
          <StoreProvider>
            <Toaster />
            {children}
          </StoreProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
