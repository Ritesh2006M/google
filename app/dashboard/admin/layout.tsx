import Sidebar from "./Sidebar"; // ✅ Import the Sidebar component

export default function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100 text-black">
            <aside className="w-64 bg-white shadow-md border-r border-gray-300">
                <Sidebar/>
            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
