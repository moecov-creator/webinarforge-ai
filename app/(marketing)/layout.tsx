// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Marketing pages own their nav + footer. No shared chrome needed.
  return <>{children}</>;
}
