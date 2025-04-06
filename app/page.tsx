import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ECE5DB]">
      {/* Header */}
      <header className="bg-[#ECE5DB] backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-4">
            <Image
              src="/paper.png"
              alt="Score Lab Logo"
              width={48}
              height={48}
              className="transition-transform hover:scale-110"
            />
            <Link
              href="/"
              className="font-extrabold text-3xl tracking-tight bg-black from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Score Lab
            </Link>
          </div>
          <nav className="flex gap-6">
            <Link href="/user/login">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300 rounded-full px-8 py-3 text-lg"
              >
                Login
              </Button>
            </Link>
            <Link href="/user/signup/verify">
              <Button className="bg-black from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-full px-8 py-3 text-lg shadow-lg">
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
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>

          <div className="mx-auto px-6 md:px-0 flex flex-col md:flex-row items-center max-w-7xl">
            {/* Left Text Section */}
            <div className="w-full md:w-3/5 space-y-12 bg-[#ECE5DB] rounded-tr-3xl rounded-br-3xl md:pl-10 pt-[90px] pb-48">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-black from-blue-600 via-purple-600 to-red-500 bg-clip-text text-transparent animate-fade-in">
                Revolutionizing
                <br />
                Feedback for
                <br />
                Educators
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed animate-fade-in animation-delay-200">
                Empowering teachers with smart, efficient feedback tools that
                save time and enhance student support through personalized
                insights.
              </p>
              <div className="flex gap-6 animate-fade-in animation-delay-400">
                <Link href="/how-it-works">
                  <Button className="px-10 py-4 bg-[#F26257] text-white rounded-full flex items-center group hover:shadow-xl transition-all duration-300 text-lg">
                    See How It Works
                    <ArrowRight className="ml-3 w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    variant="outline"
                    className="px-10 py-4 border-[#F26257] text-[#F26257] hover:bg-blue-50 rounded-full transition-all duration-300 text-lg"
                  >
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative w-full md:w-1/2 rounded-tl-3xl rounded-bl-3xl bg-[#ECE5DB] md:pl-28 h-[660px]">
              <Image
                src="/sideimg2.webp"
                alt="Educators Illustration"
                height={770}
                width={440}
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* Problem & Objective Section */}
        <section className="bg-[#ECE5DB] py-28 relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-10">
            {/* Heading */}
            <h2 className="text-5xl font-bold text-center text-[#2A2A2A] mb-20 tracking-tight">
              Our Challenge & Solution
            </h2>

            {/* Problem & Objective Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-28 max-w-6xl mx-auto">
              <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-3xl font-semibold text-[#2A2A2A] mb-6">
                  Problem Statement
                </h3>
                <p className="text-lg text-[#5A5A5A] leading-relaxed">
                  Teachers in schools, coaching centres, and colleges often face
                  a heavy workload when providing individualized feedback to
                  students in large classrooms. Manual grading and feedback
                  processes are time-consuming, leaving educators with limited
                  time to focus on teaching and mentoring. This challenge is
                  especially severe in under-resourced areas where
                  teacher-student ratios are high.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-3xl font-semibold text-[#2A2A2A] mb-6">
                  Our Objective
                </h3>
                <p className="text-lg text-[#5A5A5A] leading-relaxed">
                  We aim to build an AI-powered teacher assistant that automates
                  grading and provides personalized feedback. This tool helps
                  educators save time, enhances the feedback quality, and
                  enables scalable personalized learning — supporting UN SDG 4:
                  Quality Education.
                </p>
              </div>
            </div>

            {/* How We Solve It Section */}
            <div className="relative max-w-4xl mx-auto">
              <h3 className="text-4xl font-semibold text-[#2A2A2A] mb-14 text-center">
                How We Solve It
              </h3>

              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start mb-20 relative">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-xl mr-8">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-[#2A2A2A] mb-3">
                    Image-based Assignment Input
                  </h4>
                  <p className="text-lg text-[#5A5A5A] leading-relaxed">
                    Students upload their handwritten or typed assignments as
                    image or PDF files. OCR and CV modules convert them into
                    machine-readable formats for further processing.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse items-start mb-20 relative">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-xl ml-0 md:ml-8 mt-6 md:mt-0">
                  2
                </div>
                <div className="flex-1 text-right md:text-left">
                  <h4 className="text-2xl font-bold text-[#2A2A2A] mb-3">
                    Automated Evaluation
                  </h4>
                  <p className="text-lg text-[#5A5A5A] leading-relaxed">
                    Using trained AI models, the system automatically evaluates
                    answers — supporting both objective and subjective grading —
                    based on rubrics or model answers.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-start mb-20 relative">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-xl mr-8">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-[#2A2A2A] mb-3">
                    Personalized Feedback
                  </h4>
                  <p className="text-lg text-[#5A5A5A] leading-relaxed">
                    Each student receives targeted feedback on their strengths
                    and areas for improvement. Tips and additional learning
                    resources are included to guide students forward.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row-reverse items-start mb-20 relative">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-xl ml-0 md:ml-8 mt-6 md:mt-0">
                  4
                </div>
                <div className="flex-1 text-right md:text-left">
                  <h4 className="text-2xl font-bold text-[#2A2A2A] mb-3">
                    Teacher Dashboard
                  </h4>
                  <p className="text-lg text-[#5A5A5A] leading-relaxed">
                    Teachers use a dashboard to review AI-generated results,
                    make corrections if needed, and communicate with students.
                    It’s a central hub for managing learning.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col md:flex-row items-start mb-20 relative">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F26257] rounded-full flex items-center justify-center text-white font-bold text-xl mr-8">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-[#2A2A2A] mb-3">
                    Progress Analytics
                  </h4>
                  <p className="text-lg text-[#5A5A5A] leading-relaxed">
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
      <footer className="bg-[#ECE5DB] border-t border-gray-200 py-8">
        <div className="container mx-auto px-6 md:px-10 text-center">
          <p className="text-gray-700 text-base">
            © {new Date().getFullYear()} Score Lab. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <Link href="/privacy-policy" className="text-gray-700 hover:text-gray-900 text-base">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-700 hover:text-gray-900 text-base">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 text-base">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}