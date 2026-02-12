"use client";
import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/Primarybutton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "@/app/config";
import { useRouter } from "next/navigation";

export default function() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    
    return <div className="min-h-screen"> 
        <Appbar />
        <div className="flex justify-center px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row pt-4 sm:pt-8 max-w-4xl w-full gap-8 lg:gap-0">
                <div className="flex-1 pt-4 lg:pt-20 px-0 sm:px-4 order-2 lg:order-1">
                    <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl pb-4">
                    Join millions worldwide who automate their work using Zapier.
                    </h2>
                    <div className="pb-4 sm:pb-6 pt-2 sm:pt-4">
                        <CheckFeature label={"Easy setup, no coding required"} />
                    </div>
                    <div className="pb-4 sm:pb-6">
                        <CheckFeature label={"Free forever for core features"} />
                    </div>
                    <CheckFeature label={"14-day trial of premium features & apps"} />

                </div>
                <div className="flex-1 pt-4 lg:pt-6 pb-6 lg:mt-12 px-4 sm:px-6 border border-gray-200 rounded-lg shadow-lg bg-white order-1 lg:order-2 min-w-0">
                    <Input onChange={e => {
                        setEmail(e.target.value)
                    }} label={"Email"} type="text" placeholder="Your Email"></Input>
                    <Input onChange={e => {
                        setPassword(e.target.value);
                    }} label={"Password"} type="password" placeholder="Password"></Input>
                    <div className="pt-4">
                        <PrimaryButton onClick={async () => {
                            try {
                                const res = await axios.post<{ token: string }>(`${BACKEND_URL}/api/v1/user/signin`, {
                                    username: email,
                                    password,
                                });
                                localStorage.setItem("token", res.data.token);
                                router.push("/dashboard");
                            } catch (err: any) {
                                alert(err.response?.data?.message || "Login failed");
                            }
                        }} size="big">Login</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
}