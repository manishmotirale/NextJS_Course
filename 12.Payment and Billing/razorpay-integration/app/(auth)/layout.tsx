import { requireUnAuth } from "@/lib/auth-guard";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnAuth();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {children}
    </div>
  );
}
