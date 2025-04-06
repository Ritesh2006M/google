"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StudentPerformanceChart from "./components/StudentPerformanceChart";
import StudentTasksChart from "./components/StudentTasksChart";

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const studentData = localStorage.getItem("studentDetails");
    const userData = localStorage.getItem("user");

    if (!studentData || !userData) {
      router.push("/user/login");
      return;
    }

    setStudent(JSON.parse(studentData));
    const parsedUser = JSON.parse(userData);
    if (parsedUser.studentSubjects) {
      setSubjects(parsedUser.studentSubjects);
    }
  }, [router]);

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
          {/* Welcome Card */}
          <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl font-bold text-[#000000] dark:text-[#FFFFFF] tracking-tight text-center">
                Welcome, {student?.fullName || "Student"}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Profile Overview */}
          {(student || subjects.length > 0) && (
            <Card className="bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-[#000000] dark:text-[#FFFFFF] text-center">
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                    <div>
                      <span className="font-medium">Roll Number:</span>{" "}
                      <span className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{student.rollNo}</span>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      <span className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{student.student_email}</span>
                    </div>
                  </div>
                )}
                {subjects.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-medium text-gray-600 dark:text-gray-300 block text-center">
                      Subjects:
                    </span>
                    <div className="flex flex-wrap justify-center gap-2">
                      {subjects.map((subj, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gray-200 text-[#000000] dark:bg-gray-700 dark:text-[#FFFFFF] px-3 py-1 rounded-full"
                        >
                          {subj.subject_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Performance and Tasks Charts */}
          {student?.rollNo && student?.student_email && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Overview */}
              <Card className="bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-[#000000] dark:text-[#FFFFFF] text-center">
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <StudentPerformanceChart rollNo={student.rollNo} />
              </Card>

              {/* Tasks Overview */}
              <Card className="bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-[#000000] dark:text-[#FFFFFF] text-center">
                    Tasks Overview
                  </CardTitle>
                </CardHeader>
                <StudentTasksChart email={student.student_email} />
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}