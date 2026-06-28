interface JabatanDetailProps {
    params: Promise<{ id: string }>;
}

export default async function DetailJabatan({ params }: JabatanDetailProps) {
    const { id } = await params;

    return (
        <main className="flex-1 p-10">
            <h1 className="text-3xl font-bold">Detail Profil Jabatan</h1>
            <div className="mt-6 p-6 bg-gray-900 border border-gray-800 rounded-xl inline-block">
                <p className="text-gray-400">Kamu sedang membuka data dengan ID:</p>
                <p className="text-4xl text-blue-400 font-black mt-2">{id}</p>
            </div>
        </main>
    )
}