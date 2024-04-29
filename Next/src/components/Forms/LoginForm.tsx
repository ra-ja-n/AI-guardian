"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {  Form,  FormControl,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {message: "Password must be atleat 8 characters."}),
})

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })


  async function  onSubmit(values: z.infer<typeof formSchema>) {
   const response = await fetch("/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
   })
   const data = await response.json();
   console.log(data);
   if(data.success){
    localStorage.setItem("id", JSON.stringify(data.id));
    router.push(`/home/${data.id}`)
   } else{

   }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>

              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input  placeholder="Enter your username" {...field} />
              </FormControl>

              

              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
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
                <Input type="password" placeholder="Enter your Password" {...field} />
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

export default LoginForm