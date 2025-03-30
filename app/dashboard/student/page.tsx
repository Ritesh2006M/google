import Sidebar from "./sidebar"
import {Card} from "@/components/ui/card";

export default function StudentDashboard() {
    return (
        <div className="flex h-screen bg-white text-black overflow-hidden">

            <div className="bg-white w-64 shadow-md">
                <Sidebar/>
            </div>
            <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
                <Card className="mb-6 p-4">
                    <h1 className="text-2xl font-bold">Welcome, Student</h1>
                    <p className="text-gray-600">Manage your assignments here.</p>
                </Card>
            </main>
        </div>
    );
}
    