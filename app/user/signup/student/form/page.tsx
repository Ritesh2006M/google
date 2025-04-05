"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function StudentExtraForm() {
    const [form, setForm] = useState({ address: "", phone: "", subjects: [] as string[] });
    const [subjectList, setSubjectList] = useState<string[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch("/api/auth/subjects");
                const data = await res.json();
                setSubjectList(data.subjects || []);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    const handleCheckboxChange = (subject: string) => {
        setForm((prev) => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter((s) => s !== subject)
                : [...prev.subjects, subject],
        }));
    };

    const handleSubmit = async () => {
        const signupDetails = JSON.parse(localStorage.getItem("signupDetails") || "{}");

        const payload = {
            ...signupDetails,
            ...form,
        };

        console.log("Payload to submit:", payload); // Dump function here
        alert("Form ready for submission! Implement backend logic.");
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-white">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white border border-gray-300">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-black">
                        Additional Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-black">Address</Label>
                            <Input
                                placeholder="Enter your address"
                                value={form.address}
                                onChange={(e) => setForm({...form, address: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label className="text-black">Phone</Label>
                            <Input
                                type="tel"
                                placeholder="Enter phone number"
                                value={form.phone}
                                onChange={(e) => setForm({...form, phone: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label className="text-black mb-2 block">Subjects</Label>
                            <div className="flex flex-wrap gap-2">
                                {subjectList.map((subj) => {
                                    const isSelected = form.subjects.includes(subj);
                                    return (
                                        <button
                                            key={subj}
                                            type="button"
                                            onClick={() => handleCheckboxChange(subj)}
                                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                                isSelected
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                                            }`}
                                        >
                                            {subj}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                        <Button className="w-full bg-black text-white hover:bg-gray-900" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
