"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError(""); // Reset previous error

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();
            console.log("Login Response:", data); // Debugging

            if (!data.success) {
                setError(data.error || "Login failed.");
                return;
            }

            if (!data.email) {
                console.error("Error: Email is missing from the response");
                setError("Login failed: Email missing.");
                return;
            }

            // Save user details
            localStorage.setItem("user", JSON.stringify(data));

            // If teacher details exist, store them
            if (data.role === "teacher" && data.teacherData) {
                localStorage.setItem("teacherDetails", JSON.stringify(data.teacherData));
            } else if (data.role === "student" && data.studentData) {
                localStorage.setItem("studentDetails", JSON.stringify(data.studentData));
            }

            // Redirect based on role
            switch (data.role) {
                case "admin":
                    router.push("/dashboard/admin");
                    break;
                case "teacher":
                    router.push("/dashboard/teacher");
                    break;
                case "student":
                    router.push("/dashboard/student");
                    break;
                default:
                    setError("Invalid role.");
            }
        } catch (error) {
            console.error("Login request failed:", error);
            setError("Login request failed.");
        }
    };


    const handleGoogleLogin = () => {
        console.log("Sign in with Google");
        // Add Google OAuth logic here
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            {/* Back Button */}
            <button
                onClick={() => router.push('/')}
                className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-black"
            >
                <ArrowLeft size={20}/>
                <span>Back</span>
            </button>

            <Card className="w-full max-w-sm p-4 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button className="w-full" onClick={handleLogin}>
                            Sign In
                        </Button>

                        {/* Google Sign-In Button */}
                        <button
                            onClick={handleGoogleLogin}
                            className="gsi-material-button w-full flex items-center justify-center gap-2 p-2 border border-gray-300 bg-white text-gray-600 shadow-md hover:bg-gray-100 rounded-md"
                        >
                            <div className="gsi-material-button-icon">
                                <svg
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 48 48"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    className="h-5 w-5"
                                >
                                    <path
                                        fill="#EA4335"
                                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                    ></path>
                                    <path
                                        fill="#4285F4"
                                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                    ></path>
                                    <path
                                        fill="#FBBC05"
                                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                    ></path>
                                    <path
                                        fill="#34A853"
                                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                    ></path>
                                    <path fill="none" d="M0 0h48v48H0z"></path>
                                </svg>
                            </div>
                            <span className="gsi-material-button-contents text-gray-700 font-medium">
                Sign in with Google
              </span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
