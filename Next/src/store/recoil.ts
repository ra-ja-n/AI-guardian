import { formSchema } from "@/zodResolvers/resolver";
import { atom } from "recoil";
import { z } from "zod";

export type TUserDetail = Omit<z.infer<typeof formSchema>, "password">;


export const userDetail = atom<TUserDetail>({
    key: "userDetail",
    default: {
        email: "",
        firstname: "",
        lastname: "",
        username: ""
    }
})