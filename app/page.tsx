import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ECE5DB]">
      {/* Header */}
      <header className="bg-[#ECE5DB] backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/paper.png"
              alt="Score Lab Logo"
              width={40}
              height={40}
              className="transition-transform hover:scale-110"
            />
            <Link
              href="/"
              className="font-extrabold text-2xl tracking-tight bg-black from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Score Lab
            </Link>
          </div>
          <nav className="flex gap-4">
            <Link href="/user/login">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300 rounded-full px-6"
              >
                Login
              </Button>
            </Link>
            <Link href="/user/signup/verify">
              <Button className="bg-black from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-full px-6 shadow-lg">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex items-end justify-center">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>

          <div className="mx-auto px-4 md:px-0 flex items-center">
            {/* Left Text Section */}
            <div className="w-full md:w-3/5 space-y-10 bg-[#ECE5DB] rounded-tr-3xl rounded-br-3xl md:pl-24 pt-[125px] pb-40">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-black from-blue-600 via-purple-600 to-red-500 bg-clip-text text-transparent animate-fade-in">
                Revolutionizing
                <br />
                Feedback for
                <br />
                Educators
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed animate-fade-in animation-delay-200">
                Empowering teachers with smart, efficient feedback tools that
                save time and enhance student support through personalized
                insights.
              </p>
              <div className="flex gap-4 animate-fade-in animation-delay-400">
                <Link href="/how-it-works">
                  <Button className="px-8 py-3 bg-[#F26257] text-white rounded-full flex items-center group hover:shadow-xl transition-all duration-300">
                    See How It Works
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    variant="outline"
                    className="px-8 py-3 border-[#F26257] text-[#F26257] hover:bg-blue-50 rounded-full transition-all duration-300"
                  >
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative w-full md:w-1/2 rounded-tl-3xl rounded-bl-3xl bg-[#ECE5DB] md:pl-24 h-[600px]">
              <Image
                src="/sideimg2.webp"
                alt="Educators Illustration"
                height={700}
                width={400}
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* Problem & Objective Section */}
        <section className="flex flex-col justify-start pt-[10vh] pb-[5vh] bg-[#ECE5DB]">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Challenge & Solution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Problem Statement */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800">Problem Statement</h3>
                <p className="text-base text-gray-700 leading-relaxed">
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
                <h3 className="text-2xl font-semibold text-gray-800">Our Objective</h3>
                <p className="text-base text-gray-700 leading-relaxed">
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
            <div className="mt-16">
              <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">How We Solve It</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-40 bg-black rounded-xl" />
                <div className="h-40 bg-white border border-black rounded-xl" />
                <div className="h-40 bg-black rounded-xl" />
                <div className="h-40 bg-white border border-black rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
