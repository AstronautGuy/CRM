"use client";

import { api } from "~/trpc/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

export default function UsersPage() {
  const { data: users, isLoading } = api.superadmin.getUsers.useQuery();

  if (isLoading) return <div className="text-zinc-400">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Global Users</h2>
          <p className="text-zinc-400 text-sm">View all registered users across the platform.</p>
        </div>
      </div>

      <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Email</TableHead>
              <TableHead className="text-zinc-400">System Role</TableHead>
              <TableHead className="text-zinc-400 text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-medium text-zinc-100">{user.name}</TableCell>
                <TableCell className="text-zinc-400">{user.email}</TableCell>
                <TableCell>
                  {user.systemRole === "SUPER_ADMIN" ? (
                    <Badge variant="destructive" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-0">SUPER ADMIN</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-0">USER</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right text-zinc-400">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
            {users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-zinc-500 py-6">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
