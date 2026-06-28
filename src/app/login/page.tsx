import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage() {
    async function prosesLogin(formData: FormData) {
        "use server"

        const password = formData.get("password") as string;

        if (password === "admin123") {
            const cookieStore = await cookies();

            cookieStore.set("isLoggedIn", "true", {
                httpOnly: true,
                secure: false,
                maxAge: 60 * 60 * 24
            });

            redirect("/karyawan");
        } else {
            console.log("Password salah!");
        }
    }

    return (
        <main className="min-h-screen flex flex-col md:flex-row bg-hris-primary text-hris-primary">
            <div className="md:w-5/12 bg-hris-primary text-white p-10 flex flex-col justify-between border-r border-gray-800">
                <div>
                    <div className="w-12 h-12 bg-hris-accent mb-8" aria-hidden="true"></div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Kelola Kapital <br /> Manusia Terpadu.
                    </h1>
                    <p className="text-gray-400 font-mono text-sm max-w-sm">
                        Portal akses manajemen internal sistem HRIS.
                    </p>
                </div>
            </div>

            <div className="md:w-7/12 bg-hris-surface p-10 md:p-20 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto">
                    <h2 className="text-2xl font-bold mb-2 text-white">Masuk ke Sistem</h2>
                    <p className="text-hris-muted text-sm mb-8">Silahkan masukkan sandi untuk mengakses portal</p>
                    <form action={prosesLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-white">Kata Sandi Akses</label>
                            <input id="password" name="password" type="password" required className="w-full p-3 border border-hris-border bg-hris-primary text-white focus:outline-none focus:ring-2 focus:ring-hris-accent focus:border-transparent transition-all rounded-sm" placeholder="..." />
                        </div>

                        <button type="submit" className="w-full bg-white text-hris-primary font-bold py-3 hover:bg-hris-accent transition-colors rounded-sm focus:outline-none focus:ring-4 focus:ring-hris-accent/50">Akses Dashboard</button>
                    </form>
                </div>
            </div>
        </main>
    )
}