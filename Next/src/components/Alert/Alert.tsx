"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Dispatch, SetStateAction } from "react";

type AlertProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

function Alert({open, setOpen}:AlertProps){
    return ( <AlertDialog open={open}>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alert!!!</AlertDialogTitle>
            <AlertDialogDescription>
              Organization rules voilated. Model will not able to access with this prompt
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>{setOpen(false)}}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       );
  }
   
export default Alert;