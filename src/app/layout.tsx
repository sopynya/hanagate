import type { Metadata } from "next";
import { Ubuntu, M_PLUS_Rounded_1c, Kosugi_Maru } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  variable: "--ubuntu",
  subsets: ["latin"],
  display: "swap"
});

const mplus = M_PLUS_Rounded_1c({
  weight: ["300", "400", "700"],
  variable: "--mplus",
  subsets: ["latin"],
  display: "swap"
});

const kosugi = Kosugi_Maru({
  weight: ["400"],
  variable: "--kosugi",
  subsets: ["latin"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "Hana Gate",
  description: "Discover and list your favorite visual novels in a cute website.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${ubuntu.variable} ${mplus.variable} ${kosugi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
