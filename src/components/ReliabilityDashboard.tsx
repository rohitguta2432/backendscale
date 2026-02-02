"use client";

import { useState, useEffect } from "react";
import type { PagesDictionary } from "@/lib/i18n";

interface ReliabilityDashboardProps {
    dict: PagesDictionary["reliability"]["dashboard"];
}

interface Metrics {
    cpu: number;
    memory: number;
    requests: number;
    latency: number;
}

export default function ReliabilityDashboard({ dict }: ReliabilityDashboardProps) {
    const [metrics, setMetrics] = useState<Metrics>({
        cpu: 45,
        memory: 62,
        requests: 1250,
        latency: 24,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics((prev) => ({
                cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
                memory: Math.min(100, Math.max(0, prev.memory + (Math.random() * 6 - 3))),
                requests: Math.max(0, prev.requests + Math.floor(Math.random() * 100 - 50)),
                latency: Math.max(0, prev.latency + (Math.random() * 4 - 2)),
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (value: number, type: "cpu" | "memory" | "latency") => {
        if (type === "cpu" || type === "memory") {
            if (value > 80) return "text-red-500";
            if (value > 60) return "text-yellow-500";
            return "text-green-500";
        }
        if (type === "latency") {
            if (value > 100) return "text-red-500";
            if (value > 50) return "text-yellow-500";
            return "text-green-500";
        }
        return "text-green-500";
    };

    return (
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 w-full max-w-4xl mx-auto my-12 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    {dict.title}
                </h2>
                <div className="text-xs text-neutral-400 font-mono">LIVE</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <MetricCard
                    label={dict.cpu}
                    value={`${metrics.cpu.toFixed(1)}%`}
                    color={getStatusColor(metrics.cpu, "cpu")}
                />
                <MetricCard
                    label={dict.memory}
                    value={`${metrics.memory.toFixed(1)}%`}
                    color={getStatusColor(metrics.memory, "memory")}
                />
                <MetricCard
                    label={dict.requests}
                    value={metrics.requests.toLocaleString()}
                    color="text-blue-500"
                />
                <MetricCard
                    label={dict.latency}
                    value={`${metrics.latency.toFixed(0)}ms`}
                    color={getStatusColor(metrics.latency, "latency")}
                />
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800">
                <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden bg-neutral-800">
                    <div style={{ width: `${metrics.cpu}%` }} className="bg-green-500 transition-all duration-500"></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-neutral-500">
                    <span>System Load</span>
                    <span>{metrics.cpu.toFixed(1)}%</span>
                </div>
            </div>
        </section>
    );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="bg-neutral-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-neutral-700/50 backdrop-blur-sm">
            <span className="text-xs text-neutral-400 uppercase tracking-wider mb-1">{label}</span>
            <span className={`text-2xl sm:text-3xl font-bold font-mono ${color} transition-colors duration-300`}>{value}</span>
        </div>
    );
}
