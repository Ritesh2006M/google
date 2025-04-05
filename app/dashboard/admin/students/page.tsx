"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageStudents() {
    const [students, setStudents] = useState([{ rollNo: "" }]);

    const handleChange = (index: number, value: string) => {
        const newStudents = [...students];
        newStudents[index].rollNo = value;
        setStudents(newStudents);
    };

    const handleAddMore = () => {
        setStudents([...students, { rollNo: "" }]);
    };

    const handleSubmit = async () => {
        const nonEmptyStudents = students.filter(s => s.rollNo.trim() !== "");

        if (nonEmptyStudents.length === 0) {
            alert("Please enter at least one roll number.");
            return;
        }

        try {
            const res = await fetch("/api/admin/addStudents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ students: nonEmptyStudents })
            });

            const data = await res.json();

            if (data.success) {
                setStudents([{ rollNo: "" }]);
                alert("Students added successfully!");
            } else {
                alert(data.message || "Failed to add students.");
            }
        } catch (error) {
            console.error("Error adding students:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <Card className="shadow-md border border-gray-300">
            <CardHeader>
                <CardTitle className="text-lg">Add Students</CardTitle>
            </CardHeader>
            <CardContent>
                {students.map((student, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <Input
                            placeholder="Roll No"
                            value={student.rollNo}
                            onChange={(e) => handleChange(index, e.target.value)}
                        />
                    </div>
                ))}
                <Button variant="outline" className="mt-2 mr-2" onClick={handleAddMore}>
                    Add More
                </Button>
                <Button className="mt-2 bg-black text-white hover:bg-gray-800" onClick={handleSubmit}>
                    Add Students
                </Button>
            </CardContent>
        </Card>
    );
}
