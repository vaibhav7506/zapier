"use client"
import Link from "next/link"
import { Feature } from "./Feature"

export const Hero = () => {
    return <div className="py-4 sm:py-8 px-4 sm:px-6">
        <div className="flex justify-center">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center pt-4 sm:pt-8 max-w-3xl text-gray-900 leading-tight">
                Automate as fast as you can type    
            </h1>
        </div>
        <div className="flex justify-center pt-2 sm:pt-4">
            <p className="text-base sm:text-lg md:text-xl text-center pt-2 sm:pt-4 max-w-2xl text-gray-600 leading-relaxed px-2">
                AI gives you automation superpowers, and Zapier puts them to work. Pairing AI and Zapier helps you turn ideas into workflows and bots that work for you.
            </p>
        </div>

        <div className="flex justify-center pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto">
                <Link href="/signup" className="w-full sm:w-auto text-base sm:text-xl px-6 sm:px-10 py-3 sm:py-4 cursor-pointer hover:shadow-lg hover:bg-amber-600 transition-all bg-amber-700 text-white rounded-full font-medium text-center flex justify-center min-h-[48px]">
                    Get Started free
                </Link>
                <Link href="#" className="w-full sm:w-auto text-base sm:text-xl px-6 sm:px-10 py-3 sm:py-4 cursor-pointer hover:shadow-lg border-2 border-gray-800 text-gray-900 hover:bg-gray-50 rounded-full font-medium transition-all text-center flex justify-center min-h-[48px]">
                    Contact Sales
                </Link>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 pt-8 sm:pt-12">
            <Feature title={"Free Forever"} subtitle={"for core features"} />
            <Feature title={"More apps"} subtitle={"than any other platforms"} />
            <Feature title={"Cutting Edge"} subtitle={"AI Features"} />
        </div>
    </div>
}