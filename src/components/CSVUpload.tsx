"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import Papa from "papaparse";

interface UploadStatus {
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
}

interface CSVUploadProps {
    onSuccess?: () => void;
}

export function CSVUpload({ onSuccess }: CSVUploadProps) {
    const [adSpendFile, setAdSpendFile] = useState<File | null>(null);
    const [salesFile, setSalesFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>({ type: 'idle' });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'spend' | 'sales') => {
        const file = e.target.files?.[0] || null;
        if (type === 'spend') setAdSpendFile(file);
        else setSalesFile(file);
        setStatus({ type: 'idle' }); // Reset status on new file
    };

    const uploadFile = async (file: File, endpoint: string) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Upload failed");
        }

        return response.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adSpendFile && !salesFile) {
            setStatus({ type: 'error', message: "Please select at least one file to upload." });
            return;
        }

        setStatus({ type: 'loading', message: "Processing uploads..." });

        try {
            const promises = [];
            if (adSpendFile) promises.push(uploadFile(adSpendFile, "/api/uploadAdSpend"));
            if (salesFile) promises.push(uploadFile(salesFile, "/api/uploadSales"));

            await Promise.all(promises);

            setStatus({
                type: 'success',
                message: `Successfully uploaded ${[adSpendFile, salesFile].filter(Boolean).length} file(s).`
            });
            setAdSpendFile(null);
            setSalesFile(null);

            // Trigger callback if provided
            if (onSuccess) onSuccess();

        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        }
    };


    const FileItem = ({ file, onClear, label }: { file: File, onClear: () => void, label: string }) => (
        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <FileText className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">{label}</p>
                    <p className="text-sm font-semibold truncate max-w-[200px]">{file.name}</p>
                </div>
            </div>
            <button
                onClick={onClear}
                className="p-1 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                aria-label="Clear file"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-bold">Import Marketing Data</h3>
                <p className="text-sm text-muted-foreground">Upload your CSV exports to sync metrics.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Ad Spend Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Ad Spend CSV
                        </label>
                        {!adSpendFile ? (
                            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/20 rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all group">
                                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-2" />
                                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">Click to browse</span>
                                <input type="file" className="hidden" accept=".csv" onChange={(e) => handleFileChange(e, 'spend')} />
                            </label>
                        ) : (
                            <FileItem file={adSpendFile} label="Ad Spend" onClear={() => setAdSpendFile(null)} />
                        )}
                    </div>

                    {/* Sales Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Sales Data CSV
                        </label>
                        {!salesFile ? (
                            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/20 rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all group">
                                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-2" />
                                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">Click to browse</span>
                                <input type="file" className="hidden" accept=".csv" onChange={(e) => handleFileChange(e, 'sales')} />
                            </label>
                        ) : (
                            <FileItem file={salesFile} label="Sales Data" onClear={() => setSalesFile(null)} />
                        )}
                    </div>
                </div>

                {status.type !== 'idle' && (
                    <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in zoom-in-95 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' :
                        status.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400' :
                            'bg-primary/10 border-primary/30 text-primary'
                        }`}>
                        {status.type === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                            status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                                <AlertCircle className="w-5 h-5" />}
                        <p className="text-sm font-semibold">{status.message || "Processing..."}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status.type === 'loading' || (!adSpendFile && !salesFile)}
                    className={`w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] ${status.type === 'loading' || (!adSpendFile && !salesFile)
                        ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                        : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
                        }`}
                >
                    {status.type === 'loading' ? "Uploading..." : "Sync Metrics"}
                </button>
            </form>
        </div>
    );
}
