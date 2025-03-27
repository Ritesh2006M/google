"use client";

import {useEffect, useState} from "react";
import TeacherSidebar from "../sidebar";
import {Card} from "@/components/ui/card";

interface Task {
    id: number;
    subject: string;
    question: string;
    criteria: string;
    total_marks: number;
    pdf_location_url?: string;
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
            console.log(`Fetching tasks for rollNo: ${rollNo}`);
            const response = await fetch(`/api/tasks?rollNo=${encodeURIComponent(rollNo)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Fetched tasks:", data);

            if (data.success) {
                setTasks(data.tasks);
            } else {
                throw new Error(data.error || "Unknown error occurred");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="bg-white w-64 shadow-md">
                <TeacherSidebar/>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Your Assignments</h1>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {!loading && !error && tasks.length === 0 && <p>No assignments found.</p>}

                {!loading && !error && tasks.length > 0 && (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <Card key={task.id} className="p-4">
                                <h2 className="text-xl font-semibold">{task.question}</h2>
                                <p className="text-gray-600">Subject: {task.subject}</p>
                                <p className="text-gray-600">Total Marks: {task.total_marks}</p>
                                <p className="text-gray-500">
                                    Created At: {new Date(task.created_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                }).replace(/(\d{2}) (\w{3}) (\d{4})/, (_, day, month, year) => `${day} ${month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()} ${year}`)}
                                    {" "}
                                    {new Date(task.created_at).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true
                                    })}
                                </p>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
