"use client";

import TeacherSidebar from "../sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UploadAssignment() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return alert("No file selected!");

        // Implement Firebase or Google Cloud upload logic here
        alert(`Uploading ${selectedFile.name}...`);
    };

    return (
        <div className="flex min-h-screen bg-white text-black">
            <TeacherSidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Upload Assignments</h1>
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
                <Button onClick={handleUpload}>Upload</Button>
            </main>
        </div>
    );
}
