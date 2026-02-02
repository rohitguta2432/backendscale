"use client";

import { useState, useEffect } from "react";

interface MetricCardProps {
    label: string;
    value: string;
    unit?: string;
    status: "good" | "warning" | "critical";
}

function MetricCard({ label, value, unit, status }: MetricCardProps) {
    const statusColors = {
        good: "text-green-500 border-green-500/30 bg-green-500/5",
        warning: "text-yellow-500 border-yellow-500/30 bg-yellow-500/5",
        critical: "text-red-500 border-red-500/30 bg-red-500/5",
    };

    return (
        <div className={`p-6 rounded-xl border-2 ${statusColors[status]} backdrop-blur-sm transition-all`}>
            <div className="text-sm text-neutral-400 mb-2">{label}</div>
            <div className={`text-4xl font-bold font-mono ${statusColors[status].split(" ")[0]}`}>
                {value}
                {unit && <span className="text-2xl ml-1">{unit}</span>}
            </div>
        </div>
    );
}

export default function PrometheusMetrics() {
    const [metrics, setMetrics] = useState({
        requestRate: 1247,
        errorRate: 0.12,
        p95Latency: 23.4,
        p99Latency: 45.2,
        activeConnections: 342,
        cpuUsage: 42.3,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics((prev) => ({
                requestRate: Math.max(0, prev.requestRate + Math.floor(Math.random() * 100 - 50)),
                errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() * 0.2 - 0.1))),
                p95Latency: Math.max(0, prev.p95Latency + (Math.random() * 4 - 2)),
                p99Latency: Math.max(0, prev.p99Latency + (Math.random() * 6 - 3)),
                activeConnections: Math.max(0, prev.activeConnections + Math.floor(Math.random() * 20 - 10)),
                cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() * 5 - 2.5))),
            }));
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const getStatus = (metric: keyof typeof metrics): "good" | "warning" | "critical" => {
        if (metric === "errorRate") {
            if (metrics.errorRate > 1) return "critical";
            if (metrics.errorRate > 0.5) return "warning";
            return "good";
        }
        if (metric === "p95Latency" || metric === "p99Latency") {
            if (metrics[metric] > 100) return "critical";
            if (metrics[metric] > 50) return "warning";
            return "good";
        }
        if (metric === "cpuUsage") {
            if (metrics.cpuUsage > 80) return "critical";
            if (metrics.cpuUsage > 60) return "warning";
            return "good";
        }
        return "good";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">Live Prometheus Metrics</h3>
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    label="Request Rate"
                    value={metrics.requestRate.toLocaleString()}
                    unit="req/s"
                    status="good"
                />
                <MetricCard
                    label="Error Rate"
                    value={metrics.errorRate.toFixed(2)}
                    unit="%"
                    status={getStatus("errorRate")}
                />
                <MetricCard
                    label="P95 Latency"
                    value={metrics.p95Latency.toFixed(1)}
                    unit="ms"
                    status={getStatus("p95Latency")}
                />
                <MetricCard
                    label="P99 Latency"
                    value={metrics.p99Latency.toFixed(1)}
                    unit="ms"
                    status={getStatus("p99Latency")}
                />
                <MetricCard
                    label="Active Connections"
                    value={metrics.activeConnections.toString()}
                    status="good"
                />
                <MetricCard
                    label="CPU Usage"
                    value={metrics.cpuUsage.toFixed(1)}
                    unit="%"
                    status={getStatus("cpuUsage")}
                />
            </div>
        </div>
    );
}
