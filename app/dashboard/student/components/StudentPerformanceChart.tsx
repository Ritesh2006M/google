"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CardContent } from "@/components/ui/card";

interface Props {
  rollNo: string;
}

export default function StudentPerformanceChart({ rollNo }: Props) {
  const [data, setData] = useState<{
    totalScored: number;
    totalPossible: number;
    averagePercentage: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [rollNo]);

  if (loading) {
    return (
      <CardContent className="flex justify-center items-center h-[165px]">
        <p className="text-gray-600 dark:text-gray-300">Loading performance...</p>
      </CardContent>
    );
  }

  if (!data) {
    return (
      <CardContent className="flex justify-center items-center h-[165px]">
        <p className="text-gray-600 dark:text-gray-300">No performance data available</p>
      </CardContent>
    );
  }

  const chartData = [
    { name: "Scored", value: data.totalScored },
    { name: "Remaining", value: data.totalPossible - data.totalScored },
  ];

  const COLORS = ["#000000", "#808080"]; // Black for scored, gray for remaining

  return (
    <CardContent className="flex flex-col items-center pt-19">
      <ResponsiveContainer width="100%" height={165}>
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
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className={index === 0 ? "dark:fill-[#FFFFFF]" : ""}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-lg font-semibold text-[#000000] dark:text-[#FFFFFF]">
        {data.averagePercentage}% Scored
      </div>
    </CardContent>
  );
}