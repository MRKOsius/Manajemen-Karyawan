"use client";

import { useActionState } from "react";
import Link from "next/link";
import SubmitButton from "@/app/components/SubmitButton";
import { simpanKaryawan } from "./actions";

export default function KaryawanForm({ pilihanJabatan, pilihanDepartemen }: { pilihanJabatan: { id: string; nama: string }[], pilihanDepartemen: { id: string; nama: string }[] }) {
    const [state, formAction] = useActionState(simpanKaryawan, null);

    return (
        <form action={formAction} className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
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
                            <label htmlFor="nama" className="text-[13px] font-medium text-ink-primary mb-1">Nama Lengkap</label>
                            <input id="nama" type="text" name="nama" required className={`hris-input ${state?.error?.nama ? 'border-danger/50' : ''}`} placeholder="Masukkan nama lengkap" />
                            {state?.error?.nama && <p className="text-[11px] text-danger mt-1">{state.error.nama[0]}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="gaji" className="text-[13px] font-medium text-ink-primary mb-1">Gaji Dasar (IDR)</label>
                            <input id="gaji" type="number" name="gaji" required className={`hris-input ${state?.error?.gaji ? 'border-danger/50' : ''}`} placeholder="Masukkan nominal gaji" />
                            {state?.error?.gaji && <p className="text-[11px] text-danger mt-1">{state.error.gaji[0]}</p>}
                        </div>
                    </div>
                </div>

                {/* Block 2 */}
                <div>
                    <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Posisi & Struktur</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="jabatanId" className="text-[13px] font-medium text-ink-primary mb-1">Jabatan</label>
                            <select id="jabatanId" name="jabatanId" defaultValue="" required className={`hris-input ${state?.error?.jabatanId ? 'border-danger/50' : ''}`}>
                                <option value="" disabled>Pilih Jabatan</option>
                                {pilihanJabatan.map((jbtn) => (
                                    <option key={jbtn.id} value={jbtn.id}>{jbtn.nama}</option>
                                ))}
                            </select>
                            {state?.error?.jabatanId && <p className="text-[11px] text-danger mt-1">{state.error.jabatanId[0]}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="departemenId" className="text-[13px] font-medium text-ink-primary mb-1">Departemen</label>
                            <select id="departemenId" name="departemenId" defaultValue="" required className={`hris-input ${state?.error?.departemenId ? 'border-danger/50' : ''}`}>
                                <option value="" disabled>Pilih Departemen</option>
                                {pilihanDepartemen.map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.nama}</option>
                                ))}
                            </select>
                            {state?.error?.departemenId && <p className="text-[11px] text-danger mt-1">{state.error.departemenId[0]}</p>}
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
