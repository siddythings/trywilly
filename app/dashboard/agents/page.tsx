"use client";
import React, { useEffect } from "react";
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
import { ExternalLink, Search } from "lucide-react";
import { IconAppsFilled } from "@tabler/icons-react"
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { Content, JSONContent } from "@tiptap/react";
import { duplicateAgent } from "@/fetcher/user-login";

const agentTemplates = [
    {
        title: "Daily Calendar Summary",
        description: "Sends a daily email with all events and background research on who you're meeting with",
        appIcon: "https://devlnkr.s3.ap-south-1.amazonaws.com/build10x/google-calendar.svg",
        badge: "Popular",
        categories: ["All", "Personal"],
        template: {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Goal: Read my calendar for the day, and research each external person I will be meeting with and send me an email with a summary of everyone I am meeting with"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Integrations:"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Google Calendar"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Steps:"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Get all of the events for the day"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Research each external person I am meeting with (i.e. they have a different email domain to me)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Collate this research into a single summary with my entire schedule for the day"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Send me this summary via email"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Notes:"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Subject of the email: Who you are meeting today"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- If I have no events, do not send me an email"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Repeat the research task for each person, ensuring to use and mention the person's name in the email"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- If I have events, you should send an email everytime"
                        }
                    ]
                }
            ]
        }
    },
    {
        title: "Company Summary",
        description: "Create a weekly summary of all activity, progress, and highlights",
        appIcon: "/file.svg",
        badge: "Popular",
        categories: ["All", "Company"],
        template: {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Goal: Create a weekly summary of key company activities, progress, and highlights."
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Integrations:"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Slack (internal communications)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Google Calendar (meetings, events)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Notion (project updates)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- (for sharing summaries)"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Steps:"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "1. Aggregate relevant updates, meeting notes, and project progress from Slack, Google Calendar, and Notion."
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "2. Identify major deliverables, milestones achieved, blockers, and wins."
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "3. Synthesize into a concise summary."
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "4. Share the summary via Den with all employees or stakeholders."
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Notes:"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Link back to original sources for any detailed info."
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Keep language clear and easy to scan."
                        }
                    ]
                }
            ]
        }
    },
    {
        title: "Outbound to VC Firms",
        description: "Identify and organize VC funds that match your company profile for targeted outreach",
        appIcon: "/window.svg",
        badge: "Popular",
        categories: ["All", "Fundraising & VC"],
        template: {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Goal: Identify and organize VC funds that match your company profile for targeted outreach." }
                    ]
                },
                { "type": "paragraph" },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Integrations:" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Google Sheets" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Apollo Organization Search" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Web Search" }
                    ]
                },
                { "type": "paragraph" },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Instructions:" }
                    ]
                },
                { "type": "paragraph" },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Ask the user for their company profile details including:" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Industry/sector" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Company stage (pre-seed, seed, Series A, etc.)" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Funding amount seeking" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Geographic focus/location" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Brief company description or unique value proposition" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Create a new Google Sheet with the following columns:" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- VC Fund Name" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Fund Size" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Investment Stage Focus" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Industry Focus" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Geographic Focus" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Portfolio Companies" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Average Check Size" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Key Partners/Investors" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Contact Information" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Website" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Compatibility Score (1-10)" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Notes" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Search for VC funds that match the company profile using Apollo Organization Search with filters for:" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Investment firms in the relevant industry" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Appropriate company size/funding stage" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Geographic focus aligned with the company" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "For each potential VC fund identified, conduct additional research using Web Search to verify:" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Current investment focus" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Recent investments" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Fund size and typical check size" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Key partners and decision-makers" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Populate the Google Sheet with the gathered information." }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Calculate a compatibility score (1-10) for each VC fund based on how well they match the company profile." }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Sort the Google Sheet by compatibility score to prioritize outreach efforts." }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Provide a summary of findings including:" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Total number of VC funds identified" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Top 5 most compatible funds" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Any notable patterns or insights" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Share the Google Sheet with the user." }
                    ]
                },
                { "type": "paragraph" },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "Notes:" }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- The agent will need specific details about your company to find the most relevant VC funds." }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- The compatibility score is based on how well each fund's investment criteria match your company profile." }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- Consider using this data to craft personalized outreach messages to each VC fund." }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- The sheet can be updated regularly as new information becomes available or as your company evolves." }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        { "type": "text", "text": "- For best results, provide detailed information about your company's unique value proposition and competitive advantages." }
                    ]
                }
            ]
        }
    },
    {
        title: "Research VC Firms",
        description: "Research and document VC firms from calendar meetings",
        appIcon: "/file.svg",
        badge: "Popular",
        categories: ["All", "Fundraising & VC"],
        template: {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Goal - Research VC firms from calendar appointments and create detailed documents while updating a Notion database"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Integrations"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Google Calendar"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Google Docs"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Instructions"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Scan the user's Google Calendar for upcoming meetings with VC firms or investors"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "For each VC meeting identified, extract the firm name, meeting date/time, and any available contact information"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Research each VC firm using web search to gather comprehensive information including -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Firm overview, history, and investment philosophy"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Portfolio companies and notable investments"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Investment focus (stages, sectors, check sizes)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Key partners/team members who may be in the meeting"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Recent news, fund announcements, or notable exits"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Investment decision-making process (if available)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Portfolio company founder testimonials or references"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Create a detailed Google Doc for each VC firm with all research findings, organized in clear sections with appropriate headings"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Update the Notion database with key information about each VC firm, including -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Firm name and contact details"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Meeting date/time"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Investment focus summary"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Notable portfolio companies"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Key partners/contacts"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Fund size and stage"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Link to the detailed Google Doc"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Notify the user when new research is completed with a summary of findings and links to the documents"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Create a brief meeting preparation summary for each VC meeting one day before the scheduled meeting"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Notes -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- The agent should prioritize research for meetings occurring within the next 7 days"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- When creating Notion database entries, use consistent formatting and tagging for easy filtering"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- If the Notion database doesn't exist yet, create one with appropriate fields for tracking VC meetings"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- For recurring meetings with the same firm, update existing research documents with new information rather than creating duplicates"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Be thorough in research but prioritize quality information over quantity"
                        }
                    ]
                }
            ]
        }
    },
    {
        title: "News Digest",
        description: "The curated morning news straight to your inbox.",
        appIcon: "/globe.svg",
        badge: "Popular",
        categories: ["All", "Personal"],
        template: {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Goal - Read through the latest news and give me a brief synopsis. Focus a little bit on startup news, especially around fundraising announcements and send me an email summary but you should also include notable global events"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Integrations"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Web Search"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Steps"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Collect the latest news"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Summarise the news into an easily digestible format of what you think is important"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Send me an email with the summary"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Notes"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- You should send an email every time"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Always include sources that I can click on in the email"
                        }
                    ]
                }
            ]
        }

    },
    {
        title: "Blog Post",
        description: "Automatically write high-conversion blog posts from your company knowledge",
        appIcon: "/file.svg",
        badge: "Popular",
        categories: ["All", "Marketing"],
        template: {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Goal - Create SEO-optimized articles that incorporate specific keywords after conducting thorough topic research"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Integrations"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Web Search"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Deep Research"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Instructions"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Ask the user for the following information -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Main topic or title for the article"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Target keywords that must be incorporated (at least 3-5)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Company or brand information (if applicable)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Target audience"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Any specific references or sources they want included"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Conduct comprehensive research on the topic using Web Search and Deep Research to gather -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Current industry trends"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Key statistics and data points"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Competitor content on similar topics"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Expert opinions and quotes"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- If company information was provided, research the company to understand -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Brand voice and tone"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Key products or services"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Target market and unique selling propositions"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Create an outline for the article that includes -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Attention-grabbing headline with primary keyword"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Introduction (100-150 words)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- 3-5 main sections with subheadings (each containing at least one target keyword)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Conclusion with call-to-action (100-150 words)"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Write the complete article following these guidelines -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Total length between 800-1200 words"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Natural incorporation of all target keywords (avoid keyword stuffing)"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Engaging, conversational tone appropriate for the target audience"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Include relevant facts, statistics, and examples from research"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Maintain logical flow between sections"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Review and optimize the article for SEO -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Check keyword density and placement"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Ensure readability with appropriate paragraph length"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Add meta description suggestion"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Verify all facts and citations"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Create a new Den document with the finalized article"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Add a references section at the end listing all sources used"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Present the completed article to the user with -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Word count"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- List of all keywords incorporated"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Link to the Den document"
                        }
                    ]
                },
                {
                    "type": "paragraph"
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Notes -"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- The article should be original and pass plagiarism checks"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Use a mix of sentence structures and paragraph lengths for better readability"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Incorporate transitional phrases between sections for smooth flow"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Optimize for featured snippets when possible by including Q&A formats or concise definitions"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Format with clear headings, subheadings, and bullet points where appropriate"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Use active voice primarily and maintain consistent tense throughout"
                        }
                    ]
                },
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "- Adapt tone to match company voice if company information is provided"
                        }
                    ]
                }
            ]
        }
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

