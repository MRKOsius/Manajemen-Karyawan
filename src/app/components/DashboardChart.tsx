"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DepartemenStat {
    name: string;
    total: number;
}

export default function DashboardChart({ data }: { data: DepartemenStat[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center border border-dashed border-border-strong rounded-[8px] mt-4">
                <p className="text-[13px] text-ink-muted">Belum ada data visualisasi tersedia.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-strong)" opacity={0.5} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: 'var(--ink-muted)' }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: 'var(--ink-muted)' }}
                        allowDecimals={false}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'var(--bg-elevated)', 
                            border: '1px solid var(--border-default)', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            color: 'var(--ink-primary)'
                        }}
                        cursor={{ fill: 'var(--bg-elevated)', opacity: 0.4 }}
                        itemStyle={{ color: 'var(--accent)' }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={50}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? "var(--accent)" : "var(--border-strong)"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
