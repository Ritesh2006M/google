"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft} from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSignup = () => {
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Signing up as", form);
        router.push("/studentform");
    };

    const handleGoogleSignup = () => {
        console.log("Signing up with Google as");
        // Add Google OAuth logic here
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-white">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 flex items-center gap-2 text-gray-700 hover:text-black"
            >
                <ArrowLeft size={20}/>
                <span>Back</span>
            </button>

            <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white border border-gray-300">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-black">
                        Sign Up
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Signup Form */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-black">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="border-gray-400 focus:border-black focus:ring-black"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-black">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="border-gray-400 focus:border-black focus:ring-black"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-black">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="border-gray-400 focus:border-black focus:ring-black"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword" className="text-black">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                className="border-gray-400 focus:border-black focus:ring-black"
                            />
                        </div>


                        <Button className="w-full bg-black text-white hover:bg-gray-900" onClick={handleSignup}>
                            Sign Up
                        </Button>

                        {/* Google Sign-Up Button */}
                        <button
                            onClick={handleGoogleSignup}
                            className="w-full flex items-center justify-center gap-2 p-2 border border-gray-400 bg-white text-gray-700 shadow-sm hover:bg-gray-100 rounded-md"
                        >
                            <div>
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
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">Sign up with Google</span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
