"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  email: string;
}

export default function StudentTasksChart({ email }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/student/metrics/getTasks?email=${email}`);
        const data = await res.json();
        if (data.success) {
          setPending(data.pendingAssignments);
          setTotal(data.totalAssignments);
          setCompleted(data.completedAssignments);
        }
      } catch (err) {
        console.error("Failed to fetch student tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [email]);

  if (loading) {
    return (
      <CardContent className="flex justify-center items-center h-[310px]">
        <p className="text-gray-600 dark:text-gray-300">Loading tasks...</p>
      </CardContent>
    );
  }

  if (pending === null || total === null || completed === null) {
    return (
      <CardContent className="flex justify-center items-center h-[310px]">
        <p className="text-gray-600 dark:text-gray-300">No task data available</p>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-center">
        {/* Total Tasks */}
        <div className="p-4 bg-white/90 dark:bg-[#1E1E1E]/90 rounded-xl shadow-md border border-gray-300/50 dark:border-gray-700/50">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Total</p>
          <p className="text-3xl font-bold text-[#000000] dark:text-[#FFFFFF]">{total}</p>
        </div>

        {/* Pending Tasks */}
        <div className="p-4 bg-white/90 dark:bg-[#1E1E1E]/90 rounded-xl shadow-md border border-gray-300/50 dark:border-gray-700/50">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Pending</p>
          <p className="text-3xl font-bold text-[#000000] dark:text-[#FFFFFF]">{pending}</p>
        </div>

        {/* Completed Tasks */}
        <div className="p-4 bg-white/90 dark:bg-[#1E1E1E]/90 rounded-xl shadow-md border border-gray-300/50 dark:border-gray-700/50">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Completed</p>
          <p className="text-3xl font-bold text-[#000000] dark:text-[#FFFFFF]">{completed}</p>
        </div>
      </div>

      {/* Button */}
      <div className="mt-8">
        <Button
          variant="default"
          className="bg-[#000000] text-white hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-gray-200 px-6 py-2 rounded-full transition-all"
          onClick={() => router.push("/dashboard/student/assignments")}
        >
          Go to Assignments
        </Button>
      </div>
    </CardContent>
  );
}