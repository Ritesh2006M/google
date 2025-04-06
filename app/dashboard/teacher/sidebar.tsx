"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {usePathname} from "next/navigation";
import {FilePlus, ClipboardCheck, Home, LogOut, FileText} from "lucide-react";

const links = [
    {href: "/dashboard/teacher", label: "Dashboard", icon: Home},
    {href: "/dashboard/teacher/upload", label: "Upload", icon: FilePlus},
    {href: "/dashboard/teacher/assign", label: "Assignments", icon: FileText},
];

export default function TeacherSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Destroy session (clearing all storage and calling an API logout endpoint)
            // await fetch("/api/logout", {method: "POST"});
            localStorage.clear(); // Clear all local storage
            sessionStorage.clear(); // Clear all session storage
            router.push("/user/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="p-6">
            <h1 className="text-xl font-bold mb-4">Teacher Panel</h1>
            <ul className="space-y-2">
                {links.map(({href, label, icon: Icon}) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className={`flex items-center gap-2 p-2 rounded ${
                                pathname === href ? "bg-black text-white" : "text-black hover:bg-gray-200"
                            }`}
                        >
                            <Icon size={20}/>
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="mt-auto pt-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-2 rounded text-white bg-red-600 hover:bg-red-700 w-full text-xs"
                >
                    <LogOut size={14}/>
                    Logout
                </button>
            </div>
        </nav>
    );
}
