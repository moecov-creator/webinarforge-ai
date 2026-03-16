// components/dashboard/sidebar-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: string | number;
}

export function SidebarLink({ href, label, icon: Icon, exact, badge }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group",
        isActive
          ? "bg-white/8 text-white border border-white/10"
          : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 flex-shrink-0 transition-colors",
          isActive ? "text-purple-400" : "text-white/30 group-hover:text-white/60"
        )}
      />
      <span className="flex-1 min-w-0 truncate">{label}</span>
      {badge !== undefined && (
        <span className={cn(
          "flex-shrink-0 min-w-[18px] h-[18px] rounded-full",
          "flex items-center justify-center",
          "text-[10px] font-semibold",
          isActive
            ? "bg-purple-500/30 text-purple-300"
            : "bg-white/8 text-white/30"
        )}>
          {badge}
        </span>
      )}
    </Link>
  );
}
