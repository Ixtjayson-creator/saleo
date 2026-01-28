"use client";

import { Download, Filter, ArrowUpRight, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";

const roiData = [
    { campaign: "Summer Sale 2025", platform: "Facebook", spend: "$12,450", revenue: "$45,230", roi: "263%", status: "Active" },
    { campaign: "Q1 Retargeting", platform: "Google Ads", spend: "$8,200", revenue: "$21,400", roi: "161%", status: "Active" },
    { campaign: "Influencer Push", platform: "Instagram", spend: "$5,000", revenue: "$18,900", roi: "278%", status: "Completed" },
    { campaign: "Email Sequence A", platform: "Email", spend: "$450", revenue: "$4,200", roi: "833%", status: "Active" },
    { campaign: "Brand Awareness", platform: "YouTube", spend: "$15,000", revenue: "$12,500", roi: "-17%", status: "Paused" },
];

export default function RoiPage() {
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const response = await fetch('/api/integrations/sync', { method: 'POST' });
            const result = await response.json();
            if (response.ok) {
                alert('Sync completed! Dashboard will update shortly.');
            } else {
                alert('Sync failed: ' + result.error);
            }
        } catch (err) {
            console.error(err);
            alert('An unexpected error occurred during sync.');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">ROI Summary</h1>
                    <p className="text-muted-foreground mt-1">Detailed breakdown of campaign performance and returns.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium disabled:opacity-50"
                    >
                        {syncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        {syncing ? 'Syncing...' : 'Sync APIs'}
                    </button>
                    <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                    <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-sm font-medium">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Campaign Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Spend</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ROI</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {roiData.map((item, index) => (
                                <tr key={index} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{item.campaign}</span>
                                            <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                                            {item.platform}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">{item.spend}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{item.revenue}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.roi.startsWith("-")
                                            ? "bg-rose-500/10 text-rose-500"
                                            : "bg-emerald-500/10 text-emerald-500"
                                            }`}>
                                            {item.roi}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${item.status === "Active" ? "bg-blue-500/10 text-blue-500" :
                                            item.status === "Completed" ? "bg-muted text-muted-foreground" :
                                                "bg-amber-500/10 text-amber-500"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-blue-500" :
                                                item.status === "Completed" ? "bg-muted-foreground" :
                                                    "bg-amber-500"
                                                }`} />
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-border bg-muted/20">
                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        Showing top 5 high-impact campaigns from current period
                    </p>
                </div>
            </div>
        </div>
    );
}

