"use client"
import { useFormStatus } from "react-dom"

export default function SubmitButton({ text = "Simpan Perubahan" }: { text?: string }) {
    const { pending } = useFormStatus()
    return (
        <button 
            type="submit" 
            disabled={pending}
            className={`px-6 py-2.5 bg-accent text-white rounded-[6px] text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${pending ? "opacity-70 cursor-not-allowed" : "hover:bg-accent-hover"}`}
        >
            {pending ? "Menyimpan..." : text}
        </button>
    )
}