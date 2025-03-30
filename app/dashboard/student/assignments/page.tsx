"use client";

import Sidebar from "../sidebar";
import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";

interface Assignment {
    id: number;
    subject_name: string;
    question: string;
    total_marks: number;
    pdf_location_url: string | null;
}

export default function StudentAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch("/api/getAssignments?email=student@gmail.com");
                const data = await response.json();
                setAssignments(data.assignments);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    return (
        <div className="flex h-screen bg-white text-black overflow-hidden">

            <div className="bg-white w-64 shadow-md">
                <Sidebar/>
            </div>
            <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
                <Card className="mb-6 p-4">
                    <h1 className="text-2xl font-bold mb-4">Available Assignments</h1>
                </Card>

                {loading ? (
                    <p>Loading assignments...</p>
                ) : assignments.length === 0 ? (
                    <p>No assignments available.</p>
                ) : (
                    <div className="space-y-4">
                        {assignments.map((assignment) => (
                            <Card className="mb-6 p-4">
                                <h2 className="text-xl font-semibold">{assignment.subject_name}</h2>
                                <p className="text-gray-700">{assignment.question}</p>
                                <p><strong>Marks:</strong> {assignment.total_marks}</p>
                                {assignment.pdf_location_url && (
                                    <a href={assignment.pdf_location_url} target="_blank" rel="noopener noreferrer"
                                       className="text-blue-600 underline">
                                        View Assignment
                                    </a>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
