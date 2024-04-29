import { formSchema } from "@/zodResolvers/resolver"
import { useEffect, useState } from "react"
import { z } from "zod"

// TUserDetail will not contain "password"
type TUserDetail = Omit<z.infer<typeof formSchema>, "password">;
export const useUserDetail = ()=>{
    const [userDetails, setUserDetails] = useState<TUserDetail>({email: "", firstname: "", lastname: "", username: ""});
    
    const updateValues = (payload:TUserDetail)=>{
        setUserDetails({...payload});
    }

    return {userDetails, updateValues};
}