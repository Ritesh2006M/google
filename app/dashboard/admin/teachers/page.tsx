"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageTeachers() {
    const [teachers, setTeachers] = useState([{ phone: "", subjects: [""] }]);

    const handleChange = (index: number, field: string, value: string) => {
        const newTeachers = [...teachers];
        if (field === "subjects") {
            newTeachers[index].subjects = value.split(","); // Comma-separated subjects
        } else {
            newTeachers[index][field as keyof typeof newTeachers[0]] = value;
        }
        setTeachers(newTeachers);
    };

    const handleAddSubject = (index: number) => {
        const newTeachers = [...teachers];
        newTeachers[index].subjects.push("");
        setTeachers(newTeachers);
    };

    const handleSendSMS = () => {
        console.log("Sending SMS to:", teachers);
        alert("SMS Sent to all teachers!");
    };

    return (
        <Card className="shadow-md border border-gray-300">
            <CardHeader>
                <CardTitle className="text-lg">Manage Teachers</CardTitle>
            </CardHeader>
            <CardContent>
                {teachers.map((teacher, index) => (
                    <div key={index} className="mb-4">
                        <Input
                            className="mb-2"
                            placeholder="Phone Number"
                            value={teacher.phone}
                            onChange={(e) => handleChange(index, "phone", e.target.value)}
                        />
                        {teacher.subjects.map((subject, subIndex) => (
                            <Input
                                key={subIndex}
                                className="mb-1"
                                placeholder={`Subject ${subIndex + 1}`}
                                value={subject}
                                onChange={(e) => {
                                    const newTeachers = [...teachers];
                                    newTeachers[index].subjects[subIndex] = e.target.value;
                                    setTeachers(newTeachers);
                                }}
                            />
                        ))}
                        <Button variant="outline" onClick={() => handleAddSubject(index)}>
                            + Add Subject
                        </Button>
                    </div>
                ))}
                <Button variant="outline" className="mt-2" onClick={() => setTeachers([...teachers, { phone: "", subjects: [""] }])}>
                    Add More
                </Button>
                <Button className="mt-2 bg-black text-white hover:bg-gray-800" onClick={handleSendSMS}>
                    Send SMS to All
                </Button>
            </CardContent>
        </Card>
    );
}
