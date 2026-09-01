"use client";

import React from "react";
import { Bell } from "lucide-react";
import { api } from "~/trpc/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

export function NotificationsBell() {
  const { data: notifications, refetch } = api.notifications.getNotifications.useQuery(undefined, {
    refetchInterval: 30000, // poll every 30s
  });
  
  const markAsRead = api.notifications.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });
  
  const markAllAsRead = api.notifications.markAllAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-sm">Notifications ({unreadCount})</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 px-2 text-muted-foreground"
              onClick={() => markAllAsRead.mutate()}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications?.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              You're all caught up!
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications?.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b last:border-0 transition-colors ${notif.isRead ? 'opacity-60 bg-background' : 'bg-muted/30'}`}
                  onClick={() => {
                    if (!notif.isRead) markAsRead.mutate({ id: notif.id });
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground leading-none">{notif.title}</p>
                    {!notif.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-2">
                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
