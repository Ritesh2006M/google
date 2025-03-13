"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft} from "lucide-react";

export default function RegistrationOTP() {
    const router = useRouter();
    const [form, setForm] = useState({regisNo: "", otp: ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const validateCredentials = (regisNo: string, otp: string): boolean => {
        // Dummy function: always returns true for any input
        return true;
    };

    const handleVerify = () => {
        if (validateCredentials(form.regisNo, form.otp)) {
            if (form.regisNo.startsWith("TS")) {
                router.push("/user/signup/teacher");
            } else if (form.regisNo.startsWith("ST")) {
                router.push("/user/signup/student");
            } else {
                alert("Invalid Registration Number format");
            }
        } else {
            alert("Invalid Registration Number or OTP");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-white">
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
                        Verify OTP
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="regisNo" className="text-black">
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
                                className="border-gray-400 focus:border-black focus:ring-black"
                            />
                        </div>
                        <div>
                            <Label htmlFor="otp" className="text-black">
                                OTP
                            </Label>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                placeholder="Enter OTP"
                                value={form.otp}
                                onChange={handleChange}
                                required
                                className="border-gray-400 focus:border-black focus:ring-black"
                            />
                        </div>
                        <Button className="w-full bg-black text-white hover:bg-gray-900" onClick={handleVerify}>
                            Verify & Proceed
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
