"use client"

import { IconCirclePlusFilled, IconMail, IconMessageCircle, type Icon } from "@tabler/icons-react"
import { useRouter, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="New Chat"
              // className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              isActive={pathname === "/dashboard/chat"}
            >
              <IconMessageCircle />
              <span>New Chat</span>
            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {/* {item.title === "Agents" ? ( */}
                <SidebarMenuButton 
                  tooltip={item.title} 
                  onClick={() => router.push(item.url)}
                  isActive={pathname === item.url}
                  style={pathname === item.url ? { background: 'black', color: 'white' } : {}}
                > 
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              {/* ) : (
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )} */}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
