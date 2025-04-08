"use client";

import TeacherSidebar from "../sidebar";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Loader2, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function UploadAssignment() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assignmentQuestion, setAssignmentQuestion] = useState("");
  const [criteria, setCriteria] = useState<{ name: string; marks: number }[]>([{ name: "", marks: 0 }]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [isAutoEvaluation, setIsAutoEvaluation] = useState(false);
  const [maxAutoMarks, setMaxAutoMarks] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [teacher, setTeacher] = useState<{ fullName: string; subject: string; rollNo?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacherDetails");
    if (storedTeacher) {
      setTeacher(JSON.parse(storedTeacher));
    }
  }, []);

  // File Handling
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Please drop a PDF file only.");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!assignmentQuestion.trim()) {
      alert("Please enter an assignment question.");
      return;
    }

    setLoading(true);
    let finalTotalMarks = isAutoEvaluation ? maxAutoMarks : totalMarks;
    let formattedCriteria = isAutoEvaluation
      ? [{ name: "Auto evaluate based on question and answer", marks: maxAutoMarks }]
      : criteria.map((crit) => ({ name: `${crit.name} for ${crit.marks} marks` }));

    const formData = new FormData();
    formData.append("assignmentQuestion", assignmentQuestion);
    formData.append("subject", teacher?.subject || "");
    formData.append("rollNo", teacher?.rollNo || "");
    formData.append("criteria", JSON.stringify(formattedCriteria));
    formData.append("totalMarks", finalTotalMarks.toString());

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const response = await fetch("/api/teacher/upload-assignment", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        alert("Assignment uploaded successfully!");
        setSelectedFile(null);
        setAssignmentQuestion("");
        setCriteria([{ name: "", marks: 0 }]);
        setTotalMarks(0);
        setIsAutoEvaluation(false);
        setMaxAutoMarks(100);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading the assignment.");
    } finally {
      setLoading(false);
    }
  };

  const addCriteria = () => {
    setCriteria([...criteria, { name: "", marks: 0 }]);
  };

  const updateCriteria = (index: number, field: "name" | "marks", value: string | number) => {
    const newCriteria = [...criteria];
    if (field === "name") {
      newCriteria[index].name = value as string;
    } else {
      let numValue = Number(value);
      if (!isNaN(numValue) && numValue >= 0) {
        newCriteria[index].marks = numValue;
      }
    }
    setCriteria(newCriteria);
    setTotalMarks(newCriteria.reduce((sum, item) => sum + item.marks, 0));
  };

  const removeCriteria = (index: number) => {
    if (criteria.length === 1) return;
    const newCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(newCriteria);
    setTotalMarks(newCriteria.reduce((sum, item) => sum + item.marks, 0));
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
      <div
          className="w-72 fixed top-0 left-0 h-screen bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-r border-gray-300/50 dark:border-gray-800/50 shadow-lg z-50">
        <TeacherSidebar/>
      </div>


      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto ml-72">

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <Card
              className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md">
            <h1 className="text-3xl font-bold text-[#000000] dark:text-[#FFFFFF] tracking-tight text-center">
              Upload Assignment
            </h1>
          </Card>

          {/* Assignment Question */}
          <Card
              className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              <label className="text-lg font-semibold text-[#000000] dark:text-[#FFFFFF] block">
                Assignment Question
              </label>
              <Textarea
                  value={assignmentQuestion}
                  onChange={(e) => setAssignmentQuestion(e.target.value)}
                  placeholder="Type your assignment question here..."
                  className="w-full resize-none min-h-[100px] bg-transparent border-gray-300 dark:border-gray-600 text-[#000000] dark:text-[#FFFFFF] rounded-xl"
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                  }}
              />
            </div>
          </Card>

          {/* File Upload with Drag-and-Drop */}
          <Card
              className={`p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ${
                  isDragging ? "border-dashed border-2 border-gray-500" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <label className="text-lg font-semibold text-[#000000] dark:text-[#FFFFFF] block">
                Upload Assignment File <span className="text-gray-500 dark:text-gray-400 text-sm">(PDFs)</span>
              </label>
              {!selectedFile ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Upload className="w-10 h-10 text-gray-500 dark:text-gray-400"/>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Drag and drop a PDF here or{" "}
                      <label
                          htmlFor="file-upload"
                          className="underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        browse
                      </label>
                    </p>
                    <Input
                        id="file-upload"
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                  </div>
              ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
                      <strong>Selected:</strong> {selectedFile.name}
                    </p>
                    <Button
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="bg-[#000000] text-white hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-black dark:hover:bg-gray-200 px-4 py-2 rounded-full"
                    >
                      Delete
                    </Button>
                  </div>
              )}
            </div>
          </Card>

          {/* Auto Evaluation & Criteria */}
          <Card
              className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#000000] dark:text-[#FFFFFF]">
                  Auto Evaluation
                </span>
                <Switch checked={isAutoEvaluation} onCheckedChange={setIsAutoEvaluation}/>
              </div>
              <hr className="border-gray-300 dark:border-gray-600"/>
              {isAutoEvaluation ? (
                  <div className="space-y-4">
                    <label className="text-md font-medium text-[#000000] dark:text-[#FFFFFF] block">
                      Max Auto Evaluation Marks
                    </label>
                    <Input
                        type="number"
                        placeholder="Max Marks"
                        value={maxAutoMarks || ""}
                        onChange={(e) => {
                          let numValue = e.target.value;
                          if (numValue === "") setMaxAutoMarks(0);
                          let num = Number(numValue);
                          if (!isNaN(num) && num >= 0) setMaxAutoMarks(num);
                        }}
                        className="w-1/3 bg-transparent border-gray-300 dark:border-gray-600 text-[#000000] dark:text-[#FFFFFF] rounded-xl"
                    />
                  </div>
              ) : (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-[#000000] dark:text-[#FFFFFF]">Evaluation Criteria</h2>
                    {criteria.map((criterion, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Textarea
                              placeholder="Enter criterion (e.g., Clarity)"
                              value={criterion.name}
                              onChange={(e) => updateCriteria(index, "name", e.target.value)}
                              className="flex-1 resize-none min-h-[40px] bg-transparent border-gray-300 dark:border-gray-600 text-[#000000] dark:text-[#FFFFFF] rounded-xl"
                              onInput={(e) => {
                                e.currentTarget.style.height = "auto";
                                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                              }}
                          />
                          <Input
                              type="number"
                              placeholder="Marks"
                              value={criterion.marks || ""}
                              onChange={(e) => updateCriteria(index, "marks", e.target.value)}
                              className="w-24 bg-transparent border-gray-300 dark:border-gray-600 text-[#000000] dark:text-[#FFFFFF] rounded-xl"
                          />
                          <Button
                              onClick={() => removeCriteria(index)}
                              className="bg-[#000000] text-white hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-black dark:hover:bg-gray-200 p-2 rounded-full"
                              disabled={criteria.length === 1}
                          >
                            <Trash className="h-4 w-4"/>
                          </Button>
                        </div>
                    ))}
                    <Button
                        onClick={addCriteria}
                        className="w-full bg-[#000000] text-white hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-black dark:hover:bg-gray-200 px-4 py-2 rounded-full"
                    >
                      + Add Criterion
                    </Button>
                    <div className="text-md font-medium text-[#000000] dark:text-[#FFFFFF] text-center">
                      Total Marks: {totalMarks}
                    </div>
                  </div>
              )}
            </div>
          </Card>

          {/* Upload Button */}
          <Button
              onClick={handleUpload}
              className="w-full bg-[#000000] text-white hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-black dark:hover:bg-gray-200 px-6 py-3 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
              disabled={loading}
          >
            {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5"/>
                  Uploading...
                </>
            ) : (
                "Upload Assignment"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
