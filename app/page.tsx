import Link from "next/link"
import Image from "next/image"
import {Button} from "@/components/ui/button"
import {ArrowRight} from "lucide-react"

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-black">
            {/* Header */}
            <header className="border-b border-black">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Image src="/paper.png" alt="Score Lab Logo" width={40} height={40}/>
                        <Link href="/" className="font-bold text-2xl">
                            Score Lab
                        </Link>
                    </div>
                    <nav className="flex gap-4">
                        <Link href="/user/login">
                            <Button variant="outline" className="border-black text-black">
                                Login
                            </Button>
                        </Link>
                        <Link href="/user/signup/verify">
                            <Button className="bg-black text-white border-black">
                                Sign Up
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {/* Hero Section */}
                <section
                    className="relative h-screen flex flex-col justify-start pt-[30vh] bg-cover bg-center bg-no-repeat"
                    style={{backgroundImage: "url('/backHome.jpg')"}}>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-white opacity-70"></div>

                    <div className="relative container mx-auto px-4 md:px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                            Empowering Educators Through Innovation
                        </h1>
                        <p className="max-w-2xl text-lg mx-auto mt-4">
                            Your AI-powered assistant for grading and personalized feedback. Experience smarter teaching
                            with Score Lab.
                        </p>
                        <div className="mt-6">
                            <Link href="/user/login">
                                <Button
                                    className="px-8 py-3 bg-black text-white border-black flex items-center mx-auto">
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5"/>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>


                {/* Problem & Objective Section */}
                <section className="h-screen flex flex-col justify-start pt-[10vh] bg-gray-25">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-3xl font-bold text-center mb-8">Our Challenge & Solution</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Problem Statement */}
                            <div className="flex flex-col space-y-4">
                                <h3 className="text-2xl font-semibold">Problem Statement</h3>
                                <p className="text-base">
                                    Teachers in schools, coaching centres, and colleges often face a heavy workload when
                                    providing individualized feedback to students in large classrooms. Manual grading
                                    and feedback processes are time-consuming, leaving educators with limited time to
                                    focus on teaching and mentoring. This challenge is particularly acute in
                                    under-resourced settings, where teacher-to-student ratios are high. As a result,
                                    students miss out on personalized guidance, which is critical for their academic
                                    growth and success.
                                </p>
                            </div>
                            {/* Objective */}
                            <div className="flex flex-col space-y-4">
                                <h3 className="text-2xl font-semibold">Our Objective</h3>
                                <p className="text-base">
                                    Participants are tasked with creating an AI-powered teacher assistant that automates
                                    the grading of assignments and provides personalized feedback to students. The
                                    solution should enhance the teaching process by reducing the burden on educators,
                                    improving the quality of feedback, and enabling personalized learning experiences.
                                    Our solution aligns with UN SDG 4: Quality Education, ensuring inclusive and
                                    equitable quality education and promoting lifelong learning opportunities for all.
                                </p>
                            </div>
                        </div>

                        {/* Multi-Collage Layout */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-semibold text-center mb-4">How We Solve It</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="h-40 bg-black"/>
                                <div className="h-40 bg-white border border-black"/>
                                <div className="h-40 bg-black"/>
                                <div className="h-40 bg-white border border-black"/>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
