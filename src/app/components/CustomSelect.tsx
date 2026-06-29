"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
    id: string;
    nama: string;
}

interface CustomSelectProps {
    name: string;
    options: Option[];
    placeholder: string;
    defaultValue?: string;
    error?: boolean;
}

export default function CustomSelect({ name, options, placeholder, defaultValue = "", error }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === selectedId);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            {/* Input Tersembunyi (Hidden) agar ditangkap oleh FormData Next.js saat di Submit */}
            <input type="hidden" name={name} value={selectedId} required />
            
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between border ${error ? 'border-danger/50' : 'border-border-default hover:border-border-strong'} bg-surface rounded-[6px] py-2 px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-border-focus transition-all`}
            >
                <span className={selectedOption ? "text-ink-primary font-medium" : "text-ink-muted"}>
                    {selectedOption ? selectedOption.nama : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-ink-primary' : ''}`} />
            </button>

            {/* Menu Pop-Up Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 bg-elevated border border-border-default rounded-[8px] shadow-sm overflow-hidden text-[13px] text-ink-secondary py-1 animate-in fade-in zoom-in-95 duration-100">
                    <ul className="max-h-56 overflow-y-auto">
                        {options.map((opt) => {
                            const isSelected = selectedId === opt.id;
                            
                            return (
                                <li
                                    key={opt.id}
                                    onClick={() => {
                                        setSelectedId(opt.id);
                                        setIsOpen(false);
                                    }}
                                    className={`px-3 py-2 mx-1 rounded-[4px] cursor-pointer transition-colors flex items-center justify-between ${
                                        isSelected 
                                            ? 'bg-accent/10 text-accent font-medium' 
                                            : 'hover:bg-surface hover:text-ink-primary'
                                    }`}
                                >
                                    <span>{opt.nama}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5" />}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
