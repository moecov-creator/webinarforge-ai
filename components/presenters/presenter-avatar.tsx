// components/presenters/presenter-avatar.tsx
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

interface PresenterAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  isDefault?: boolean;
  className?: string;
}

const SIZES = {
  sm: { outer: "w-8 h-8",  text: "text-xs",  icon: "w-3.5 h-3.5" },
  md: { outer: "w-11 h-11", text: "text-sm",  icon: "w-4 h-4" },
  lg: { outer: "w-16 h-16", text: "text-lg",  icon: "w-6 h-6" },
  xl: { outer: "w-20 h-20", text: "text-2xl", icon: "w-8 h-8" },
};

// Deterministic color from name string
function nameToColor(name: string): string {
  const colors = [
    "#8B5CF6", "#3B82F6", "#10B981",
    "#F59E0B", "#EF4444", "#EC4899",
    "#06B6D4", "#6366F1",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function PresenterAvatar({
  name,
  avatarUrl,
  size = "md",
  color,
  isDefault,
  className,
}: PresenterAvatarProps) {
  const sz = SIZES[size];
  const derivedColor = color ?? nameToColor(name);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className={cn(
        "relative rounded-xl flex items-center justify-center flex-shrink-0",
        "font-display font-bold",
        sz.outer,
        sz.text,
        className
      )}
      style={{
        backgroundColor: derivedColor + "25",
        border: `1px solid ${derivedColor}40`,
        color: derivedColor,
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full rounded-xl object-cover"
        />
      ) : (
        <span>{initials || <Bot className={sz.icon} />}</span>
      )}

      {/* Default badge dot */}
      {isDefault && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-purple-500 border-2 border-[#09090f]" />
      )}
    </div>
  );
}
