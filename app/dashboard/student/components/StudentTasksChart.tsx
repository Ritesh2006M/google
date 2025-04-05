"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

interface Props {
    email: string;
}

export default function StudentTasksChart({email}: Props) {
    const router = useRouter();
    const [pending, setPending] = useState<number | null>(null);
    const [total, setTotal] = useState<number | null>(null);
    const [completed, setCompleted] = useState<number | null>(null);

    useEffect(() => {
        if (!email) return;

        fetch(`/api/student/metrics/getTasks?email=${email}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setPending(data.pendingAssignments);
                    setTotal(data.totalAssignments);
                    setCompleted(data.completedAssignments);
                }
            })
            .catch((err) => console.error("Failed to fetch student tasks", err));
    }, [email]);

    if (pending === null || total === null || completed === null) return null;

    return (
        <Card className="shadow-md mb-6 rounded-lg bg-white h-[310px]">
            <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold text-black">Assignment Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    {/* Total Tasks */}
                    <div className="p-6 bg-white rounded-lg shadow border border-gray-300">
                        <p className="text-lg font-medium text-gray-600">Total</p>
                        <p className="text-3xl font-bold text-black">{total}</p>
                    </div>

                    {/* Pending Tasks */}
                    <div className="p-6 bg-white  rounded-lg shadow border border-gray-300">
                        <p className="text-lg font-medium text-yellow-600">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{pending}</p>
                    </div>

                    {/* Completed Tasks */}
                    <div className="p-6 bg-white rounded-lg shadow border border-gray-300">
                        <p className="text-lg font-medium text-green-600">Completed</p>
                        <p className="text-3xl font-bold text-green-600">{completed}</p>
                    </div>
                </div>

                {/* Button */}
                <div className="mt-8 flex justify-center">
                    <Button
                        variant="default"
                        className="bg-white text-black border  hover:bg-black hover:text-white transition-all"
                        onClick={() => router.push("/dashboard/student/assignments")}
                    >
                        Go to Assignments
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
