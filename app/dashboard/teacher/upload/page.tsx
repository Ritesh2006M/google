"use client";

import TeacherSidebar from "../sidebar";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function UploadAssignment() {
    const [assignmentQuestions, setAssignmentQuestions] = useState<string[]>([""]);
    const [criteria, setCriteria] = useState<{ name: string; marks: number }[]>([{ name: "", marks: 0 }]);
    const [totalMarks, setTotalMarks] = useState(0);
    const [isAutoEvaluation, setIsAutoEvaluation] = useState(false);
    const [maxAutoMarks, setMaxAutoMarks] = useState(100);
    const [teacher, setTeacher] = useState<{ fullName: string; subject: string; rollNo?: string } | null>(null);
    const [questionFile, setQuestionFile] = useState<File | null>(null);
    const questionFileInputRef = useRef<HTMLInputElement | null>(null);
    const [inputType, setInputType] = useState<'type' | 'upload'>('type');
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        // Fetch teacher details from localStorage
        const storedTeacher = localStorage.getItem("teacherDetails");
        if (storedTeacher) {
            setTeacher(JSON.parse(storedTeacher));
        }
    }, []);

    const handleQuestionFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setQuestionFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        // Validation
        if (inputType === 'type' && !assignmentQuestions.some(q => q.trim())) {
            setStatus("Please enter at least one question.");
            return;
        }

        if (inputType === 'upload' && !questionFile) {
            setStatus("Please upload a question file.");
            return;
        }

        if (!isAutoEvaluation) {
            for (const crit of criteria) {
                if (!crit.name || crit.marks <= 0) {
                    setStatus("Please fill in all criteria and ensure marks are positive.");
                    return;
                }
            }
        }

        // Set total marks based on evaluation type
        let finalTotalMarks = isAutoEvaluation ? maxAutoMarks : totalMarks;

        // Prepare evaluation criteria
        let formattedCriteria;
        if (isAutoEvaluation) {
            formattedCriteria = ["Auto evaluate based on question and answer"];
        } else {
            formattedCriteria = criteria.map((crit) => crit.name);
        }

        // Prepare marks
        let formattedMarks;
        if (isAutoEvaluation) {
            formattedMarks = [maxAutoMarks];
        } else {
            formattedMarks = criteria.map((crit) => crit.marks);
        }

        // Prepare FormData
        const formData = new FormData();
        if (inputType === 'upload' && questionFile) {
            formData.append("questionFile", questionFile);
        } else {
            formData.append("assignmentQuestions", JSON.stringify(assignmentQuestions));
        }
        formData.append("criteria", JSON.stringify(formattedCriteria));
        formData.append("marks", JSON.stringify(formattedMarks));

        setStatus("Uploading assignment...");

        try {
            const response = await fetch(
                "https://us-central1-mineral-subject-450718-j1.cloudfunctions.net/upload_assignment",
                {
                    method: "POST",
                    body: formData,
                }
            );
            console.log(response); // Will be an opaque response
            setStatus("Request sent, but cannot read response due to no-cors mode");

            const result = await response.json();
            if (response.ok) {
                setStatus(`Assignment uploaded successfully! Assignment ID: ${result.assignment_id}`);
                // Reset fields after successful upload
                setAssignmentQuestions([""]);
                setCriteria([{ name: "", marks: 0 }]);
                setTotalMarks(0);
                setIsAutoEvaluation(false);
                setMaxAutoMarks(100);
                setInputType('type');
                setQuestionFile(null);
                if (questionFileInputRef.current) {
                    questionFileInputRef.current.value = "";
                }
            } else {
                setStatus(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setStatus("An error occurred while uploading the assignment.");
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

    const addQuestion = () => {
        setAssignmentQuestions([...assignmentQuestions, ""]);
    };

    const updateQuestion = (index: number, value: string) => {
        const newQuestions = [...assignmentQuestions];
        newQuestions[index] = value;
        setAssignmentQuestions(newQuestions);
    };

    const removeQuestion = (index: number) => {
        if (assignmentQuestions.length === 1) return;
        const newQuestions = assignmentQuestions.filter((_, i) => i !== index);
        setAssignmentQuestions(newQuestions);
    };

    return (
        <div className="flex h-screen bg-white text-black overflow-hidden">
            <div className="bg-white w-64 shadow-md">
                <TeacherSidebar />
            </div>
            <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
                <Card className="mb-6 p-4">
                    <h1 className="text-3xl font-bold">Upload Assignment</h1>
                </Card>

                {/* Question Input Type Selection */}
                <Card className="mb-6 p-4">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Choose Question Input Method</h2>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setInputType('type')}
                                className={`px-4 py-2 ${
                                    inputType === 'type'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                Type Question
                            </Button>
                            <Button
                                onClick={() => setInputType('upload')}
                                className={`px-4 py-2 ${
                                    inputType === 'upload'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                Upload Question File
                            </Button>
                        </div>

                        {inputType === 'upload' ? (
                            <div className="mt-4">
                                <label className="text-lg font-semibold mb-2">
                                    Upload Question File (PDF)
                                </label>
                                <div className="flex items-center gap-4 mt-2">
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        ref={questionFileInputRef}
                                        onChange={handleQuestionFileChange}
                                        className="w-2/3"
                                    />
                                    {questionFile && (
                                        <Button
                                            onClick={() => {
                                                setQuestionFile(null);
                                                if (questionFileInputRef.current) {
                                                    questionFileInputRef.current.value = "";
                                                }
                                            }}
                                            className="bg-red-500 text-white px-4 py-2"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                                {questionFile && (
                                    <p className="mt-2 text-sm text-gray-600 truncate max-w-full">
                                        <strong>Selected:</strong> {questionFile.name}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="mt-4">
                                <label className="text-lg font-semibold mb-2">Assignment Questions</label>
                                {assignmentQuestions.map((question, index) => (
                                    <div key={index} className="flex items-start gap-2 mb-3">
                                        <Textarea
                                            value={question}
                                            onChange={(e) => updateQuestion(index, e.target.value)}
                                            placeholder={`Enter question ${index + 1}`}
                                            className="mt-2 resize-none min-h-[50px]"
                                            rows={1}
                                            onInput={(e) => {
                                                e.currentTarget.style.height = "auto";
                                                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                            }}
                                        />
                                        {assignmentQuestions.length > 1 && (
                                            <Button
                                                onClick={() => removeQuestion(index)}
                                                className="bg-red-500 text-white px-4 py-2 mt-2"
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    onClick={addQuestion}
                                    className="bg-blue-500 text-white px-4 py-2 mt-2"
                                >
                                    Add Question
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Auto Evaluation Toggle */}
                <Card className="mb-6 p-4">
                    <div className="flex items-center gap-3">
                        <Switch checked={isAutoEvaluation} onCheckedChange={setIsAutoEvaluation} />
                        <span className="text-md font-medium text-gray-600">Auto Evaluation</span>
                    </div>

                    <hr className="my-4 border-gray-300" />
                    {isAutoEvaluation ? (
                        <div className="mt-4">
                            <label className="text-lg font-semibold mb-2">Max Auto Evaluation Marks</label>
                            <Input
                                type="number"
                                placeholder="Max Marks"
                                value={maxAutoMarks || ""}
                                onChange={(e) => {
                                    let numValue = e.target.value;
                                    if (numValue === "") {
                                        setMaxAutoMarks(0);
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
                                        className="bg-red-500 text-white px-4 py-2"
                                    >
                                        <Trash size={16} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                onClick={addCriteria}
                                className="bg-blue-500 text-white px-4 py-2 mt-2"
                            >
                                Add Criterion
                            </Button>
                            <p className="mt-4 text-md font-medium text-gray-600">
                                Total Marks: {totalMarks}
                            </p>
                        </div>
                    )}
                </Card>

                {/* Upload Button */}
                <Card className="p-4">
                    <Button
                        onClick={handleUpload}
                        className="bg-green-500 text-white px-6 py-3"
                    >
                        Upload Assignment
                    </Button>
                </Card>

                {/* Status Message */}
                {status && (
                    <div className="mt-4 p-3 text-center rounded bg-gray-100">
                        {status}
                    </div>
                )}
            </main>
        </div>
    );
}