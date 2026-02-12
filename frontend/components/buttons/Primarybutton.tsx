import { ReactNode } from "react"

export const PrimaryButton = ({ children, onClick, size = "small" }: {
    children: ReactNode,
    onClick: () => void,
    size?: "big" | "small"
}) => {
    return <div onClick={onClick} role="button" className={`${size === "small" ? "text-sm px-6 sm:px-8 py-2" : "text-base sm:text-xl px-8 sm:px-10 py-3 sm:py-4"} min-h-[44px] cursor-pointer hover:shadow-lg hover:bg-amber-600 active:bg-amber-800 transition-all bg-amber-700 text-white rounded-full text-center flex justify-center flex-col font-medium`}>
        {children}
    </div>
}