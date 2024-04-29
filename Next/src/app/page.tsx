"use client"

import Image from "next/image";
import { useEffect } from "react";
import logo from "@/assets/logo.png"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const autheticate = async()=>{
    const response = await fetch("/api/random", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if(!data.success){
      router.push("/auth");
    }else{
     router.push(`/home/${data.id}`);
    }
  }

  useEffect(()=>{
    autheticate();
  }, [])

  return (
   <div className="bg-black h-[100vh] w-[100vw] flex items-center justify-center flex-col">
    <Image src={logo} alt="Logo" />
    <span className="loader"></span>
   </div>
  );
}
