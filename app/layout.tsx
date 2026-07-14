import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "成长作品站",
  description: "展示介绍页、成长路径、里程碑和产品进展的个人作品网站。"
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
