import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const cx = (...classNames: any) =>
    classNames.filter(Boolean).join(" ");

export function formatDate(input: string | number): string {
    const date = new Date(input)
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

export function absoluteUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

// function to add a month to a date for the expiresAt field
export function addMonth(dateObj: Date, num: number) {
    dateObj.setMonth(dateObj.getMonth() + num);
    const dateString = dateObj?.toISOString()?.split("T")[0];
    if (dateString) {
        return dateString.replace(/-/g, "/");
    }
    return "";
}

export const createdAtDate = new Date()
    ?.toISOString()
    ?.split("T")[0]
    ?.replaceAll("-", "/") as string;

