"use client";

import { useEffect, useState } from "react";
import TeacherSidebar from "../sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Task {
  id: number;
  subject: string;
  question: string;
  criteria: string;
  total_marks: number;
  pdf_location_url?: string;
  created_at: string;
  status: boolean;
}

export default function TeacherTasks() {
  const [teacher, setTeacher] = useState<{ fullName: string; subject: string; rollNo?: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacherDetails");
    if (storedTeacher) {
      try {
        const parsedTeacher = JSON.parse(storedTeacher);
        setTeacher(parsedTeacher);
        if (parsedTeacher.rollNo) {
          fetchTasks(parsedTeacher.rollNo);
        }
      } catch (err) {
        console.error("Error parsing teacher details:", err);
        setError("Failed to load teacher details.");
        setLoading(false);
      }
    }
  }, []);

  const fetchTasks = async (rollNo: string) => {
    try {
      const response = await fetch(`/api/teacher/tasks?rollNo=${encodeURIComponent(rollNo)}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
      } else {
        console.error("Error fetching tasks:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (taskId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`/api/teacher/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
        );
      } else {
        console.error("Error updating status:", data.error);
        setError("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status.");
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/teacher/tasks?id=${taskId}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } else {
        console.error("Error deleting task:", data.error);
        setError("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFFFF] dark:bg-[#000000] transition-colors duration-300 ease-in-out relative overflow-hidden">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="none" stroke="%23808080" stroke-width="1" d="M50 150 Q100 50 150 150" opacity="0.5"/></svg>')`,
          }}
        />
      </div>

      {/* Sidebar */}
      <div className="w-72 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-r border-gray-300/50 dark:border-gray-800/50 shadow-lg">
        <TeacherSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md">
            <h1 className="text-3xl font-bold text-[#000000] dark:text-[#FFFFFF] tracking-tight text-center">
              Your Assignments
            </h1>
          </Card>

          {/* Loading/Error/No Tasks States */}
          {loading && (
            <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md text-center">
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            </Card>
          )}
          {error && (
            <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </Card>
          )}
          {!loading && !error && tasks.length === 0 && (
            <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md text-center">
              <p className="text-gray-600 dark:text-gray-300">No assignments found.</p>
            </Card>
          )}

          {/* Tasks List */}
          {!loading && !error && tasks.length > 0 && (
            <div className="space-y-6">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Task Details */}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-[#000000] dark:text-[#FFFFFF] mb-2">
                        {task.question}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">Subject: {task.subject}</p>
                      <p className="text-gray-600 dark:text-gray-300">Total Marks: {task.total_marks}</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Created At:{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }).format(new Date(task.created_at))}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 dark:text-gray-300 text-sm">Status:</span>
                        <Switch
                          checked={task.status}
                          onCheckedChange={() => handleStatusToggle(task.id, task.status)}
                        />
                      </div>
                      <Button
                        onClick={() => handleDelete(task.id)}
                        className="bg-[#000000] text-white hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-black dark:hover:bg-gray-200 px-4 py-2 rounded-full"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}