"use client";

import {useEffect, useState} from "react";
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

const COLORS = ["#000000", "#d1d5db"]; // Black for scored, gray for remaining

interface Props {
    rollNo: string;
}

export default function StudentPerformanceChart({rollNo}: Props) {
    const [data, setData] = useState<{
        totalScored: number;
        totalPossible: number;
        averagePercentage: string;
    } | null>(null);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const res = await fetch(`/api/student/metrics?rollNo=${rollNo}`);
                const json = await res.json();
                if (json.success) {
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch performance data", error);
            }
        };

        fetchPerformance();
    }, [rollNo]);

    if (!data) return null;

    const chartData = [
        {name: "Scored", value: data.totalScored},
        {name: "Remaining", value: data.totalPossible - data.totalScored},
    ];

    return (
        <Card className="shadow-md mb-6">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-lg font-semibold">
                    {data.averagePercentage}% Scored
                </div>
            </CardContent>
        </Card>
    );
}
