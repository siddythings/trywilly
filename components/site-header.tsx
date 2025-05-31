"use client";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { MessageCircle } from "lucide-react"

interface SiteHeaderProps {
  onToggleSidebar?: () => void;
  onToggleSideChat?: () => void;
}

export function SiteHeader({ onToggleSidebar, onToggleSideChat }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Sidebar open/close trigger */}
        <SidebarTrigger className="-ml-1" onClick={onToggleSidebar} />
        {/* <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        /> */}
        {/* <h1 className="text-base font-medium">Documents</h1> */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            
          </Button>
        </div>
        {/* SideChat open/close trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onToggleSideChat}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="sr-only">Toggle Side Chat</span>
        </Button>
      </div>
    </header>
  )
}
