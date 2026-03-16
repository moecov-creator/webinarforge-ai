// components/evergreen/timed-comment.tsx
import { cn } from "@/lib/utils";

type CommentType =
  | "SOCIAL_PROOF"
  | "FAQ"
  | "OBJECTION"
  | "MODERATOR"
  | "URGENCY"
  | "CTA_REMINDER"
  | "TESTIMONIAL";

interface TimedCommentItemProps {
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  type: CommentType;
  /** For use in the editor list view */
  triggerAt?: number;
  className?: string;
  /** Animate in as a new comment */
  animate?: boolean;
}

const TYPE_STYLES: Record<CommentType, { name: string; color: string }> = {
  SOCIAL_PROOF: { name: "Social Proof", color: "text-green-400" },
  FAQ:          { name: "FAQ",          color: "text-blue-400" },
  OBJECTION:    { name: "Objection",    color: "text-orange-400" },
  MODERATOR:    { name: "Moderator",    color: "text-blue-300" },
  URGENCY:      { name: "Urgency",      color: "text-red-400" },
  CTA_REMINDER: { name: "CTA",          color: "text-purple-400" },
  TESTIMONIAL:  { name: "Testimonial",  color: "text-yellow-400" },
};

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Initials({ name, color }: { name: string; color: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className={cn(
      "w-7 h-7 rounded-full bg-white/10 flex items-center justify-center",
      "flex-shrink-0 text-xs font-semibold",
      color.replace("text-", "text-")
    )}>
      {initial}
    </div>
  );
}

export function TimedCommentItem({
  authorName,
  content,
  type,
  triggerAt,
  className,
  animate,
}: TimedCommentItemProps) {
  const meta = TYPE_STYLES[type] ?? TYPE_STYLES.SOCIAL_PROOF;

  return (
    <div className={cn(
      "flex gap-2.5",
      animate && "animate-in fade-in slide-in-from-bottom-2 duration-300",
      className
    )}>
      <Initials name={authorName} color={meta.color} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={cn("text-xs font-medium", meta.color)}>
            {authorName}
          </span>
          {triggerAt !== undefined && (
            <span className="text-[10px] text-white/20 font-mono">
              {formatSeconds(triggerAt)}
            </span>
          )}
        </div>
        <p className="text-xs text-white/55 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
