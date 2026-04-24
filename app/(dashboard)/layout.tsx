import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, PlayCircle, Library, Users, Globe,
  BarChart2, CreditCard, Zap, Bot, Link2, Settings, Radio,
} from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
            {[
              { href: "/dashboard",                icon: LayoutDashboard, label: "Dashboard" },
              { href: "/dashboard/webinars",       icon: PlayCircle,      label: "Webinars" },
              { href: "/dashboard/templates",      icon: Library,         label: "Templates" },
              { href: "/dashboard/evergreen",      icon: Globe,           label: "Evergreen Rooms" },
              { href: "/dashboard/live",           icon: Radio,           label: "Live Webinars" },
              { href: "/dashboard/presenters",     icon: Bot,             label: "AI Presenters" },
              { href: "/dashboard/analytics",      icon: BarChart2,       label: "Analytics" },
              { href: "/dashboard/affiliates",     icon: Users,           label: "Affiliates" },
              { href: "/dashboard/integrations",   icon: Link2,           label: "Integrations" },
              { href: "/dashboard/billing",        icon: CreditCard,      label: "Billing" },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
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

      {/* Main content + footer */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>

        {/* Dashboard footer */}
        <footer className="border-t border-white/5 px-6 py-4 text-center">
          <p className="text-white/20 text-xs">
            WebinarForge AI, LLC &nbsp;■&nbsp; All Rights Reserved © 2026 &nbsp;■&nbsp; 19179 Blanco Rd Ste 105 PMB 1036, San Antonio, TX 78258
          </p>
        </footer>
      </div>
    </div>
  );
}
