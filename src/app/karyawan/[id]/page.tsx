import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SubmitButton from "@/app/components/SubmitButton";
import CustomSelect from "@/app/components/CustomSelect";

export default async function DetailKaryawan({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const karyawan = await prisma.karyawan.findUnique({
        where: { id: id }
    });

    if (!karyawan) return <div className="p-10 text-center text-ink-muted mt-10 w-full col-span-full">Karyawan tidak ditemukan.</div>;

    const pilihanJabatan = await prisma.jabatan.findMany({ where: { isActive: true } });
    const pilihanDepartemen = await prisma.departemen.findMany({ where: { isActive: true } });

    async function updateData(formData: FormData) {
        "use server";
        const nama = formData.get("nama") as string;
        const jabatanId = formData.get("jabatanId") as string;
        const departemenID = formData.get("departemenID") as string;
        const gaji = Number(formData.get("gaji"));

        await prisma.karyawan.update({
            where: { id: id },
            data: {
                nama: nama,
                jabatanId: jabatanId,
                departemenID: departemenID,
                gaji: gaji
            }
        });

        redirect("/karyawan");
    }

    return (
        <section className="px-10 py-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="w-full text-left mb-8">
                <Link href="/karyawan" className="text-[13px] font-sans text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:underline">
                    ← Karyawan / Detail Karyawan
                </Link>
                <div className="flex items-center gap-4 mt-6">
                    {karyawan.avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                            src={karyawan.avatar}
                            alt={`Foto ${karyawan.nama}`}
                            width={64}
                            height={64}
                            className="rounded-full border border-border-default bg-surface w-16 h-16 object-cover" 
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full border border-border-default bg-elevated flex items-center justify-center">
                            <span className="text-[20px] font-medium text-ink-secondary">{karyawan.nama.substring(0, 2).toUpperCase()}</span>
                        </div>
                    )}
                    <div>
                        <h1 className="text-[20px] font-semibold text-ink-primary tracking-tight">{karyawan.nama}</h1>
                        <p className="text-ink-muted text-[12px] font-mono mt-0.5">UUID: {karyawan.id}</p>
                    </div>
                </div>
            </div>

            <form action={updateData} className="w-full bg-surface border border-border-default rounded-[8px] overflow-hidden">
                <div className="p-8">
                    {/* Block 1 */}
                    <div className="mb-10">
                        <h2 className="text-[11px] uppercase tracking-[0.06em] text-ink-muted font-medium mb-6">Informasi Dasar</h2>
                        <div className="gap-6 flex flex-col">
                            <div className="flex flex-col">
                                <label htmlFor="nama" className="text-[13px] font-medium text-ink-primary mb-1">Nama Lengkap</label>
                                <input id="nama" name="nama" type="text" defaultValue={karyawan.nama} required className="hris-input" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="gaji" className="text-[13px] font-medium text-ink-primary mb-1">Gaji Dasar (IDR)</label>
                                <input id="gaji" name="gaji" type="number" defaultValue={karyawan.gaji} required className="hris-input" />
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
                                    defaultValue={karyawan.jabatanId}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="departemenID" className="text-[13px] font-medium text-ink-primary mb-1">Departemen</label>
                                <CustomSelect 
                                    name="departemenID" 
                                    options={pilihanDepartemen} 
                                    placeholder="-- Pilih Departemen --" 
                                    defaultValue={karyawan.departemenID || ""}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-canvas border-t border-border-default px-8 py-5 flex items-center justify-between">
                    <Link 
                        href="/karyawan"
                        className="px-6 py-2 border border-border-default bg-surface text-ink-primary rounded-[6px] text-[13px] font-medium hover:bg-elevated hover:border-border-strong transition-all focus:outline-none focus:ring-2 focus:ring-border-focus"
                    >
                        Batalkan
                    </Link>
                    <SubmitButton text="Update Karyawan" />
                </div>
                
            </form>

        </section>
    );
}
