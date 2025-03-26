"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus, ClipboardCheck, Home } from "lucide-react";

const links = [
    { href: "/dashboard/teacher", label: "Dashboard", icon: Home },
    { href: "/dashboard/teacher/upload", label: "Upload Assignments", icon: FilePlus },
    { href: "/dashboard/teacher/evaluate", label: "Evaluate Submissions", icon: ClipboardCheck },
];

export default function TeacherSidebar() {
    const pathname = usePathname();

    return (
        <nav className="p-6">
            <h1 className="text-xl font-bold mb-4">Teacher Panel</h1>
            <ul className="space-y-2">
                {links.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className={`flex items-center gap-2 p-2 rounded ${
                                pathname === href ? "bg-black text-white" : "text-black hover:bg-gray-200"
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
