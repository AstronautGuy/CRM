"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  
  const [error, setError] = useState<string | null>(null);

  const registerMutation = api.auth.register.useMutation({
    onSuccess: async () => {
      // Auto-login after successful registration
      const res = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
      });

      if (res?.error) {
        router.push("/login"); // Fallback to login
      } else {
        router.push("/pipeline");
        router.refresh();
      }
    },
    onError: (e) => {
      setError(e.message || "An error occurred during registration.");
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    registerMutation.mutate({
      name,
      email,
      phone,
      password,
      organizationName,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Start managing your CRM today
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-900/50 p-4 border border-red-800">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="text-sm font-medium text-zinc-300">Full Name</label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-zinc-950 border-zinc-800 text-white"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-zinc-300">Organization / Company Name</label>
              <Input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="mt-1 bg-zinc-950 border-zinc-800 text-white"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300">Email Address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-zinc-950 border-zinc-800 text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300">Phone (Optional)</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 bg-zinc-950 border-zinc-800 text-white"
                placeholder="+1 555-0199"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-zinc-950 border-zinc-800 text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating account..." : "Sign up"}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
