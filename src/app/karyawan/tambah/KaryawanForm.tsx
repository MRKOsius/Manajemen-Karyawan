"use client";

import { useActionState } from "react";
import Link from "next/link";
import SubmitButton from "@/app/components/SubmitButton";
import CustomSelect from "@/app/components/CustomSelect";
import { simpanKaryawan } from "./actions";

export default function KaryawanForm({ pilihanJabatan, pilihanDepartemen }: { pilihanJabatan: { id: string; nama: string }[], pilihanDepartemen: { id: string; nama: string }[] }) {
    const [state, formAction] = useActionState(simpanKaryawan, null);

    return (
        <form action={formAction} encType="multipart/form-data" className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
            {state?.message && (
                <div className="bg-canvas border-b border-border-default px-8 py-4">
                    <p className="text-[13px] font-medium text-danger">{state.message}</p>
                </div>
            )}
            
            <div className="p-8">
                {/* Block 1 */}
                <div className="mb-10">
                    <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Informasi Dasar</h2>
                    <div className="gap-6 flex flex-col">
                        <div className="flex flex-col">
                            <label htmlFor="avatar" className="text-[13px] font-medium text-ink-primary mb-1">
                                Foto Karyawan <span className="text-ink-muted">(Opsional, max 2MB)</span>
                            </label>

                            <input
                                id="avatar"
                                type="file"
                                name="avatar"
                                accept="image/png, image/jpeg, image/webp"
                                className="w-full text-[13px] text-ink-primary file:mr-4 file:py-2 file:px-4 file:border file:border-border-default file:rounded-[8px] file:bg-surface file:text-ink-secondary file:font-medium hover:file:bg-elevated file:transition-colors focus:outline-none cursor-pointer" />
                            <label htmlFor="nama" className="text-[13px] font-medium text-ink-primary mb-1">Nama Lengkap</label>
                            <input id="nama" type="text" name="nama" required className={`hris-input ${state?.error?.nama ? 'border-danger/50' : ''}`} placeholder="Masukkan nama lengkap" />
                            {state?.error?.nama && <p role="alert" className="text-[11px] text-danger mt-1">{state.error.nama[0]}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="gaji" className="text-[13px] font-medium text-ink-primary mb-1">Gaji Dasar (IDR)</label>
                            <input id="gaji" type="number" name="gaji" required className={`hris-input ${state?.error?.gaji ? 'border-danger/50' : ''}`} placeholder="Masukkan nominal gaji" />
                            {state?.error?.gaji && <p role="alert" className="text-[11px] text-danger mt-1">{state.error.gaji[0]}</p>}
                        </div>
                    </div>
                </div>

                {/* Block 2 */}
                <div>
                    <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Posisi & Struktur</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="jabatanId" className="text-[13px] font-medium text-ink-primary mb-1">Jabatan</label>
                            <CustomSelect 
                                name="jabatanId" 
                                options={pilihanJabatan} 
                                placeholder="-- Pilih Jabatan --" 
                                error={!!state?.error?.jabatanId}
                            />
                            {state?.error?.jabatanId && <p role="alert" className="text-[11px] text-danger mt-1">{state.error.jabatanId[0]}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="departemenId" className="text-[13px] font-medium text-ink-primary mb-1">Departemen</label>
                            <CustomSelect 
                                name="departemenId" 
                                options={pilihanDepartemen} 
                                placeholder="-- Pilih Departemen --" 
                                error={!!state?.error?.departemenId}
                            />
                            {state?.error?.departemenId && <p role="alert" className="text-[11px] text-danger mt-1">{state.error.departemenId[0]}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-canvas border-t border-border-default px-8 py-5 flex items-center justify-between">
                <Link 
                    href="/karyawan"
                    className="px-6 py-2 border border-border-default bg-surface text-ink-primary rounded-[6px] text-[13px] font-medium hover:bg-elevated hover:border-border-strong transition-all focus:outline-none focus:ring-2 focus:ring-border-focus"
                >
                    Batalkan
                </Link>
                <SubmitButton text="Simpan Karyawan" />
            </div>
        </form>
    )
}
