"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Grid, Link2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Minimal Integration type for this file
interface Integration {
    _id?: { $oid: string } | string;
    name: string;
    slug: string;
    auth_schemes: string[];
    meta: {
        tools_count: number;
        triggers_count: number;
        description: string;
        logo: string;
        categories: { id: string; name: string }[];
    };
}

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    // Compute unique categories from integrations
    const categories = React.useMemo(() => {
        const cats = new Set<string>();
        integrations.forEach(integration => {
            integration.meta?.categories?.forEach(cat => {
                cats.add(cat.name);
            });
        });
        return ["All", ...Array.from(cats).sort()];
    }, [integrations]);

    useEffect(() => {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get-integrations`, {
            headers: {
                'Authorization': `Bearer ${userData.data.access_token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch integrations");
                return res.json();
            })
            .then((data) => {
                setIntegrations(data.data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message || "Unknown error");
            })
            .finally(() => setLoading(false));
    }, []);

    const connectIntegration = async (provider: string) => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        const user_id = userData.data.id
        const URL = `${process.env.NEXT_PUBLIC_API_URL}/connect?_id=${user_id}&type=${provider}`;
        if (window.api?.openExternal) {
            window.api.openExternal(URL);
        } else {
            window.open(URL, "_blank");
        }
    };

    return (
        <div className="container mx-auto px-8 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Integrations</h1>
                <div className="mb-8">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                            <Search className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search integrations..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                {loading && (
                    <div className="flex justify-center items-center h-40">
                        <LoadingSpinner size="lg" />
                    </div>
                )}
                {error && <div className="text-red-500">{error}</div>}
                {!loading && !error && (
                    <div className="w-full px-4 h-[700px] overflow-y-auto pb-8 scrollbar-none">
                        <div
                          className="grid gap-8"
                          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
                        >
                            {integrations
                                .filter((integration) =>
                                    (category === "All" || integration.meta.categories.some(cat => cat.name === category)) &&
                                    (integration.name.toLowerCase().includes(search.toLowerCase()) ||
                                    integration.meta.description.toLowerCase().includes(search.toLowerCase()))
                                )
                                .map((integration) => (
                                    <Card
                                        key={typeof integration._id === 'object' && integration._id !== null && '$oid' in integration._id ? integration._id.$oid : integration._id}
                                        className="rounded-2xl shadow border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col min-w-[240px] max-w-[320px] min-h-[220px] p-4"
                                    >
                                        {/* Top Row: Logo, Name */}
                                        <div>
                                            <div className="flex items-center">
                                                <img src={integration.meta?.logo} alt={integration.name} className="w-9 h-9 rounded-xl bg-white border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 object-contain" />
                                                <span className="ml-2 text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">{integration.name}</span>
                                            </div>
                                            <span className="clamp-2 block text-sm text-zinc-500 dark:text-zinc-300">{integration.meta?.description}</span>
                                        </div>
                                        {/* Categories */}
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {integration.meta?.categories?.map((cat) => (
                                                <span key={cat.id} className="inline-block px-3 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium text-xs">
                                                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Bottom Row: Actions & Triggers */}
                                        <div className="mt-auto flex flex-col gap-0.5">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold text-sm">
                                                    <Grid className="w-3.5 h-3.5" />
                                                    {integration.meta?.tools_count || 0}
                                                    <span className="font-normal text-zinc-500 dark:text-zinc-300 ml-1">actions</span>
                                                </span>
                                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-sm">
                                                    <Link2 className="w-3.5 h-3.5" />
                                                    {integration.meta?.triggers_count || 0}
                                                    <span className="font-normal text-zinc-500 dark:text-zinc-300 ml-1">triggers</span>
                                                </span>
                                            </div>
                                            <Button
                                                className="w-full mt-3 rounded-md text-sm font-medium"
                                                variant="default"
                                                size="sm"
                                                onClick={() => connectIntegration(integration.slug)}
                                            >
                                                Integrate
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}