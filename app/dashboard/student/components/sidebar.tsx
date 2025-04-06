"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {usePathname} from "next/navigation";
import {FilePlus, ClipboardCheck, Home, LogOut, FileText} from "lucide-react";
import {useEffect} from "react";

const links = [
    {href: "/dashboard/student", label: "Dashboard", icon: Home},
    {href: "/dashboard/student/assignments", label: "Assignments", icon: FilePlus},
    {href: "/dashboard/student/result", label: "Result", icon: FilePlus},
];

export default function StudentSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    useEffect(() => {
        const studentData = localStorage.getItem("studentDetails");
        const userData = localStorage.getItem("user");

        if (!studentData || !userData) {
            router.push("/user/login");
            return;
        }
    }, []);

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
            <h1 className="text-xl font-bold mb-4">Student Panel</h1>
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
