import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { Search, Clock } from "lucide-react";
import EmptyState from "../components/EmptyState";
import SubmitButton from "../components/SubmitButton";
import CustomSelect from "../components/CustomSelect";

export const metadata: Metadata = {
    title: 'Absensi Kehadiran | HRIS Admin'
}

async function rekamAbsensi(formData: FormData) {
    "use server";
    const karyawanId = formData.get("karyawanId") as string;
    const tipe = formData.get("tipe") as string;

    if (karyawanId && tipe) {
        await prisma.absensi.create({
            data: {
                karyawanId: karyawanId,
                tipe: tipe
            }
        });
    }
    revalidatePath("/absensi");
}

export default async function AbsensiPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const kataKunci = params?.q || "";

    const dataAbsensi = await prisma.absensi.findMany({
        orderBy: { waktu: 'desc' },
        include: {
            karyawan: { include: { departemen: true } }
        },
        take: 30 // Batasi tampilan agar tidak membebani memori
    });

    // Mengambil Karyawan Aktif untuk Dropdown Absen Cepat
    const opsiKaryawan = await prisma.karyawan.findMany({
        where: { isActive: true },
        select: { id: true, nama: true }
    });

    const tipeAbsen = [
        { id: "Masuk", nama: "Masuk (Check In)" },
        { id: "Keluar", nama: "Keluar (Check Out)" }
    ];

    return (
        <section className="px-10 py-10 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                <div>
                    <h1 className="text-[18px] font-semibold text-ink-primary">Rekam Kehadiran</h1>
                    <p className="text-[13px] text-ink-muted mt-1 max-w-md">Catat waktu kedatangan dan kepulangan karyawan. Integrasikan perangkat keras (*Fingerprint/RFID*) untuk pencatatan otomatis di masa depan.</p>
                </div>

                <form action={rekamAbsensi} className="bg-surface border border-border-default rounded-[8px] p-5 w-full md:w-auto min-w-[340px]">
                    <h2 className="text-[12px] font-medium text-ink-primary mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" /> Setor Presensi Manual
                    </h2>
                    <div className="space-y-4 mb-5">
                        <CustomSelect 
                            name="karyawanId"
                            options={opsiKaryawan}
                            placeholder="Pilih Karyawan..."
                        />
                        <CustomSelect 
                            name="tipe"
                            options={tipeAbsen}
                            placeholder="Tipe Presensi..."
                        />
                    </div>
                    <SubmitButton text="Simpan Waktu" />
                </form>
            </div>

            {dataAbsensi.length > 0 ? (
                <div className="bg-surface border border-border-default rounded-[8px]">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong w-48">
                                    Jenis
                                </th>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong">
                                    Data Karyawan
                                </th>
                                <th scope="col" className="px-6 py-3 text-[11px] font-medium text-right uppercase tracking-[0.06em] text-ink-muted border-b border-border-strong w-48">
                                    Tap Waktu Perekaman
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataAbsensi.map((abs) => {
                                const waktuAbsen = new Intl.DateTimeFormat('id-ID', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                }).format(abs.waktu);

                                return (
                                <tr key={abs.id}>
                                    <td className="px-6 py-3">
                                        <span className={abs.tipe === "Masuk" ? "badge-active inline-flex items-center gap-1.5" : "badge-danger inline-flex items-center gap-1.5"}>
                                            <span aria-hidden="true" className="text-[10px]">●</span> {abs.tipe}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-elevated border border-border-default overflow-hidden">
                                                {abs.karyawan.avatar ? (
                                                    <img src={abs.karyawan.avatar} alt={abs.karyawan.nama} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-medium text-ink-secondary">
                                                        {abs.karyawan.nama.substring(0,2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-medium text-ink-primary">{abs.karyawan.nama}</p>
                                                <p className="text-[11px] font-mono text-ink-muted mt-0.5">{abs.karyawan.departemen?.nama || "Tanpa Divisi"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <p className="text-[13px] font-mono text-ink-secondary">{waktuAbsen}</p>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState 
                    title="Log presensi kosong" 
                    body="Mesin pencatat belum menerima pantulan aktivitas kehadiran satupun hari ini."
                    action="Setor Absensi Pertama"
                    actionHref="/absensi"
                />
            )}
        </section>
    );
}
