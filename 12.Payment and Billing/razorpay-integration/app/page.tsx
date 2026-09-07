// app/page.tsx
import { requireAuth } from "@/lib/auth-guard";
import Image from "next/image";
import Link from "next/link";
import LogoutBtn from "@/components/logout-button";

export default async function HomePage() {
  const session = await requireAuth();
  const { user } = session;

  // Safely read plan from user (some user types may not include `plan`)
  const plan = (user as any)?.plan ?? "FREE";

  // Format dates nicely
  const formatDate = (dateValue: string | Date | null | undefined) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Determine plan badge styling
  const isPro = plan === "PRO";
  const planBadge = isPro
    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
    : "bg-gray-100 text-gray-700";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header / Welcome */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Welcome back, {user.name}</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
          {/* Decorative top bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="p-6 md:p-8">
            {/* Avatar + Name + Plan */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative">
                <div className="w-28 h-28 rounded-full ring-4 ring-white shadow-lg overflow-hidden">
                  <Image
                    src={
                      user.image ||
                      "https://ui-avatars.com/api/?background=4F46E5&color=fff&name=" +
                        encodeURIComponent(user.name || "User")
                    }
                    alt={user.name || "User avatar"}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold ${planBadge} shadow-sm`}
                >
                  {plan}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Active
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    ID: {user.id?.slice(0, 8)}...
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {!isPro && (
                  <Link
                    href="/pricing"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2 1.343 2 3 2"
                      />
                    </svg>
                    Upgrade to Pro
                  </Link>
                )}
                <LogoutBtn />
              </div>
            </div>

            {/* Stats / Info Grid */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Member since
                    </p>
                    <p className="font-medium text-gray-800">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Last updated
                    </p>
                    <p className="font-medium text-gray-800">
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Feature Teaser (if Free) */}
            {!isPro && (
              <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Unlock all features
                      </p>
                      <p className="text-sm text-gray-600">
                        Get unlimited usage, priority support & more.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg shadow-sm hover:shadow transition border border-indigo-200 whitespace-nowrap"
                  >
                    View Plans →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer note (optional) */}
        <div className="text-center text-xs text-gray-400 mt-8">
          Secure authentication powered by Better Auth
        </div>
      </div>
    </main>
  );
}
