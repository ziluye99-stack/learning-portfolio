"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Map, Rocket, Target } from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: House },
  { href: "/growth", label: "成长路径", icon: Map },
  { href: "/milestones", label: "里程碑", icon: Target },
  { href: "/product-progress", label: "产品进展", icon: Rocket }
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
