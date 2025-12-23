import type { Metadata } from "next";
import { Inter, Tektur } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400","500","600","700"],
})
const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
  weight: ["400","500","600","700"],
})  

export const metadata: Metadata = {
  title: "MyGitWrap",
  description: "Generate a personalized github wrap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${tektur.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
