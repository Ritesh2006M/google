import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
        <section className="bg-[#ECE5DB]  py-24 relative overflow-hidden">
          {/* Subtle Background Texture */}

          <div className="container mx-auto px-4 md:px-8">
            {/* Heading */}
            <h2 className="text-4xl font-bold text-center text-[#2A2A2A] mb-16 tracking-tight">
              Our Challenge & Solution
            </h2>

            {/* Problem & Objective Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 max-w-5xl mx-auto">
              <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-[#2A2A2A] mb-4">
                  Problem Statement
                </h3>
                <p className="text-[#5A5A5A] leading-relaxed text-base">
                  Teachers in schools, coaching centres, and colleges often face
                  a heavy workload when providing individualized feedback to
                  students in large classrooms. Manual grading and feedback
                  processes are time-consuming, leaving educators with limited
                  time to focus on teaching and mentoring. This challenge is
                  especially severe in under-resourced areas where
                  teacher-student ratios are high.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-[#2A2A2A] mb-4">
                  Our Objective
                </h3>
                <p className="text-[#5A5A5A] leading-relaxed text-base">
                  We aim to build an AI-powered teacher assistant that automates
                  grading and provides personalized feedback. This tool helps
                  educators save time, enhances the feedback quality, and
                  enables scalable personalized learning — supporting UN SDG 4:
                  Quality Education.
                </p>
              </div>
            </div>

            {/* How We Solve It Section */}
            <div className="relative max-w-3xl mx-auto">
              <h3 className="text-3xl font-semibold text-[#2A2A2A] mb-12 text-center">
                How We Solve It
              </h3>

              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start mb-16 relative">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#2A2A2A] mb-2">
                    Image-based Assignment Input
                  </h4>
                  <p className="text-[#5A5A5A] leading-relaxed">
                    Students upload their handwritten or typed assignments as
                    image or PDF files. OCR and CV modules convert them into
                    machine-readable formats for further processing.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse items-start mb-16 relative">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-lg ml-0 md:ml-6 mt-4 md:mt-0">
                  2
                </div>
                <div className="flex-1 text-right md:text-left">
                  <h4 className="text-xl font-bold text-[#2A2A2A] mb-2">
                    Automated Evaluation
                  </h4>
                  <p className="text-[#5A5A5A] leading-relaxed">
                    Using trained AI models, the system automatically evaluates
                    answers — supporting both objective and subjective grading —
                    based on rubrics or model answers.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-start mb-16 relative">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#2A2A2A] mb-2">
                    Personalized Feedback
                  </h4>
                  <p className="text-[#5A5A5A] leading-relaxed">
                    Each student receives targeted feedback on their strengths
                    and areas for improvement. Tips and additional learning
                    resources are included to guide students forward.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row-reverse items-start mb-16 relative">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-lg ml-0 md:ml-6 mt-4 md:mt-0">
                  4
                </div>
                <div className="flex-1 text-right md:text-left">
                  <h4 className="text-xl font-bold text-[#2A2A2A] mb-2">
                    Teacher Dashboard
                  </h4>
                  <p className="text-[#5A5A5A] leading-relaxed">
                    Teachers use a dashboard to review AI-generated results,
                    make corrections if needed, and communicate with students.
                    It’s a central hub for managing learning.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col md:flex-row items-start mb-16 relative">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#2A2A2A] mb-2">
                    Progress Analytics
                  </h4>
                  <p className="text-[#5A5A5A] leading-relaxed">
                    The system tracks student progress over time and provides
                    detailed insights to both students and teachers. It helps
                    identify patterns and improve learning outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#ECE5DB]  border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-700 text-sm">
            © {new Date().getFullYear()} Score Lab. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/privacy-policy" className="text-gray-700 hover:text-gray-900 text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-700 hover:text-gray-900 text-sm">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
