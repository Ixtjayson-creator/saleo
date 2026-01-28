"use client";

import React, { useEffect, useState } from "react";
import {
  DashboardHeader,
  StatPanels,
  DailyRoiTable
} from "@/components/DashboardUI";
import { ROIAnalytics } from "@/components/ROIAnalytics";
import { CSVUpload } from "@/components/CSVUpload";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  useEffect(() => {
    async function fetchDashboardData() {
      // Keep fetching for the fallback/other components if needed
      // But ROIAnalytics now handles its own internal refresh via refreshTrigger
      try {
        const response = await fetch('/api/calcROI');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch ROI data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [refreshCounter]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <DashboardHeader
          title="Marketing ROI Overview"
          subtitle="Real-time performance metrics for your multi-channel ads"
        />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Export Report
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p className="font-medium animate-pulse">Calculating your ROI metrics...</p>
        </div>
      ) : (
        <>
          <StatPanels data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ROIAnalytics refreshTrigger={refreshCounter} />
              <DailyRoiTable data={data?.data} />
            </div>
            <div className="space-y-8">
              <CSVUpload onSuccess={handleRefresh} />

              <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-primary font-bold">💡</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2">Automate Spend</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Connect your Facebook and Google Ads accounts directly via API for real-time tracking.
                  </p>
                  <button className="mt-6 text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                    View Integrations
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
