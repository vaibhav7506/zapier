import { ReactNode } from "react"

export const DarkButton = ({ children, onClick, size = "small" }: {
    children: ReactNode,
    onClick: () => void,
    size?: "big" | "small"
}) => {
    return <div onClick={onClick} role="button" className={`flex flex-col justify-center px-6 sm:px-8 py-2 min-h-[44px] cursor-pointer hover:shadow-lg hover:bg-purple-700 active:bg-purple-900 transition-all bg-purple-800 text-white rounded-lg text-center font-medium ${size === "big" ? "text-lg px-8 sm:px-10 py-3" : ""}`}>
        {children}
    </div>
}