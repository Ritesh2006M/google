"use client"
import { useEffect, useState } from "react"
import TeacherSidebar from "./sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TeacherDashboard() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<{
    fullName: string
    subject: string
    rollNo?: string
  } | null>(null)

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacherDetails")
    if (!storedTeacher) {
      router.push("/user/login")
      return
    }
    setTeacher(JSON.parse(storedTeacher))
  }, [])

  return (
    <div className="flex h-screen bg-[#FFFFFF] dark:bg-[#000000] transition-colors duration-300 ease-in-out relative">
      {/* Background Texture */}
      <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="none" stroke="%23808080" stroke-width="1" d="M50 150 Q100 50 150 150" opacity="0.5"/></svg>')`,
          }}
        />
      </div>

      {/* Sidebar - fixed inside the component */}
      <TeacherSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 space-y-10 overflow-y-auto">
        {teacher && (
          <Card className="p-8 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
            <h1 className="text-4xl font-bold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
              Welcome, {teacher.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
              Subject: {teacher.subject}
            </p>
            {teacher.rollNo && (
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg">
                Roll No: {teacher.rollNo}
              </p>
            )}
          </Card>
        )}

        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#000000] dark:text-[#FFFFFF] mb-8 text-center">
            Your Teaching Tools
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {/* Upload Assignment */}
            <Card className="w-full md:w-96 p-8 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#000000] dark:bg-[#FFFFFF] rounded-full flex items-center justify-center text-white dark:text-black text-2xl font-bold">
                  📤
                </div>
                <h3 className="text-2xl font-semibold text-[#000000] dark:text-[#FFFFFF]">
                  Upload Assignment
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base">
                  Create and upload new assignments for your students to tackle.
                </p>
                <Button
                  onClick={() => router.push("/dashboard/teacher/upload")}
                  className="w-full bg-[#000000] text-white hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-black dark:hover:bg-gray-200 rounded-full py-3 font-medium transition-all duration-300"
                >
                  Start Uploading
                </Button>
              </div>
            </Card>

            {/* View Assignments */}
            <Card className="w-full md:w-96 p-8 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#000000] dark:bg-[#FFFFFF] rounded-full flex items-center justify-center text-white dark:text-black text-2xl font-bold">
                  📑
                </div>
                <h3 className="text-2xl font-semibold text-[#000000] dark:text-[#FFFFFF]">
                  View Assignments
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base">
                  Review and manage all the assignments you've uploaded.
                </p>
                <Button
                  onClick={() => router.push("/dashboard/teacher/assign")}
                  className="w-full bg-[#000000] text-white hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-black dark:hover:bg-gray-200 rounded-full py-3 font-medium transition-all duration-300"
                >
                  View Now
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
