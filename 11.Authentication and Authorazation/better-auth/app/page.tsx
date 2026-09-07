import LogoutBtn from "@/components/logout-button";
import { requireAuth } from "@/lib/auth-guard";
import Image from "next/image";

async function Home() {
  const session = await requireAuth();
  const { user } = session;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Top Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

        {/* Profile Section */}
        <div className="relative px-8 pb-8">
          <div className="-mt-16 flex flex-col items-center">
            <div className="rounded-full bg-white p-1 shadow-xl">
              <Image
                src={user.image || "https://i.pinimg.com/736x/98/ae/66/98ae66f5493ab17bb50dca1b1e93e1e1.jpg"}
                alt="Profile Picture"
                width={120}
                height={120}
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
              {user.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>

          {/* Info Cards */}
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Account Created
              </p>

              <p className="mt-2 text-sm font-medium text-slate-800">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Last Updated
              </p>

              <p className="mt-2 text-sm font-medium text-slate-800">
                {user.updatedAt
                  ? new Date(user.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex justify-center items-center">
            <LogoutBtn />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
