import type { Metadata } from "next";
import { Playfair_Display, Lora, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "800"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "THE YARN SIDE — Polished Handmade Crochet Boutique",
  description: "Welcome to the cozy side. May the yarn be with you. Discover beautiful, high-quality handmade crochet bags, amigurumi toys, wearables, and custom orders.",
  icons: {
    icon: "/assets/logos/monogram_ys.png",
    apple: "/assets/logos/monogram_ys.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable} ${lato.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
