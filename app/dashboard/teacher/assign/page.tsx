"use client";

import { useEffect, useState } from "react";
import TeacherSidebar from "../sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Toggle Switch Component

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
        const newStatus = !currentStatus; // Toggle status

        try {
            const response = await fetch(`/api/teacher/tasks`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: taskId, status: newStatus }),
            });

            const data = await response.json();
            if (data.success) {
                setTasks(prevTasks =>
                    prevTasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task)
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
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
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
        <div className="flex min-h-screen">
            <aside className="bg-white w-64 shadow-md">
                <TeacherSidebar />
            </aside>

            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Your Assignments</h1>

                {loading && <p className="text-gray-600">Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && tasks.length === 0 && (
                    <p className="text-gray-600">No assignments found.</p>
                )}

                {!loading && !error && tasks.length > 0 && (
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                        {tasks.map((task) => (
                            <Card key={task.id} className="p-4 flex justify-between items-center shadow-sm border border-gray-200">
                                <div>
                                    <h2 className="text-xl font-semibold">{task.question}</h2>
                                    <p className="text-gray-600">Subject: {task.subject}</p>
                                    <p className="text-gray-600">Total Marks: {task.total_marks}</p>
                                    <p className="text-gray-600">
                                        Created At: {new Intl.DateTimeFormat("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true
                                    }).format(new Date(task.created_at))}
                                    </p>
                                    <div className="mt-2 flex items-center">
                                        <span className="text-gray-600 mr-2">Status:</span>
                                        <Switch checked={task.status} onCheckedChange={() => handleStatusToggle(task.id, task.status)} />
                                    </div>

                                </div>
                                <Button onClick={() => handleDelete(task.id)} className="bg-red-500 text-white">
                                    Delete
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
