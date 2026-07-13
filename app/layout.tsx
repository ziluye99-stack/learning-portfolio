import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "个人学习作品展示站",
  description: "记录每日学习路径、阶段进度和实战项目的个人作品展示网站。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="site-shell">
          <SiteHeader />
          {children}
          <footer className="site-footer">
            <div className="container">持续学习，持续复盘，持续交付。</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
