"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/dashboard/admin", label: "Dashboard" },
    { href: "/dashboard/admin/students", label: "Manage Students" },
    { href: "/dashboard/admin/teachers", label: "Manage Teachers" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="p-4">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            <ul className="space-y-2">
                {links.map(({ href, label }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className={`block p-2 rounded ${
                                pathname === href ? "bg-black text-white" : "text-black hover:bg-gray-200"
                            }`}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
