"use client";

import Sidebar from "../sidebar";
import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import Image from "next/image";

interface Result {
    assignment_id: number;
    task_id: number;
    subject_name: string;
    question: string;
    result: number;
    response: string;
}

interface UserData {
    email: string;
    role: "student" | "teacher";
    studentData?: {
        rollNo: string;
    };
}

export default function StudentResult() {
    const [results, setResults] = useState<Result[]>([]);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // State for dialog
    const [selectedResponse, setSelectedResponse] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (!userData?.studentData?.rollNo) return;
            try {
                const response = await fetch(`/api/student/result?rollNo=${userData.studentData.rollNo}`);
                if (!response.ok) throw new Error("Failed to fetch results");
                const data = await response.json();
                setResults(data.results || data); // in case it's not wrapped under `results`
            } catch (err) {
                console.error("Error fetching results:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [userData]);

    return (
        <div className="flex min-h-screen bg-gray-100 text-black overflow-hidden">
            <div className="bg-white w-64 shadow-md">
                <Sidebar/>
            </div>

            <main className="flex-1 p-8 overflow-y-auto">
                <Card className="mb-6 p-4 bg-white">
                    <h1 className="text-2xl font-bold text-black">Your Results</h1>
                </Card>

                {loading ? (
                    <p>Loading results...</p>
                ) : results.length === 0 ? (
                    <p>No results available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((res) => (
                            <Card key={res.assignment_id} className="p-4 shadow-md bg-white border border-gray-300">
                                <h2 className="text-xl font-semibold text-black">{res.subject_name}</h2>
                                <p className="text-gray-700 mt-2">{res.question}</p>
                                <p className="text-black mt-4">
                                    <strong>Marks Scored:</strong> {res.result}
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => setSelectedResponse(res.response)}
                                >
                                    View Result
                                </Button>
                            </Card>

                        ))}
                    </div>
                )}

                {/* Dialog for showing student response */}
                <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
                    <DialogContent className="max-w-2xl w-full p-6">
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-xl font-semibold text-black">
                                    Evaluation Result
                                </DialogTitle>
                                <span className="text-sm text-gray-500">Powered by</span>
                                <Image
                                    src="/geminiLogo.png" // Ensure the image is in the public folder
                                    alt="Gemini Logo"
                                    width={80}
                                    height={20}
                                    className="pb-3 object-contain"
                                />
                            </div>
                        </DialogHeader>
                        <div className="max-h-[80vh] overflow-y-auto p-2 border rounded-lg bg-gray-50">
                            <p className="whitespace-pre-wrap text-gray-800">{selectedResponse}</p>
                        </div>
                    </DialogContent>
                </Dialog>

            </main>
        </div>
    );
}
