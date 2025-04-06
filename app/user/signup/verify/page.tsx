"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function Registration() {
    const router = useRouter()
    const [form, setForm] = useState({ regisNo: "", otp: "" })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleVerify = async () => {
        if (!form.regisNo) {
            alert("Registration Number is required")
            return
        }

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ regisNo: form.regisNo }),
            })

            const data = await res.json()

            if (data.success) {
                localStorage.setItem("rollNo", form.regisNo)
                localStorage.setItem("role", data.role)

                if (data.role === "teacher") {
                    router.push("/user/signup/teacher")
                } else if (data.role === "student") {
                    router.push("/user/signup/student")
                } else {
                    alert("Unknown role")
                }
            } else {
                alert(data.message || "Verification failed")
            }
        } catch (err) {
            console.error("Error verifying:", err)
            alert("Something went wrong")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-[#ECE5DB] py-10">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-6 left-6 flex items-center gap-2 text-[#6E6259] hover:text-black"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            <Card className="w-full max-w-md p-8 shadow-2xl rounded-2xl border border-[#D5CBBF] bg-[#F8F5F0] space-y-6">
                <CardHeader className="pb-0">
                    <CardTitle className="text-center text-3xl font-semibold text-[#4C443D]">
                        Verify Registration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="regisNo" className="text-[#4C443D] text-sm">
                            Registration Number
                        </Label>
                        <Input
                            id="regisNo"
                            name="regisNo"
                            type="text"
                            placeholder="Enter your Registration Number"
                            value={form.regisNo}
                            onChange={handleChange}
                            required
                            className="border-[#C4BBAF] focus:border-[#7A6F65] focus:ring-[#7A6F65] bg-white text-[#4C443D]"
                        />
                    </div>
                    <Button
                        className="w-full bg-[#F26257] text-white hover:bg-[#645B52] h-11 rounded-xl text-base"
                        onClick={handleVerify}
                    >
                        Verify & Proceed
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
