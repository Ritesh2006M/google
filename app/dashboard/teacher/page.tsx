"use client";
import { useEffect, useState } from "react";
import TeacherSidebar from "./sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
    const router = useRouter();
    const [teacher, setTeacher] = useState<{ fullName: string; subject: string; rollNo?: string } | null>(null);

    useEffect(() => {
        // Fetch teacher details from localStorage
        const storedTeacher = localStorage.getItem("teacherDetails");
        if (storedTeacher) {
            setTeacher(JSON.parse(storedTeacher));
        }
    }, []);

    return (
        <div className="flex min-h-screen">
            <div className="bg-white w-64 shadow-md">
                <TeacherSidebar />
            </div>
            <main className="flex-1 p-6 bg-gray-100">
                {/* Teacher Info */}
                {teacher && (
                    <Card className="mb-6 p-6">
                        <h1 className="text-3xl font-bold">Welcome, {teacher.fullName}</h1>
                        <p className="text-gray-600">Subject: {teacher.subject}</p>
                        {teacher.rollNo && <p className="text-gray-600">Roll No: {teacher.rollNo}</p>}
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upload Assignment */}
                    <Card className="p-6 flex flex-col items-start">
                        <h2 className="text-xl font-semibold">Upload Assignment</h2>
                        <p className="text-gray-500">Create and upload new assignments for students.</p>
                        <Button
                            onClick={() => router.push("/dashboard/teacher/upload")}
                            className="mt-4 bg-black text-white px-6 py-3 w-full"
                        >
                            Go to Upload
                        </Button>
                    </Card>

                    {/* Evaluate Submissions */}
                    <Card className="p-6 flex flex-col items-start">
                        <h2 className="text-xl font-semibold">Evaluate Submissions</h2>
                        <p className="text-gray-500">Review and grade student submissions.</p>
                        <Button
                            onClick={() => router.push("/dashboard/teacher/evaluate")}
                            className="mt-4 bg-black text-white px-6 py-3 w-full"
                        >
                            Go to Evaluation
                        </Button>
                    </Card>
                </div>
            </main>
        </div>
    );
}
