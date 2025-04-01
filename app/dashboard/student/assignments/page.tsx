"use client";

import Sidebar from "../sidebar";
import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";

interface Assignment {
    id: number;
    subject_id: number;
    subject_name: string;
    question: string;
    total_marks: number;
    pdf_location_url: string | null;
    is_submitted: boolean;
}


interface UserData {
    email: string;
    role: "student" | "teacher";
    studentData?: {
        rollNo: string;
    };
    studentSubjects?: { subject_id: number; subject_name: string }[];
}

export default function StudentAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load user details from localStorage ONCE and then use it in both effects
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        } else {
            console.error("User not found in local storage");
        }
    }, []);

    // Fetch assignments ONLY when userData is set
    useEffect(() => {
        const fetchAssignments = async () => {
            if (!userData || !userData.email) return; // Ensure userData is set

            try {
                const email = userData.email; // Extract email correctly
                console.log("Fetching assignments for:", email);

                const response = await fetch(`/api/student/getAssignments?email=${encodeURIComponent(email)}`);
                if (!response.ok) throw new Error("Failed to fetch assignments");

                const data = await response.json();
                setAssignments(data.assignments || []);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [userData]); // ✅ Runs ONLY when userData is set

    const openModal = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedAssignment(null);
        setSelectedFile(null);
        setIsModalOpen(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedAssignment || !userData?.studentData) {
            alert("Please select a file to upload.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("taskId", selectedAssignment.id.toString());
            formData.append("rollNo", userData.studentData.rollNo);
            formData.append("file", selectedFile);

            const response = await fetch("/api/student/uploadAssignment", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                alert("Assignment uploaded successfully!");
                closeModal();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("An error occurred while uploading.");
        }
    };

    return (
        <div className="flex h-screen bg-white text-black overflow-hidden">
            <div className="bg-white w-64 shadow-md">
                <Sidebar/>
            </div>
            <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
                <Card className="mb-6 p-4 bg-white">
                    <h1 className="text-2xl font-bold mb-4 text-black">Available Assignments</h1>
                </Card>

                {loading ? (
                    <p className="text-black">Loading assignments...</p>
                ) : assignments.length === 0 ? (
                    <p className="text-black">No assignments available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments.map((assignment) => (
                            <Card key={assignment.id}
                                  className="p-4 flex flex-col justify-between shadow-md bg-white border border-gray-300">
                                <div>
                                    <h2 className="text-xl font-semibold text-black">{assignment.subject_name}</h2>
                                    <p className="text-gray-700">{assignment.question}</p>
                                    <p className="text-black"><strong>Marks:</strong> {assignment.total_marks}</p>
                                    {assignment.pdf_location_url && (
                                        <a href={assignment.pdf_location_url} target="_blank" rel="noopener noreferrer"
                                           className="text-blue-600 underline">
                                            View Assignment
                                        </a>
                                    )}
                                </div>
                                <Button
                                    onClick={() => openModal(assignment)}
                                    className={`mt-4 w-full text-white ${
                                        assignment.is_submitted
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-black hover:bg-gray-800"
                                    }`}
                                    disabled={assignment.is_submitted}
                                >
                                    {assignment.is_submitted ? "Already Submitted" : "Upload Assignment"}
                                </Button>

                            </Card>
                        ))}
                    </div>
                )}

                {/* Modal Popup */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent
                        className="bg-white text-black border border-gray-300 max-w-lg w-full rounded-xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-center">
                                Submit Assignment
                            </DialogTitle>
                        </DialogHeader>

                        <div className="mt-4 space-y-3">
                            <h2 className="text-xl font-medium text-center">{selectedAssignment?.subject_name}</h2>
                            <p className="text-gray-600 text-center">{selectedAssignment?.question}</p>
                            <p className="text-black text-center">
                                <strong>Marks:</strong> {selectedAssignment?.total_marks}</p>

                            {selectedAssignment?.pdf_location_url && (
                                <div className="text-center">
                                    <a href={selectedAssignment.pdf_location_url}
                                       target="_blank" rel="noopener noreferrer"
                                       className="text-blue-600 underline">
                                        View Assignment
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* File Upload Section */}
                        <div
                            className="mt-6 border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center space-y-3">
                            <Label htmlFor="file-upload" className="block text-black font-medium text-lg">
                                Upload Your Assignment
                            </Label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-md">
                                Choose File
                            </label>
                            {selectedFile ? (
                                <p className="text-green-600 font-medium">{selectedFile.name}</p>
                            ) : (
                                <p className="text-gray-500">No file selected</p>
                            )}
                        </div>

                        <DialogFooter className="mt-6 flex justify-between">
                            <Button onClick={closeModal}
                                    className="bg-gray-500 text-white hover:bg-gray-600 px-6 py-2 rounded-lg">
                                Cancel
                            </Button>
                            <Button onClick={handleUpload}
                                    className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-lg">
                                Submit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
