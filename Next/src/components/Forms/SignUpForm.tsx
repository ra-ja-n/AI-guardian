"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { formSchema } from "@/zodResolvers/resolver"
import { useUserDetail } from "@/Hooks/Hooks"
import { useRouter } from "next/navigation"
import { useSetRecoilState } from "recoil"
import { TUserDetail, userDetail } from "@/store/recoil"

type TSignUpFormProps = {
  setActiveTab: Dispatch<SetStateAction<string>>
}



export default function SignUpForm({setActiveTab}: TSignUpFormProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<z.infer<typeof formSchema>>({email: "", firstname: "", lastname: "",password: "",username: ""})
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,  
      username: userData.username,
      password: userData.password
    },
  })
  const setUserDetail = useSetRecoilState(userDetail);
  
  const createUser = async()=>{
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    const data = await response.json()
    if(data.success){
      console.log("Success data");
      setActiveTab("Log in")
      localStorage.setItem("id", data.id);
      setUserDetail({username: userData.username, email: userData.email, firstname: userData.firstname, lastname: userData.lastname})
      router.push(`/home/${data.id}`)
    }
  }
  
  useEffect(()=>{
    const check = formSchema.safeParse(userData);
    if(check.success){
      createUser();
    } 
  }, [userData])

  useEffect(()=>{
    setActiveTab("Sign Up")
  }, [])
  

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values ",values)
    setUserData({...values})
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
      <FormField
          control={form.control}
          name="email"
          render={({ field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="focus:border-[2px] focus:border-solid focus:border-green-900" placeholder="Enter your email" {...field} />
              </FormControl>   

              <FormMessage/>           

            </FormItem>
            
          )}
        />
        
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>

              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input className="focus:border-[2px] focus:border-solid focus:border-green-900"  placeholder="Enter your Firstname" {...field} />
              </FormControl>    

              <FormMessage/>          

            </FormItem>
            
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input className="focus:border-[2px] focus:border-solid focus:border-green-900" placeholder="Enter your lastname" {...field} />
              </FormControl>   

              <FormMessage/>           

            </FormItem>
            
          )}
        />
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>

              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" className="focus:border-[2px] focus:border-solid focus:border-green-900" placeholder="Enter your username" {...field} />
              </FormControl>

              <FormDescription>
                This is your public display name.
              </FormDescription>
              

            </FormItem>
            
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>

              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input className="focus:border-[2px] focus:border-solid focus:border-green-900" type="password" placeholder="Enter your Password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
            
            

          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )

}

