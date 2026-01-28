"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Loader2, RefreshCw, AlertCircle, TrendingUp, DollarSign } from "lucide-react";

interface ROIData {
    date: string;
    spend: number;
    revenue: number;
}

interface ROIAnalyticsProps {
    refreshTrigger?: number; // Increment this to trigger a refetch
}

export function ROIAnalytics({ refreshTrigger = 0 }: ROIAnalyticsProps) {
    const [data, setData] = useState<ROIData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/calcROI");
            if (!response.ok) throw new Error("Failed to fetch ROI data");
            const result = await response.json();

            // Ensure we use the data array from the response
            if (result.success && result.data) {
                setData(result.data);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            console.error("ROI Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshTrigger]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="h-[400px] w-full bg-card rounded-2xl border animate-pulse" />;

    return (
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Performance Analytics</h3>
                    <p className="text-sm text-muted-foreground">Revenue and Ad Spend over time</p>
                </div>
                <button
                    onClick={() => fetchData()}
                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-all active:rotate-180 duration-500"
                    title="Manual Refresh"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {isLoading && data.length === 0 ? (
                <div className="h-[350px] w-full flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-medium animate-pulse">Analyzing metrics...</p>
                </div>
            ) : error ? (
                <div className="h-[350px] w-full flex flex-col items-center justify-center text-center p-6 bg-rose-500/5 rounded-xl border border-rose-500/20">
                    <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
                    <h4 className="font-bold text-lg mb-2">Connection Error</h4>
                    <p className="text-sm text-rose-600 dark:text-rose-400 max-w-xs">{error}</p>
                    <button
                        onClick={() => fetchData()}
                        className="mt-6 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="date"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                }}
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
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ fontWeight: 'bold', color: 'inherit' }}
                            />
                            <Legend verticalAlign="top" height={36} align="right" iconType="circle" />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                name="Revenue"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--card))' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={1500}
                            />
                            <Line
                                type="monotone"
                                dataKey="spend"
                                name="Ad Spend"
                                stroke="#f43f5e"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--card))' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {!isLoading && !error && data.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Total Revenue</p>
                            <p className="text-sm font-bold">${data.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-lg">
                            <DollarSign className="w-4 h-4 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Total Spend</p>
                            <p className="text-sm font-bold">${data.reduce((acc, curr) => acc + curr.spend, 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
