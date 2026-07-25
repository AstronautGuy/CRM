"use client";

import { api } from "~/trpc/react";

export function LatestPost() {
  const { data } = api.post.hello.useQuery({ text: "from DevCRM" });

  return (
    <div className="w-full max-w-xs text-slate-300">
      <p>{data?.greeting || "Loading..."}</p>
    </div>
  );
}
