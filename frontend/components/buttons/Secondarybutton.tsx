import { ReactNode } from "react"

export const SecondaryButton = ({ children, onClick, size = "small" }: {
    children: ReactNode,
    onClick: () => void,
    size?: "big" | "small"
}) => {
    return <div onClick={onClick} role="button" className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 py-2" : "px-10 py-4"} cursor-pointer hover:shadow-lg border-2 border-gray-800 text-gray-900 hover:bg-gray-50 rounded-full font-medium transition-all text-center flex justify-center flex-col`}>
        {children}
    </div>
}