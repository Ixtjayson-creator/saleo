"use client";

import { Info } from "lucide-react";
import { CSVUpload } from "@/components/CSVUpload";

export default function UploadPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Data Integration</h1>
                <p className="text-muted-foreground mt-1">Upload your daily ad spend and revenue files to keep the dashboard in sync.</p>
            </div>

            <CSVUpload />

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 relative overflow-hidden">
                <div className="flex items-start space-x-4 relative z-10">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-foreground">CSV Format Requirements</h4>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ad Spend</p>
                                <code className="block p-3 bg-muted rounded-lg text-[10px] text-foreground leading-relaxed transition-colors group-hover:bg-primary/10">
                                    spend_amount, date, campaign_id, impressions
                                </code>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sales Data</p>
                                <code className="block p-3 bg-muted rounded-lg text-[10px] text-foreground leading-relaxed transition-colors group-hover:bg-primary/10">
                                    sale_amount, date, order_id, customer_email
                                </code>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                            * Date format should be <span className="text-foreground font-medium">YYYY-MM-DD</span>. All currency values should be numeric.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
            </div>
        </div>
    );
}
