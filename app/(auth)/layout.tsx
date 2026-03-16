// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Auth pages handle their own full-screen layout.
  // This wrapper exists only to allow route grouping without additional markup.
  return <>{children}</>;
}
