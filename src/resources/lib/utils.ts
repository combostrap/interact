// Don't add any function here
// as this file is a shadcn file
// It may be used, overwritten by client, and they will not copy our methods
import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
