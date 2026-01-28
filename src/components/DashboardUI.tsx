"use client";

import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    BarChart3,
    PieChart as PieChartIcon,
    Upload,
    ArrowRight,
    MoreHorizontal,
    Plus
} from "lucide-react";

// Hook to fix Recharts hydration
function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

export function DashboardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
        </div>
    );
}

export function StatPanels({ data }: { data?: any }) {
    const stats = [
        { label: "Total Revenue", value: data?.totals?.revenue ? `$${data.totals.revenue.toLocaleString()}` : "$42,500", icon: DollarSign, change: "+12.5%", trend: "up" },
        { label: "Total Spend", value: data?.totals?.spend ? `$${data.totals.spend.toLocaleString()}` : "$12,400", icon: BarChart3, change: "+3.2%", trend: "up" },
        { label: "Total Profit", value: data?.totals?.profit ? `$${data.totals.profit.toLocaleString()}` : "$30,100", icon: TrendingUp, change: "+18.7%", trend: "up" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
                <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                            {stat.change}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function RevenueSpendChart({ data }: { data?: any[] }) {
    const mounted = useMounted();
    const chartData = data || [
        { date: "2024-01-01", spend: 400, revenue: 1200 },
        { date: "2024-01-02", spend: 300, revenue: 1400 },
        { date: "2024-01-03", spend: 600, revenue: 1800 },
        { date: "2024-01-04", spend: 800, revenue: 2400 },
        { date: "2024-01-05", spend: 750, revenue: 2200 },
        { date: "2024-01-06", spend: 900, revenue: 3100 },
        { date: "2024-01-07", spend: 1100, revenue: 4200 },
    ];

    if (!mounted) return <div className="h-[400px] w-full bg-card animate-pulse rounded-xl border" />;

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold">Revenue vs Spend</h3>
                    <p className="text-sm text-muted-foreground">Historical performance over time</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-xs text-muted-foreground font-medium">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="text-xs text-muted-foreground font-medium">Spend</span>
                    </div>
                </div>
            </div>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => val.includes('-') ? val.split('-').slice(1).join('/') : val}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `$${val}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '8px',
                                fontSize: '12px',
                                color: 'hsl(var(--foreground))'
                            }}
                            itemStyle={{ color: 'inherit' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                        <Area
                            type="monotone"
                            dataKey="spend"
                            stroke="#f43f5e"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorSpend)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function DailyRoiTable({ data }: { data?: any[] }) {
    const tableData = data || [
        { date: "2024-01-01", spend: 400, revenue: 1200, profit: 800 },
        { date: "2024-01-02", spend: 300, revenue: 1400, profit: 1100 },
        { date: "2024-01-03", spend: 600, revenue: 1800, profit: 1200 },
        { date: "2024-01-04", spend: 800, revenue: 2400, profit: 1600 },
        { date: "2024-01-05", spend: 750, revenue: 2200, profit: 1450 },
        { date: "2024-01-06", spend: 900, revenue: 3100, profit: 2200 },
        { date: "2024-01-07", spend: 1100, revenue: 4200, profit: 3100 },
    ];

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Daily ROI Summary</h3>
                    <p className="text-sm text-muted-foreground">Detailed daily breakdown of your marketing efficiency</p>
                </div>
                <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1 text-sm">
                    View all <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Ad Spend</th>
                            <th className="px-6 py-4">Revenue</th>
                            <th className="px-6 py-4">Profit</th>
                            <th className="px-6 py-4">ROI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {tableData.map((row, i) => {
                            const roi = row.roi || ((row.revenue - row.spend) / row.spend * 100).toFixed(0);
                            return (
                                <tr key={i} className="text-sm hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-medium">{row.date}</td>
                                    <td className="px-6 py-4">${row.spend?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">${row.revenue?.toLocaleString()}</td>
                                    <td className="px-6 py-4 font-medium">${row.profit?.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                                            {roi}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function DashboardUploadSection() {
    const [isUploading, setIsUploading] = useState(false);

    const handleQuickUpload = async (type: 'spend' | 'sales') => {
        setIsUploading(true);
        console.log(`Simulating ${type} upload...`);
        await new Promise(r => setTimeout(r, 1500));
        setIsUploading(false);
        alert(`${type} data processed successfully!`);
    };

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold">Quick Upload</h3>
                    <p className="text-sm text-muted-foreground">Import your latest CSV files</p>
                </div>
            </div>
            <div className="space-y-4">
                <button
                    disabled={isUploading}
                    className="w-full flex items-center gap-4 p-4 border rounded-xl group hover:border-primary transition-all cursor-pointer bg-card hover:bg-primary/5 text-left"
                    onClick={() => handleQuickUpload('spend')}
                >
                    <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                        <PieChartIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold">Ad Spend CSV</h4>
                        <p className="text-xs text-muted-foreground">Import Facebook/Google ads</p>
                    </div>
                    <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                <button
                    disabled={isUploading}
                    className="w-full flex items-center gap-4 p-4 border rounded-xl group hover:border-primary transition-all cursor-pointer bg-card hover:bg-primary/5 text-left"
                    onClick={() => handleQuickUpload('sales')}
                >
                    <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                        <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold">Sales Orders CSV</h4>
                        <p className="text-xs text-muted-foreground">Import revenue data</p>
                    </div>
                    <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                <button
                    onClick={() => { }}
                    className="w-full mt-2 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors border border-dashed rounded-xl hover:bg-muted/50"
                >
                    <Plus className="w-4 h-4" />
                    More Integrations
                </button>
            </div>
        </div>
    );
}
