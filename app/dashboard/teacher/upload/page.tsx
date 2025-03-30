"use client";

import TeacherSidebar from "../sidebar";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {Trash} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {useRef} from "react";


export default function UploadAssignment() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [assignmentQuestion, setAssignmentQuestion] = useState("");
    const [criteria, setCriteria] = useState<{ name: string; marks: number }[]>([{name: "", marks: 0}]);
    const [totalMarks, setTotalMarks] = useState(0);
    const [isAutoEvaluation, setIsAutoEvaluation] = useState(false);
    const [maxAutoMarks, setMaxAutoMarks] = useState(100);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [teacher, setTeacher] = useState<{ fullName: string; subject: string; rollNo?: string } | null>(null);

    useEffect(() => {
        // Fetch teacher details from localStorage
        const storedTeacher = localStorage.getItem("teacherDetails");
        if (storedTeacher) {
            setTeacher(JSON.parse(storedTeacher));
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };


    const handleUpload = async () => {
        if (!assignmentQuestion.trim()) {
            alert("Please enter an assignment question.");
            return;
        }

        // Set total marks based on evaluation type
        let finalTotalMarks = isAutoEvaluation ? maxAutoMarks : totalMarks;

        // Prepare evaluation criteria
        let formattedCriteria;
        if (isAutoEvaluation) {
            formattedCriteria = [{name: "Auto evaluate based on question and answer", marks: maxAutoMarks}];
        } else {
            formattedCriteria = criteria.map((crit) => ({
                name: `${crit.name} for ${crit.marks} marks, `
            }));
        }

        // Prepare FormData for file assignments & other data
        const formData = new FormData();
        formData.append("assignmentQuestion", assignmentQuestion);
        // @ts-ignore
        formData.append("subject", teacher.subject);
        // @ts-ignore
        formData.append("rollNo", teacher.rollNo);
        formData.append("criteria", JSON.stringify(formattedCriteria));
        formData.append("totalMarks", finalTotalMarks.toString()); // Ensuring correct total marks
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            const response = await fetch("/api/teacher/upload-assignment", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                alert("Assignment uploaded successfully!");
                // Reset fields after successful assignments
                setSelectedFile(null);
                setAssignmentQuestion("");
                setCriteria([{name: "", marks: 0}]);
                setTotalMarks(0);
                setIsAutoEvaluation(false);
                setMaxAutoMarks(100);
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred while uploading the assignment.");
        }
    };


    const addCriteria = () => {
        setCriteria([...criteria, {name: "", marks: 0}]);
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
        <div className="flex h-screen bg-white text-black overflow-hidden">
            <div className="bg-white w-64 shadow-md">
                <TeacherSidebar/>
            </div>
            <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">

                <Card className="mb-6 p-4">
                    <h1 className="text-3xl font-bold">Upload Assignment</h1>
                </Card>


                {/* Assignment Question Input */}
                <Card className="mb-6 p-4">
                    <label className="text-lg font-semibold mb-2">Assignment Question</label>
                    <Textarea
                        value={assignmentQuestion}
                        onChange={(e) => setAssignmentQuestion(e.target.value)}
                        placeholder="Enter the assignment question"
                        className="mt-2 resize-none min-h-[50px]"
                        rows={1}
                        onInput={(e) => {
                            e.currentTarget.style.height = "auto";
                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                        }}
                    />
                </Card>

                {/* File Upload */}
                <Card className="mb-6 p-4">
                    {/* Label */}
                    <label className="text-lg font-semibold mb-2">
                        Upload Assignment File (PDF)
                        <span className="text-gray-400 text-sm"> (Optional)</span>
                    </label>

                    {/* File Input & Delete Button */}
                    <div className="flex items-center gap-4 mt-2">
                        <Input
                            type="file"
                            accept="application/pdf"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="w-2/3"
                        />
                        {selectedFile && (
                            <Button
                                onClick={() => {
                                    setSelectedFile(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = ""; // Clear file input field
                                    }
                                }}
                                className="bg-red-500 text-white px-4 py-2"
                            >
                                Delete
                            </Button>
                        )}
                    </div>

                    {/* Display Selected File */}
                    {selectedFile && (
                        <p className="mt-2 text-sm text-gray-600 truncate max-w-full">
                            <strong>Selected:</strong> {selectedFile.name}
                        </p>
                    )}
                </Card>


                {/* Auto Evaluation Toggle */}
                <Card className="mb-6 p-4">
                    <div className="flex items-center gap-3">
                        <Switch checked={isAutoEvaluation} onCheckedChange={setIsAutoEvaluation}/>
                        <span className="text-md font-medium text-gray-600">Auto Evaluation</span>
                    </div>

                    {/* Separator for clear UI */}
                    <hr className="my-4 border-gray-300"/>
                    {isAutoEvaluation ? (
                        <div className="mt-4">
                            <label className="text-lg font-semibold mb-2">Max Auto Evaluation Marks</label>
                            <Input
                                type="number"
                                placeholder="Max Marks"
                                value={maxAutoMarks || ""}
                                onChange={(e) => {
                                    let numValue = e.target.value;

                                    // Prevent leading zeros and ensure valid numbers
                                    if (numValue === "") {
                                        setMaxAutoMarks(0); // Handle empty input gracefully
                                        return;
                                    }

                                    let num = Number(numValue);
                                    if (!isNaN(num) && num >= 0) {
                                        setMaxAutoMarks(num);
                                    }
                                }}
                                className="mt-2 w-1/2"
                            />

                        </div>
                    ) : (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold mb-3">Evaluation Criteria</h2>
                            {criteria.map((criterion, index) => (
                                <div key={index} className="flex items-start gap-2 mb-3">
                                    <Textarea
                                        placeholder="Criterion name"
                                        value={criterion.name}
                                        onChange={(e) => updateCriteria(index, "name", e.target.value)}
                                        className="w-2/3 resize-none min-h-[40px]"
                                        rows={1}
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
                                        className="w-1/4"
                                    />
                                    <Button
                                        onClick={() => removeCriteria(index)}
                                        className="bg-red-500 text-white px-3 py-2"
                                        disabled={criteria.length === 1}
                                    >
                                        <Trash className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}

                            <Button onClick={addCriteria} className="mt-2 bg-black text-white px-4 py-2">
                                + Add Criterion
                            </Button>

                            {/* Total Marks Display */}
                            <div className="mt-4 text-lg font-semibold">
                                Total Marks: {totalMarks}
                            </div>
                        </div>
                    )}
                </Card>

                {/* Upload Button */}
                <Button onClick={handleUpload} className="w-full bg-black text-white px-6 py-3">
                    Upload Assignment
                </Button>
            </main>
        </div>
    );
}
