import TeacherSidebar from "./sidebar";

export default function TeacherDashboard() {
    return (
        <div className="flex min-h-screen bg-white text-black">
            <TeacherSidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold">Welcome, Teacher</h1>
                <p className="text-gray-600">Manage assignments and evaluate submissions here.</p>
            </main>
        </div>
    );
}
