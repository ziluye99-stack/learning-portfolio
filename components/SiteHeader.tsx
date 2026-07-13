"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, FolderKanban, LayoutDashboard, ListChecks, LockKeyhole } from "lucide-react";

const navItems = [
  { href: "/", label: "总览", icon: LayoutDashboard },
  { href: "/learning", label: "学习路径", icon: ListChecks },
  { href: "/milestones", label: "里程碑", icon: BarChart3 },
  { href: "/projects", label: "实战项目", icon: FolderKanban },
  { href: "/tutorials", label: "教程链接", icon: BookOpen },
  { href: "/admin", label: "后台", icon: LockKeyhole }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="返回首页">
          <span className="brand-mark">Y</span>
          <span>学习作品集</span>
        </Link>
        <nav className="site-nav" aria-label="主导航">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link className={active ? "is-active" : undefined} href={item.href} key={item.href}>
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
