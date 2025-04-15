import type { Metadata } from "next";
import { Raleway } from 'next/font/google';
import "./globals.css";
<<<<<<< HEAD
=======
import Navbar from "@/components/header/Navbar";
>>>>>>> d0cb840 (подогнал сайт под дизайн + сделал кнопки для входа/регистрации/выхода)

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
<<<<<<< HEAD
=======
        <Navbar />
>>>>>>> d0cb840 (подогнал сайт под дизайн + сделал кнопки для входа/регистрации/выхода)
        {children}
      </body>
    </html>
  );
}
