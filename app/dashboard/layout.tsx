"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SideChat, SideChatProvider, useSideChat } from "@/components/side-chat";
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip"

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { toggle: toggleSideChat } = useSideChat();

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
      className="flex h-full w-full min-h-screen flex-col sm:flex-row"
    >
      <AppSidebar variant="inset" className="w-full sm:w-[var(--sidebar-width)] shrink-0" />
      <SidebarInset className="flex flex-col flex-1 min-w-0">
        <SiteHeader onToggleSideChat={toggleSideChat} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Route-specific content will be rendered here */}
          {children}
        </div>
      </SidebarInset>
      <SideChat />
    </SidebarProvider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SideChatProvider>
      <TooltipProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </TooltipProvider>
    </SideChatProvider>
  );
} 