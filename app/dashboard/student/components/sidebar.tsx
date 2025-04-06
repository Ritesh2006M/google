"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FilePlus, FileText, Home, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { href: "/dashboard/student", label: "Dashboard", icon: Home },
  { href: "/dashboard/student/assignments", label: "Assignments", icon: FilePlus },
  { href: "/dashboard/student/result", label: "Result", icon: FileText },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }

    const studentData = localStorage.getItem("studentDetails");
    const userData = localStorage.getItem("user");
    if (!studentData || !userData) {
      router.push("/user/login");
    }
  }, [router]);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/user/login");
  };

  return (
    <aside className="fixed top-0 left-0 z-50 w-72 h-screen flex flex-col justify-between bg-white/80 dark:bg-[#000000] backdrop-blur-md border-r border-gray-300/50 dark:border-gray-800/50 shadow-lg p-6">
      {/* Top Section */}
      <div>
        <h1 className="text-2xl font-bold text-[#000000] dark:text-[#FFFFFF] mb-8 text-center">
          🎓 Student Panel
        </h1>
        <ul className="space-y-3">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-medium ${
                  pathname === href
                    ? "bg-[#000000] text-white dark:bg-[#FFFFFF] dark:text-[#000000] shadow"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section: Toggle + Logout */}
      <div className="space-y-3 pt-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm w-full font-medium text-[#000000] dark:text-[#FFFFFF] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 w-full rounded-xl transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}