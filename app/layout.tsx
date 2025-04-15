import type { Metadata } from "next";
import { Raleway } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/header/Navbar";

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'], // поддерживаемые языки
  weight: ['400', '500', '600', '700'], // нужные начертания
  variable: '--font-raleway', // CSS-переменная для использования в Tailwind
});

export const metadata: Metadata = {
  title: "CloneVK",
  description: "Это новая амбициозная социальная сеть от ноунейм разработчиков!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${raleway.variable} ${raleway.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
