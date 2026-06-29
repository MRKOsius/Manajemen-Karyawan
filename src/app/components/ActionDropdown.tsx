"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

interface ActionDropdownProps {
  id: string;
  editHref: string;
  deleteAction: (formData: FormData) => Promise<{ error?: string } | void | undefined>;
  entityName: string;
  entityType?: string;
}

export default function ActionDropdown({ id, editHref, deleteAction, entityName, entityType = "Data" }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleAction(formData: FormData) {
    if (isPending) return;
    startTransition(async () => {
      try {
        const response = await deleteAction(formData);
        if (response?.error) {
           toast.error(response.error);
        } else {
           toast.success(`${entityName} berhasil dihapus`);
           setIsConfirmOpen(false);
        }
      } catch (err: any) {
        toast.error(err.message || "Gagal menghubungi server");
      }
    });
  }

  return (
    <>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-[6px] transition-colors"
          aria-label={`Opsi untuk ${entityName}`}
          aria-expanded={isOpen}
        >
          <MoreHorizontal className="w-4 h-4 cursor-pointer" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-36 bg-surface border border-border-default rounded-[6px] shadow-sm overflow-hidden z-20">
            <Link 
              href={editHref} 
              className="block w-full text-left px-4 py-2.5 text-[13px] text-ink-secondary hover:bg-elevated hover:text-ink-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Edit
            </Link>
            <button 
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsConfirmOpen(true);
              }}
              className="block w-full text-left px-4 py-2.5 text-[13px] text-danger hover:bg-danger-bg transition-colors"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-primary/20 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border-default rounded-[8px] p-6 w-full max-w-sm shadow-sm">
            <h3 className="text-[16px] font-medium text-ink-primary mb-2">Hapus {entityName}?</h3>
            <p className="text-[13px] text-ink-secondary mb-6 leading-relaxed">
              Semua data akan dihapus permanen termasuk riwayat terkait {entityName.toLowerCase()}.
            </p>
            
            <form 
              action={handleAction} 
              className="flex justify-end gap-3"
            >
              <input type="hidden" name="id" value={id} />
              
              <button 
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 text-[13px] font-medium text-ink-secondary bg-surface border border-border-default rounded-[6px] hover:bg-elevated transition-colors"
              >
                Batalkan
              </button>
              
              <button 
                type="submit"
                disabled={isPending}
                className="px-4 py-2 text-[13px] font-medium text-danger bg-danger-bg border border-transparent rounded-[6px] hover:bg-danger/10 transition-colors disabled:opacity-50"
              >
                {isPending ? "Menghapus..." : `Hapus ${entityType}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
