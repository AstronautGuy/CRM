"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { format } from "date-fns";
import { Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [newKey, setNewKey] = useState<{ rawKey: string; name: string } | null>(null);

  const utils = api.useUtils();
  const { data: apiKeys, isLoading } = api.apiKeys.list.useQuery();

  const createKeyMutation = api.apiKeys.create.useMutation({
    onSuccess: (data) => {
      setNewKey(data);
      utils.apiKeys.list.invalidate();
      setKeyName("");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create API key");
    }
  });

  const revokeKeyMutation = api.apiKeys.revoke.useMutation({
    onSuccess: () => {
      toast.success("API key revoked");
      utils.apiKeys.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to revoke API key");
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    createKeyMutation.mutate({ name: keyName });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    // Only clear the new key when the dialog is actually closed
    // so we don't flash empty state during the exit animation
    setTimeout(() => setNewKey(null), 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Manage API keys for programmatic access to your DevCRM account.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {!newKey ? (
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Generate New API Key</DialogTitle>
                  <DialogDescription>
                    This key will allow access to your DevCRM data. Keep it secure.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Key Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Production Server, Zapier Integration"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!keyName.trim() || createKeyMutation.isPending}
                  >
                    {createKeyMutation.isPending ? "Generating..." : "Generate"}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div>
                <DialogHeader>
                  <DialogTitle>API Key Generated</DialogTitle>
                  <DialogDescription className="text-destructive font-semibold">
                    Please copy this key now. You won't be able to see it again!
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6">
                  <div className="flex items-center space-x-2">
                    <Input readOnly value={newKey.rawKey} className="font-mono" />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => copyToClipboard(newKey.rawKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCloseDialog}>
                    I have copied it safely
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Loading API keys...
                </TableCell>
              </TableRow>
            ) : apiKeys?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No API keys generated yet.
                </TableCell>
              </TableRow>
            ) : (
              apiKeys?.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>{format(new Date(apiKey.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm(`Are you sure you want to revoke the key "${apiKey.name}"?`)) {
                          revokeKeyMutation.mutate({ id: apiKey.id });
                        }
                      }}
                      disabled={revokeKeyMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
