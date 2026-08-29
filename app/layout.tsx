import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WOTU - Báo Giá Tự Động",
  description: "Phần mềm báo giá tự động cho thiết kế và xây dựng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
