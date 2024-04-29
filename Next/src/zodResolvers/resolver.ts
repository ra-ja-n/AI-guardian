import { z } from "zod";

export const formSchema = z.object({
    firstname:z.string().min(1, {message: "firstname must be at least 1 character."}),
    lastname: z.string().min(1, {message: "lastname must be at least 1 character."}),
    email: z.string().email({message: "Invalid email"}),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {message: "Password must be atleat 8 characters."}),
  })