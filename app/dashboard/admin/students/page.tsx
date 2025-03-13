"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageStudents() {
    const [students, setStudents] = useState([{ rollNo: "", phone: "" }]);

    const handleChange = (index: number, field: string, value: string) => {
        const newStudents = [...students];
        newStudents[index][field as keyof typeof newStudents[0]] = value;
        setStudents(newStudents);
    };

    const handleSendSMS = () => {
        console.log("Sending SMS to:", students);
        alert("SMS Sent to all students!");
    };

    return (
        <Card className="shadow-md border border-gray-300">
            <CardHeader>
                <CardTitle className="text-lg">Manage Students</CardTitle>
            </CardHeader>
            <CardContent>
                {students.map((student, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <Input
                            placeholder="Roll No"
                            value={student.rollNo}
                            onChange={(e) => handleChange(index, "rollNo", e.target.value)}
                        />
                        <Input
                            placeholder="Phone Number"
                            value={student.phone}
                            onChange={(e) => handleChange(index, "phone", e.target.value)}
                        />
                    </div>
                ))}
                <Button variant="outline" className="mt-2" onClick={() => setStudents([...students, { rollNo: "", phone: "" }])}>
                    Add More
                </Button>
                <Button className="mt-2 bg-black text-white hover:bg-gray-800" onClick={handleSendSMS}>
                    Send SMS to All
                </Button>
            </CardContent>
        </Card>
    );
}
