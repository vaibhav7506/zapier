"use client";
import Link from "next/link";

export const Appbar = () => {
    return (
        <header className="flex border-b border-gray-200 justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm gap-2">
            <Link href="/" className="text-xl sm:text-2xl font-extrabold text-amber-800 hover:opacity-90 transition shrink-0">
                Zapier
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Link href="#" className="hidden sm:flex justify-center px-3 sm:px-4 py-2 cursor-pointer hover:bg-slate-100 font-medium text-xs sm:text-sm rounded-lg text-gray-700 transition">
                    Contact Sales
                </Link>
                <Link href="/login" className="flex justify-center px-3 sm:px-4 py-2 cursor-pointer hover:bg-slate-100 font-medium text-xs sm:text-sm rounded-lg text-gray-700 transition min-h-[44px] min-w-[44px] items-center">
                    Login
                </Link>
                <Link href="/signup" className="flex justify-center items-center text-xs sm:text-sm px-5 sm:px-8 py-2 cursor-pointer hover:shadow-lg hover:bg-amber-600 transition-all bg-amber-700 text-white rounded-full font-medium min-h-[44px]">
                    Signup
                </Link>
            </nav>
        </header>
    );
};