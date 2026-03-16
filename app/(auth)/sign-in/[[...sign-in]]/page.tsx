// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#080812] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-white text-lg">
          WebinarForge <span className="text-purple-400">AI</span>
        </span>
      </Link>

      {/* Clerk's hosted sign-in UI */}
      <SignIn
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
            rootBox: "w-full max-w-md",
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

      <p className="mt-6 text-sm text-white/30">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 transition-colors">
          Start your free trial
        </Link>
      </p>
    </div>
  );
}
