"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@components/components/ui/button"
import Counter from "@components/components/counter";

export default function LandingPage() {

    const router = useRouter();

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center gap-6 p-4 bg-gray-50">
            <Image
                src="/logo/logo-eScout-White.png" 
                alt="Welcome"
                width={220}
                height={220}
                className="object-contain"
            />
            <h1 className="text-3xl font-sans font-bold text-center text-gray-800">Selamat Datang!</h1>
            
            <div className="mt-5 flex">
                <Button 
                    onClick={() => router.push("/login")}
                    className="mr-6 px-6 py-6 text-white text-base"
                >
                    Log Masuk
                </Button>
                <Button 
                    onClick={() => router.push("/halaman-berita")}
                    variant={"ghost"}
                    className="mr-6 px-6 py-6 text-black text-base border border-black"
                >
                    Halaman Berita
                </Button>

                
            </div>

            {/* <Counter/> */}
        </div>
    )
}
