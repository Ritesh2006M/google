"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Upload, FileText } from "lucide-react";

const links = [
    { href: "/dashboard/student", label: "Dashboard", icon: Home },
    { href: "/dashboard/student/upload", label: "Upload Assignment", icon: Upload },
    { href: "/dashboard/student/scores", label: "Assignment Scores", icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="h-screen w-64 bg-black text-white p-5">
            <h1 className="text-xl font-bold mb-6">Student Panel</h1>
            <ul className="space-y-2">
                {links.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className={`flex items-center gap-2 p-2 rounded ${
                                pathname === href ? "bg-white text-black font-semibold" : "hover:bg-gray-800"
                            }`}
                        >
                            <Icon size={20} />
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
