import Link from "next/link";
import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from DevCRM tRPC" });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-blue-500">
            Dev<span className="text-white">CRM</span>
          </h1>
          <p className="text-slate-400 max-w-lg text-lg">
            Multi-Tenant Customer Relationship & SaaS Subscription Platform
          </p>

          <div className="flex gap-4">
            <Link
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
              href="/admin"
            >
              Super Admin Portal →
            </Link>
            <Link
              className="rounded-lg border border-slate-800 bg-slate-900 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-800 transition"
              href="/dashboard"
            >
              Client Workspace →
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2 mt-6">
            <p className="text-sm text-slate-400">
              tRPC Connection: <span className="text-emerald-400 font-semibold">{hello ? hello.greeting : "Loading..."}</span>
            </p>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
