// This layout ensures the signin page is NOT wrapped by the main admin layout
// By not using 'use client', this becomes a server component that bypasses client-side layouts
export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

