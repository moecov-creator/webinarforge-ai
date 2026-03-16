// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, PlayCircle, Library,
  Users, Globe, BarChart2, CreditCard, Zap,
  Bot, Link2, Settings,
} from "lucide-react";
import { SidebarLink } from "@/components/dashboard/sidebar-link";

const NAV_ITEMS = [
  { href: "/dashboard",                 label: "Dashboard",      icon: LayoutDashboard, exact: true },
  { href: "/dashboard/webinars",        label: "Webinars",       icon: PlayCircle },
  { href: "/dashboard/templates",       label: "Templates",      icon: Library },
  { href: "/dashboard/evergreen",       label: "Evergreen Rooms",icon: Globe },
  { href: "/dashboard/presenters",      label: "AI Presenters",  icon: Bot },
  { href: "/dashboard/analytics",       label: "Analytics",      icon: BarChart2 },
  { href: "/dashboard/affiliates",      label: "Affiliates",     icon: Users },
  { href: "/dashboard/integrations",    label: "Integrations",   icon: Link2 },
  { href: "/dashboard/billing",         label: "Billing",        icon: CreditCard },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-[#09090f] text-white flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 border-r border-white/5 bg-[#09090f] flex flex-col z-30">
        {/* Logo */}
        <div className="h-16 px-5 flex items-center border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm">
              WebinarForge <span className="text-purple-400">AI</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <SidebarLink key={item.href} {...item} />
            ))}
          </div>
        </nav>

        {/* Bottom user section */}
        <div className="border-t border-white/5 p-4 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/40 truncate">Account</p>
          </div>
          <Link href="/dashboard/billing">
            <Settings className="w-4 h-4 text-white/20 hover:text-white/50 transition-colors" />
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}
