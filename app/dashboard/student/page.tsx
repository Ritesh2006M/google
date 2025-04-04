"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StudentPerformanceChart from "./components/StudentPerformanceChart";

export default function StudentDashboard() {
    const [student, setStudent] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);

    useEffect(() => {
        const studentData = localStorage.getItem("studentDetails");
        const userData = localStorage.getItem("user");

        if (studentData) setStudent(JSON.parse(studentData));
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.studentSubjects) {
                setSubjects(parsedUser.studentSubjects);
            }
        }
    }, []);

    return (
        <div className="flex h-screen bg-white text-black overflow-hidden">
            {/* Sidebar */}
            <div className="bg-white w-64 shadow-md">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                {/* Welcome Card */}
                <Card className="mb-6 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Welcome, {student?.fullName || "Student"}
                        </CardTitle>
                    </CardHeader>
                </Card>

                {/* Profile Overview */}
                {(student || subjects.length > 0) && (
                    <Card className="shadow-md mb-6">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-semibold text-gray-800">
                                Profile Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-gray-700 font-medium flex flex-wrap gap-x-10">
                                {student && (
                                    <>
                                        <span>
                                            Roll Number - <span className="font-semibold">{student.rollNo}</span>
                                        </span>
                                        <span>
                                            Email - <span className="font-semibold">{student.student_email}</span>
                                        </span>
                                    </>
                                )}
                            </div>

                            {subjects.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-gray-700 font-medium">Subjects -</span>
                                    {subjects.map((subj, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-blue-100 text-blue-800"
                                        >
                                            {subj.subject_name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Performance Chart */}
                {student?.rollNo && (
                    <div className="w-full md:w-1/2">
                        <StudentPerformanceChart rollNo={student.rollNo} />
                    </div>
                )}
            </main>
        </div>
    );
}
