"use client";

import TeacherSidebar from "../sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const submissions = [
    { student: "Alice", assignment: "Math Homework", status: "Pending", score: null },
    { student: "Bob", assignment: "Physics Lab Report", status: "Pending", score: null },
];

export default function EvaluateSubmissions() {
    const [grades, setGrades] = useState<{ [key: number]: number | null }>({});

    const handleGradeChange = (index: number, value: number) => {
        setGrades({ ...grades, [index]: value });
    };

    const submitGrades = () => {
        alert("Grades submitted successfully!");
        console.log(grades);
    };

    return (
        <div className="flex min-h-screen bg-white text-black">
            <TeacherSidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Evaluate Submissions</h1>
                <div className="bg-gray-100 p-4 rounded-lg">
                    {submissions.map((submission, index) => (
                        <div key={index} className="flex justify-between p-2 border-b">
                            <span>{submission.student} - {submission.assignment}</span>
                            <input
                                type="number"
                                placeholder="Score"
                                className="w-16 p-1 border rounded"
                                onChange={(e) => handleGradeChange(index, Number(e.target.value))}
                            />
                        </div>
                    ))}
                    <Button className="mt-4" onClick={submitGrades}>Submit Grades</Button>
                </div>
            </main>
        </div>
    );
}
