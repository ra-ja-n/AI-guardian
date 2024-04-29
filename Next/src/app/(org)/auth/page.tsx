"use client"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs";
import LoginForm from "@/components/Forms/LoginForm"
import SignUpForm from "@/components/Forms/SignUpForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png"; 
export function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [activeTab, setActiveTab] = useState("Log in");

  const router = useRouter();

  const authenticate = async () => {
    try {
      const response = await fetch("/api/random", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        router.push(`/home/${data.id}`);
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  useEffect(() => {
    console.log("Active tab", activeTab);
  }, [activeTab]);

  return (
    <div>
      {!isLogin ? (
        <Tabs defaultValue={activeTab} className="w-[400px] px-[1rem]">
          <TabsList className="grid w-full grid-cols-2 bg-customGray h-[3rem]">
            <TabsTrigger className="h-[100%]" value="Log in">
              Log in
            </TabsTrigger>
            <TabsTrigger className="h-[100%]" value="Sign Up">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Log in">
            <Card className="bg-black border-[1px] border-white/30 text-white border-solid">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <LoginForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Sign Up">
            <Card className="bg-black text-white border-[2px] border-solid border-white/30">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Don't have an account? Sign up here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <SignUpForm setActiveTab={setActiveTab} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="bg-black h-[100vh] w-[100vw] flex items-center justify-center flex-col">
          <Image src={logo} alt="Logo" />
          <span className="loader"></span>
        </div>
      )}
    </div>
  );
}

export default Auth;
