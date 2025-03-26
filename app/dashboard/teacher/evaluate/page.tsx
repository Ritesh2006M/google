"use client";

import TeacherSidebar from "../sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const submissions = [
    { student: "Alice", assignment: "Math Homework", time: "March 25, 2025 - 10:30 AM" },
    { student: "Bob", assignment: "Physics Lab Report", time: "March 25, 2025 - 11:15 AM" },
];

export default function EvaluateSubmissions() {
    const evaluateStudent = (index: number) => {
        alert(`Evaluating ${submissions[index].student}'s submission...`);
    };

    const evaluateAll = () => {
        alert("Evaluating all submissions...");
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar (white background) */}
            <div className="bg-white w-64 shadow-md">
                <TeacherSidebar />
            </div>

            {/* Main Content (grey background) */}
            <main className="flex-1 p-6 bg-gray-100">
                {/* Title Card */}
                <Card className="mb-6 shadow-md border border-gray-300">
                    <CardContent className="p-4">
                        <h1 className="text-2xl font-bold">Evaluate Submissions</h1>
                    </CardContent>
                </Card>

                {/* Evaluate All Button */}
                <Button className="mb-4 bg-black text-white px-4 py-2 shadow-md" onClick={evaluateAll}>
                    Evaluate All
                </Button>

                {/* Submissions List */}
                <div className="space-y-4">
                    {submissions.map((submission, index) => (
                        <Card key={index} className="shadow-md border border-gray-300">
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{submission.student}</h2>
                                    <p className="text-gray-500">{submission.assignment}</p>
                                    <p className="text-gray-400 text-sm">{submission.time}</p>
                                </div>
                                <Button
                                    className="bg-black text-white px-3 py-1 shadow"
                                    onClick={() => evaluateStudent(index)}
                                >
                                    Evaluate
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
