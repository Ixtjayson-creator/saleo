"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, PieChart, LogOut, Settings, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Upload Data", href: "/upload", icon: Upload },
    { name: "ROI Summary", href: "/roi", icon: PieChart },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };


    return (
        <div className="flex flex-col h-full w-64 bg-slate-50 dark:bg-slate-950 border-r border-border transition-colors duration-300">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-black text-xs">S</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Saleo <span className="text-primary">ROI</span>
                    </h1>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5">
                <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    Analytics
                </p>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${isActive
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}

                <div className="pt-8 space-y-1.5">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                        System
                    </p>
                    <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help Center
                    </button>
                </div>
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
