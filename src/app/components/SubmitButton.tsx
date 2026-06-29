"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ text = "SIMPAN PERUBAHAN" }: { text?: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full sm:w-auto font-bold py-3 px-8 rounded-sm transition-all focus:ring-2 focus:ring-hris-info
                ${pending
                    ? "bg-hris-muted text-gray-500 cursor-not-allowed scale-100"
                    : "bg-hris-light text-hris-primary hover:bg-hris-accent active:scale-[0.98]"
                }`
            }
        >
            {pending ? "SEDANG MEMPROSES..." : text}
        </button>
    )
}