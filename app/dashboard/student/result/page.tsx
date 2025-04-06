"use client";

import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Result {
  assignment_id: number;
  task_id: number;
  total_marks: number;
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
        setResults(data.results || data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [userData]);

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
                Your Results
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Results List */}
          {loading ? (
            <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md text-center">
              <p className="text-gray-600 dark:text-gray-300">Loading results...</p>
            </Card>
          ) : results.length === 0 ? (
            <Card className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md text-center">
              <p className="text-gray-600 dark:text-gray-300">No results available.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((res) => (
                <Card
                  key={res.assignment_id}
                  className="p-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <CardContent className="p-0 space-y-3">
                    <h2 className="text-xl font-semibold text-[#000000] dark:text-[#FFFFFF]">
                      {res.subject_name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">{res.question}</p>
                    <p className="text-[#000000] dark:text-[#FFFFFF]">
                      <strong>Marks Scored:</strong> {res.result} / {res.total_marks}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        ({((res.result / res.total_marks) * 100).toFixed(2)}%)
                      </span>
                    </p>
                  </CardContent>
                  <Button
                    onClick={() => setSelectedResponse(res.response)}
                    className="mt-4 w-full bg-[#000000] text-white hover:bg-gray-800 dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-gray-200 rounded-full"
                  >
                    View Result
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {/* Dialog for showing student response */}
          <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
            <DialogContent className="bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 max-w-2xl w-full rounded-3xl p-6">
              <DialogHeader>
                <div className="flex items-center justify-center gap-2">
                  <DialogTitle className="text-xl font-semibold text-[#000000] dark:text-[#FFFFFF]">
                    Evaluation Result
                  </DialogTitle>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Powered by</span>
                  <Image
                    src="/geminiLogo.png"
                    alt="Gemini Logo"
                    width={80}
                    height={20}
                    className="pb-3 object-contain dark:filter dark:invert"
                  />
                </div>
              </DialogHeader>
              <div className="max-h-[80vh] overflow-y-auto p-4 border border-gray-300/50 dark:border-gray-700/50 rounded-xl bg-white dark:bg-[#1A1A1A] shadow-md">
                <p className="whitespace-pre-wrap text-[#000000] dark:text-[#FFFFFF]">{selectedResponse}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}