'use client';

// This layout ensures the signin page is NOT wrapped by the main admin layout
export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

