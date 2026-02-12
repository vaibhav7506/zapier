"use client";

import { ReactNode } from "react"

export const LinkButton = ({ children, onClick }: { children: ReactNode, onClick: () => void }) => {
    return <div role="button" className="flex justify-center px-4 py-2 min-h-[44px] min-w-[44px] items-center cursor-pointer hover:bg-slate-100 active:bg-slate-200 font-medium text-sm rounded-lg text-gray-700 transition" onClick={onClick}>
        {children}
    </div>
}