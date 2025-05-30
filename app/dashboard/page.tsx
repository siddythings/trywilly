"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SideChat, SideChatProvider, useSideChat } from "@/components/side-chat"

function DashboardContent() {
  const { toggle: toggleSideChat } = useSideChat();
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="flex h-full"
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col flex-[1.5]">
        <SiteHeader onToggleSideChat={toggleSideChat} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 @container/main flex flex-col gap-2 overflow-y-auto pb-8 scrollbar-hide">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <SideChat />
    </SidebarProvider>
  );
}

export default function Page() {
  return (
    <SideChatProvider>
      <DashboardContent />
    </SideChatProvider>
  );
}
