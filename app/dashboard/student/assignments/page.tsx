"use client";

import Sidebar from "../sidebar";
import { useEffect, useState } from "react";

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
        <div className="flex min-h-screen bg-white text-black">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Available Assignments</h1>

                {loading ? (
                    <p>Loading assignments...</p>
                ) : assignments.length === 0 ? (
                    <p>No assignments available.</p>
                ) : (
                    <div className="space-y-4">
                        {assignments.map((assignment) => (
                            <div key={assignment.id} className="p-4 border rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold">{assignment.subject_name}</h2>
                                <p className="text-gray-700">{assignment.question}</p>
                                <p><strong>Marks:</strong> {assignment.total_marks}</p>
                                {assignment.pdf_location_url && (
                                    <a href={assignment.pdf_location_url} target="_blank" rel="noopener noreferrer"
                                       className="text-blue-600 underline">
                                        View Assignment
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