// Define a type for the template
interface TemplateType {
    title: string;
    description: string;
    appIcon: string;
    badge: string;
    categories: string[];
    template?: Content;
}

export default function AgentsPage() {
    const [tab, setTab] = React.useState("All");
    const [topTab, setTopTab] = React.useState("Templates");
    const [agents, setAgents] = React.useState<Array<{
        id?: string;
        name?: string;
        description?: string;
        content?: string;
        schedule?: string;
    }>>([]);
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateType | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleCreate = async () => {
        const id = uuidv4().toString();
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai-agents/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${userData.data.access_token}`
            },
            body: JSON.stringify({
                id: id,
                name: "New agent",
                schedule: "day",
                time: "8:00am",
                content: {
                    "type": "doc",
                    "content": [

                    ]
                }
                ,
            }),
        })
        router.push(`/dashboard/agents/new/${id}`);
    }

    useEffect(() => {
        const fetchAgents = async () => {
            const userData = JSON.parse(localStorage.getItem("user") || "{}")
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai-agents`, {
                headers: {
                    'Authorization': `Bearer ${userData.data.access_token}`
                }
            });
            const resData = await res.json();
            setAgents(resData.data);
        }
        fetchAgents();
    }, [])

    function TemplateModal({ open, onClose, template }: { open: boolean, onClose: () => void, template: TemplateType | null }) {
        const router = useRouter();
        const handleDuplicate = async () => {
            if (!template) return;
            setLoading(true);
            try {
                // Prepare agent data for duplication
                const agentData = {
                    name: template.title,
                    description: template.description,
                    appIcon: template.appIcon,
                    badge: template.badge,
                    categories: template.categories,
                    content: template.template,
                };
                const result = await duplicateAgent(agentData);
                onClose();
                if (result && result.data.id) {
                    router.push(`/dashboard/agents/new?_id=${result.data.id}`);
                }
            } catch (err) {
                alert("Failed to duplicate agent: " + (err instanceof Error ? err.message : String(err)));
            } finally {
                setLoading(false);
            }
        };
        if (!open || !template) return null;
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl p-0 max-w-4xl w-full shadow-2xl flex relative max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
                        onClick={onClose}
                    >
                        ×
                    </button>
                    {/* Main content */}
                    <div className="flex-1 p-8 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-3xl font-extrabold mb-4">{template.title}</h2>
                        <p className="mb-6 text-gray-700">{template.description}</p>
                        {template.template && (
                            <div
                                className="mb-6 p-4 bg-gray-50 rounded border text-gray-900 prose prose-lg leading-relaxed max-w-none"
                                dangerouslySetInnerHTML={{ __html: tiptapDocToHtml(template.template) }}
                            />
                        )}
                    </div>
                    {/* Sidebar */}
                    <div className="w-80 bg-gray-50 border-l rounded-r-2xl p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <img src={template.appIcon} alt="app icon" className="w-7 h-7 object-contain" />
                                <span className="text-lg font-semibold">{template.title}</span>
                            </div>
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-700">About</h4>
                                <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-700">Integrations</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {template.categories.map((cat) => (
                                        <span
                                            key={cat}
                                            className="inline-flex items-center px-3 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-700 border"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            className="w-full mt-6 py-3 bg-black hover:bg-indigo-600 text-white font-semibold rounded-lg text-base transition flex items-center justify-center"
                            onClick={handleDuplicate}
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            ) : null}
                            {loading ? "Duplicating..." : "Duplicate template"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                                Your agents <span className="ml-1 text-muted-foreground font-normal">({agents.length})</span>
                            </TabsTrigger>
                            <TabsTrigger value="Templates">
                                Templates
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <Button size="lg" className="w-full sm:w-auto" onClick={handleCreate}>
                            + Create new agent
                        </Button>
                    </div>
                </div>
                {/* Content */}
                {topTab === "My Agents" ? (
                    <div className="mb-8 flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {agents.length === 0 ? (
                            <div className="overflow-y-auto max-h-[70vh] scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-16 min-h-[140px]">
                                    <div className="col-span-full w-full text-muted-foreground text-lg border rounded-md bg-muted py-12 flex items-center justify-center">
                                        You have no agents yet.
                                    </div>
                                    {/* Hidden placeholder to force grid width */}
                                    <div className="invisible" />
                                    <div className="invisible" />
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-[70vh] scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-16">
                                    {agents.map((agent, idx) => (
                                        <Card
                                            key={agent.id || idx}
                                            className="relative h-full p-3 rounded-md border border-muted shadow-sm flex flex-col justify-between min-h-[140px] cursor-pointer hover:border-blue-500 hover:shadow-md transition"
                                            onClick={() => agent.id && router.push(`/dashboard/agents/new?_id=${agent.id}`)}
                                        >
                                            {/* Top: Title, description, external link */}
                                            <div className="flex flex-row items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <CardTitle className="text-base font-semibold leading-tight mb-0.5">
                                                        {agent.name || 'Untitled Agent'}
                                                    </CardTitle>
                                                    <CardDescription className="text-muted-foreground text-xs whitespace-normal break-words">
                                                        {agent.description
                                                            || (typeof agent.content === 'string' ? agent.content : 'No description')}
                                                    </CardDescription>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-muted-foreground mt-1" />
                                            </div>
                                            {/* Bottom: App icon left, badge right */}
                                            <div className="flex flex-row items-center justify-between gap-2 -mt-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="rounded-lg border bg-muted flex items-center justify-center w-8 h-8">
                                                        <img src="/file.svg" alt="app icon" className="w-5 h-5 object-contain" />
                                                    </div>
                                                </div>
                                                {agent.schedule && (
                                                    <Badge variant="secondary" className="px-2 py-0.5 rounded-lg bg-muted text-foreground font-medium text-[11px] flex items-center h-7">
                                                        {agent.schedule}
                                                    </Badge>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-16">
                                        {agentTemplates
                                            .filter((agent) => agent.categories.includes(cat))
                                            .map((agent, idx) => (
                                                <Card key={agent.title + idx} className="relative h-full p-3 rounded-md border border-muted shadow-sm flex flex-col justify-between min-h-[140px] cursor-pointer hover:border-blue-500 hover:shadow-md transition"
                                                    onClick={() => {
                                                        setSelectedTemplate(agent);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    {/* Top: Title, description, external link */}
                                                    <div className="flex flex-row items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <CardTitle className="text-base font-semibold leading-tight mb-0.5">
                                                                {agent.title}
                                                            </CardTitle>
                                                            <CardDescription className="text-muted-foreground text-xs whitespace-normal break-words">
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
            {/* Render the modal for template info */}
            <TemplateModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                template={selectedTemplate}
            />
        </div>
    );
}

function tiptapDocToHtml(doc: Content): string {
    if (!doc) return "";
    let html = "";

    function renderNode(node: JSONContent) {
        if (!node || typeof node !== 'object' || Array.isArray(node)) return;
        switch (node.type) {
            case "doc":
                if (Array.isArray(node.content)) node.content.forEach(renderNode);
                break;
            case "paragraph":
                html += "<p>";
                if (Array.isArray(node.content)) node.content.forEach(renderNode);
                html += "</p>";
                break;
            case "text":
                let text = node.text || "";
                if (node.marks && Array.isArray(node.marks)) {
                    node.marks.forEach((mark) => {
                        if (mark.type === "bold") text = `<strong>${text}</strong>`;
                        if (mark.type === "italic") text = `<em>${text}</em>`;
                        if (mark.type === "link") {
                            const href = mark.attrs?.href || "#";
                            const target = mark.attrs?.target || "_blank";
                            text = `<a href='${href}' target='${target}' rel='noopener noreferrer' class='text-blue-600 underline'>${text}</a>`;
                        }
                    });
                }
                html += text;
                break;
            case "bulletList":
                html += "<ul>";
                if (Array.isArray(node.content)) node.content.forEach(renderNode);
                html += "</ul>";
                break;
            case "orderedList":
                html += "<ol>";
                if (Array.isArray(node.content)) node.content.forEach(renderNode);
                html += "</ol>";
                break;
            case "listItem":
                html += "<li>";
                if (Array.isArray(node.content)) {
                    node.content.forEach((child) => {
                        if (child.type === "paragraph" && Array.isArray(child.content)) {
                            child.content.forEach(renderNode);
                        } else {
                            renderNode(child);
                        }
                    });
                }
                html += "</li>";
                break;
            case "heading":
                html += `<h${node.attrs?.level || 2}>`;
                if (Array.isArray(node.content)) node.content.forEach(renderNode);
                html += `</h${node.attrs?.level || 2}>`;
                break;
            case "blockquote":
                html += `<blockquote class='border-l-4 border-gray-300 pl-4 italic my-4'>`;
                if (Array.isArray(node.content)) node.content.forEach(renderNode);
                html += `</blockquote>`;
                break;
            case "horizontalRule":
                html += `<hr class='my-6 border-gray-300' />`;
                break;
            default:
                if (Array.isArray(node.content)) node.content.forEach(renderNode);
        }
    }

    renderNode(doc as JSONContent);
    return html;
}
