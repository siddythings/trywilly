"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ExternalLink, LayoutGrid, Search, AppWindowIcon } from "lucide-react";
import { IconAppsFilled } from "@tabler/icons-react"

const agentTemplates = [
  {
    title: "Daily Calendar Summary",
    description: "Sends a daily email with all events and background research on who you're meeting with",
    appIcon: "/calendar.svg",
    badge: "Popular",
    categories: ["All", "Personal"],
  },
  {
    title: "Company Summary",
    description: "Create a weekly summary of all activity, progress, and highlights",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Company"],
  },
  {
    title: "Outbound to VC Firms",
    description: "Identify and organize VC funds that match your company profile for targeted outreach",
    appIcon: "/window.svg",
    badge: "Popular",
    categories: ["All", "Fundraising & VC"],
  },
  {
    title: "Research VC Firms",
    description: "Research and document VC firms from calendar meetings",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Fundraising & VC"],
  },
  {
    title: "News Digest",
    description: "The curated morning news straight to your inbox.",
    appIcon: "/globe.svg",
    badge: "Popular",
    categories: ["All", "Personal"],
  },
  {
    title: "Blog Post",
    description: "Automatically write high-conversion blog posts from your company knowledge",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Marketing"],
  },
  {
    title: "Scrape Product Hunt",
    description: "Scrape Product Hunt daily and return a list of trending companies",
    appIcon: "/mail.svg",
    badge: "Popular",
    categories: ["All", "Product"],
  },
  {
    title: "Deep Research on Invest...",
    description: "Look up investor info before meetings.",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Fundraising & VC"],
  },
  {
    title: "Failed Payment Prevention",
    description: "Identify failed payments and help recover revenue with follow-ups",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Sales"],
  },
  {
    title: "News Digest",
    description: "The curated morning news straight to your inbox.",
    appIcon: "/globe.svg",
    badge: "Popular",
    categories: ["All", "Personal"],
  },
  {
    title: "Blog Post",
    description: "Automatically write high-conversion blog posts from your company knowledge",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Marketing"],
  },
  {
    title: "Scrape Product Hunt",
    description: "Scrape Product Hunt daily and return a list of trending companies",
    appIcon: "/mail.svg",
    badge: "Popular",
    categories: ["All", "Product"],
  },
  {
    title: "Deep Research on Invest...",
    description: "Look up investor info before meetings.",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Fundraising & VC"],
  },
  {
    title: "Failed Payment Prevention",
    description: "Identify failed payments and help recover revenue with follow-ups",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Sales"],
  },  {
    title: "News Digest",
    description: "The curated morning news straight to your inbox.",
    appIcon: "/globe.svg",
    badge: "Popular",
    categories: ["All", "Personal"],
  },
  {
    title: "Blog Post",
    description: "Automatically write high-conversion blog posts from your company knowledge",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Marketing"],
  },
  {
    title: "Scrape Product Hunt",
    description: "Scrape Product Hunt daily and return a list of trending companies",
    appIcon: "/mail.svg",
    badge: "Popular",
    categories: ["All", "Product"],
  },
  {
    title: "Deep Research on Invest...",
    description: "Look up investor info before meetings.",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Fundraising & VC"],
  },
  {
    title: "Failed Payment Prevention",
    description: "Identify failed payments and help recover revenue with follow-ups",
    appIcon: "/file.svg",
    badge: "Popular",
    categories: ["All", "Sales"],
  },
];

const categories = [
  "All",
  "Personal",
  "Marketing",
  "Sales",
  "Customer support",
  "Company",
  "Product",
  "Engineering",
  "Fundraising & VC",
  "YC",
];

export default function AgentsPage() {
  const [tab, setTab] = React.useState("All");
  const [topTab, setTopTab] = React.useState("Templates");

  return (
    <div className="container mx-auto px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Heading with icon */}
        <div className="flex items-center gap-3 mb-2">
          <IconAppsFilled className="w-8 h-8 text-foreground" />
          <h1 className="text-4xl font-extrabold tracking-tight">Agents</h1>
        </div>
        {/* Tabs + search + create button row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Tabs value={topTab} onValueChange={setTopTab}>
            <TabsList className="h-9">
              <TabsTrigger value="My Agents">
                Your agents <span className="ml-1 text-muted-foreground font-normal">(2)</span>
              </TabsTrigger>
              <TabsTrigger value="Templates">
                Templates
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Button size="lg" className="w-full sm:w-auto">
              + Create new agent
            </Button>
          </div>
        </div>
        {/* Content */}
        {topTab === "My Agents" ? (
          <div className="">
            <div className="w-full text-muted-foreground text-lg border rounded-md bg-muted py-12 flex items-center justify-center">
              You have no agents yet.
            </div>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-8 flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-hide">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="capitalize">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className="overflow-y-auto max-h-[70vh] scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {agentTemplates
                      .filter((agent) => agent.categories.includes(cat))
                      .map((agent) => (
                        <Card key={agent.title} className="relative h-full p-3 rounded-md border border-muted shadow-sm flex flex-col justify-between min-h-[140px]">
                          {/* Top: Title, description, external link */}
                          <div className="flex flex-row items-start justify-between gap-2">
                            <div className="flex-1">
                              <CardTitle className="text-base font-semibold leading-tight mb-0.5">
                                {agent.title}
                              </CardTitle>
                              <CardDescription className="text-muted-foreground text-xs">
                                {agent.description}
                              </CardDescription>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground mt-1" />
                          </div>
                          {/* Bottom: App icon left, badge right */}
                          <div className="flex flex-row items-center justify-between gap-2 -mt-1">
                            <div className="flex items-center gap-2">
                              <div className="rounded-lg border bg-muted flex items-center justify-center w-8 h-8">
                                <img src={agent.appIcon} alt="app icon" className="w-5 h-5 object-contain" />
                              </div>
                            </div>
                            {agent.badge && (
                              <Badge variant="secondary" className="px-2 py-0.5 rounded-lg bg-muted text-foreground font-medium text-[11px] flex items-center h-7">
                                {agent.badge}
                              </Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}