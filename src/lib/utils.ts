import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface UserInfo{
  accessToken:string
  email:string
  displayName:string
  photoURL:string
  userId:string
}