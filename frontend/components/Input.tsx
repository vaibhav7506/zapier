"use client";

export const Input = ({label, placeholder, onChange, type = "text"}: {
    label: string;
    placeholder: string;
    onChange: (e: any) => void;
    type?: "text" | "password" | "email"
}) => {
    return <div>
        <div className="text-sm pb-1 pt-2">
            * <label>{label}</label>
        </div>
        <input className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition" type={type} placeholder={placeholder} onChange={onChange} />
    </div>
}
