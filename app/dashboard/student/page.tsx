import Sidebar from "./sidebar"

export default function StudentDashboard() {
    return (
        <div className="flex min-h-screen bg-white text-black">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold">Welcome, Student</h1>
                <p className="text-gray-600">Manage your assignments here.</p>
            </main>
        </div>
    );
}
    