// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Zap, CheckCircle } from "lucide-react";

const TRIAL_PERKS = [
  "2 AI-generated webinars",
  "1 AI presenter profile",
  "Evergreen room included",
  "No credit card required",
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#080812] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">

        {/* Left — value prop */}
        <div className="hidden lg:block">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg">
              WebinarForge <span className="text-purple-400">AI</span>
            </span>
          </Link>
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Start your 14-day<br />
            <span className="gradient-text">free trial</span>
          </h1>
          <p className="text-white/45 text-base mb-8 leading-relaxed">
            Build your first AI-powered evergreen webinar in under 10 minutes.
            No credit card. No commitment.
          </p>
          <div className="space-y-3">
            {TRIAL_PERKS.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-sm text-white/60">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Clerk SignUp */}
        <div className="flex flex-col items-center">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-white">
              WebinarForge <span className="text-purple-400">AI</span>
            </span>
          </Link>

          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#8B5CF6",
                colorBackground: "#13131f",
                colorText: "#ffffff",
                colorTextSecondary: "rgba(255,255,255,0.5)",
                colorInputBackground: "rgba(255,255,255,0.05)",
                colorInputText: "#ffffff",
                borderRadius: "0.75rem",
                colorNeutral: "rgba(255,255,255,0.1)",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-0 p-0",
                headerTitle: "font-display text-xl font-bold text-white",
                headerSubtitle: "text-white/40 text-sm",
                socialButtonsBlockButton:
                  "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors",
                formFieldInput:
                  "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-purple-500/50",
                formButtonPrimary:
                  "bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity",
                footerActionLink: "text-purple-400 hover:text-purple-300",
                dividerLine: "bg-white/8",
                dividerText: "text-white/30",
              },
            }}
          />

          <p className="mt-4 text-xs text-white/25 text-center max-w-xs">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
