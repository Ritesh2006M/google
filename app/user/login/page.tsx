"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ArrowLeft} from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async () => {
        setError("")

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            })

            const data = await res.json()
            if (!data.success) {
                setError(data.error || "Login failed.")
                return
            }

            if (!data.email) {
                setError("Login failed: Email missing.")
                return
            }

            localStorage.setItem("user", JSON.stringify(data))

            if (data.role === "teacher" && data.teacherData) {
                localStorage.setItem("teacherDetails", JSON.stringify(data.teacherData))
            } else if (data.role === "student" && data.studentData) {
                localStorage.setItem("studentDetails", JSON.stringify(data.studentData))
            }

            switch (data.role) {
                case "admin":
                    router.push("/dashboard/admin")
                    break
                case "teacher":
                    router.push("/dashboard/teacher")
                    break
                case "student":
                    router.push("/dashboard/student")
                    break
                default:
                    setError("Invalid role.")
            }
        } catch (error) {
            console.error("Login request failed:", error)
            setError("Login request failed.")
        }
    }

    const handleGoogleLogin = () => {
        alert("Demo Website (Firebase not setup)")
        console.log("Sign in with Google")
    }

    return (
        <div
            className="flex min-h-screen items-center justify-center px-4"
            style={{backgroundColor: "#F5F2EC"}}
        >
            <button
                onClick={() => router.push("/")}
                className="absolute top-4 left-4 flex items-center gap-2 text-[#7C6F64] hover:text-[#4A3F35]"
            >
                <ArrowLeft size={20}/>
                <span>Back</span>
            </button>
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
                <div className="flex justify-between gap-4 text-sm text-[#4A3F35]">

                    <div className="flex-1 bg-[#F5F2EC] border border-[#D6CCC2] p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold mb-2 text-center">Teacher Account (Demo)</h3>
                        <p>Email: <span className="font-mono">teacher@gmail.com</span></p>
                        <p>Password: <span className="font-mono">1234</span></p>
                    </div>

                    <div className="flex-1 bg-[#F5F2EC] border border-[#D6CCC2] p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold mb-2 text-center">Student Account (Demo)</h3>
                        <p>Email: <span className="font-mono">student@gmail.com</span></p>
                        <p>Password: <span className="font-mono">1234</span></p>
                    </div>
                </div>
            </div>


            <Card
                className="w-full max-w-sm p-4 shadow-xl"
                style={{backgroundColor: "#ECE5DB", borderColor: "#D6CCC2", borderWidth: 1}}
            >
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold text-[#4A3F35]">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-[#4A3F35]">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-[#F5F2EC] border-[#D6CCC2] text-[#4A3F35] placeholder:text-[#A49382]"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-[#4A3F35]">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-[#F5F2EC] border-[#D6CCC2] text-[#4A3F35] placeholder:text-[#A49382]"
                            />
                        </div>

                        <Button
                            className="w-full"
                            style={{
                                backgroundColor: "#F26257",
                                color: "#F5F2EC",
                            }}
                            onClick={handleLogin}
                        >
                            Log In
                        </Button>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-2 p-2 border border-[#D6CCC2] bg-[#F5F2EC] text-[#4A3F35] shadow-md hover:bg-[#E3D5CA] rounded-md"
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
                            <span className="text-[#4A3F35] font-medium">Sign in with Google</span>
                        </button>

                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
