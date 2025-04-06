"use client";

import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
  studentData?: { rollNo: string };
  studentSubjects?: { subject_id: number; subject_name: string }[];
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      console.error("User not found in local storage");
    }
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!userData || !userData.email) return;

      try {
        const email = userData.email;
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
  }, [userData]);

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

    setIsUploading(true);

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
        setAssignments((prev) =>
          prev.map((a) => (a.id === selectedAssignment.id ? { ...a, is_submitted: true } : a))
        );
        closeModal();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("An error occurred while uploading.");
    } finally {
      setIsUploading(false);
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
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl font-bold text-[#000000] dark:text-[#FFFFFF] tracking-tight text-center">
                Available Assignments
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Assignments List */}
          {loading ? (
            <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md text-center">
              <p className="text-gray-600 dark:text-gray-300">Loading assignments...</p>
            </Card>
          ) : assignments.length === 0 ? (
            <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md text-center">
              <p className="text-gray-600 dark:text-gray-300">No assignments available.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <CardContent className="p-0 space-y-3">
                    <h2 className="text-xl font-semibold text-[#000000] dark:text-[#FFFFFF]">
                      {assignment.subject_name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">{assignment.question}</p>
                    <p className="text-[#000000] dark:text-[#FFFFFF]">
                      <strong>Marks:</strong> {assignment.total_marks}
                    </p>
                    {assignment.pdf_location_url && (
                      <a
                        href={assignment.pdf_location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#000000] dark:text-[#FFFFFF] underline hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        View Assignment
                      </a>
                    )}
                  </CardContent>
                  <Button
                    onClick={() => openModal(assignment)}
                    className={`mt-4 w-full text-white ${
                      assignment.is_submitted
                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-[#000000] hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-gray-200"
                    } rounded-full`}
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
            <DialogContent className="bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 max-w-lg w-full rounded-3xl p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-[#000000] dark:text-[#FFFFFF] text-center">
                  Submit Assignment
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <h2 className="text-xl font-medium text-[#000000] dark:text-[#FFFFFF] text-center">
                  {selectedAssignment?.subject_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-center">{selectedAssignment?.question}</p>
                <p className="text-[#000000] dark:text-[#FFFFFF] text-center">
                  <strong>Marks:</strong> {selectedAssignment?.total_marks}
                </p>
                {selectedAssignment?.pdf_location_url && (
                  <div className="text-center">
                    <a
                      href={selectedAssignment.pdf_location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#000000] dark:text-[#FFFFFF] underline hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      View Assignment
                    </a>
                  </div>
                )}
              </div>

              {/* File Upload Section */}
              <div className="mt-6 border-2 border-dashed border-gray-300/50 dark:border-gray-700/50 rounded-xl p-6 flex flex-col items-center space-y-3">
                <Label htmlFor="file-upload" className="text-[#000000] dark:text-[#FFFFFF] font-medium text-lg">
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
                  className="cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#000000] dark:text-[#FFFFFF] px-4 py-2 rounded-full shadow-md transition-all"
                >
                  Choose File
                </label>
                {selectedFile ? (
                  <p className="text-[#000000] dark:text-[#FFFFFF] font-medium">{selectedFile.name}</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No file selected</p>
                )}
              </div>

              <DialogFooter className="mt-6 flex justify-between">
                <Button
                  onClick={closeModal}
                  className="bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-700 px-6 py-2 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  className="bg-[#000000] dark:bg-[#FFFFFF] text-white dark:text-[#000000] hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-2 rounded-full flex items-center gap-2"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white dark:text-[#000000]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}