---
name: ui-design
description: Buat atau refine UI React/Next.js dengan desain yang punya karakter — bukan tampilan generik AI. Aktifkan saat diminta buat komponen UI, halaman baru, layout, atau refine desain yang terasa terlalu template. Termasuk saat ada kata: "buat halaman", "desain komponen", "tampilan", "UI", atau "layout".
---

# Skill: UI Design Tanpa AI Slop

> Referensi: anthropics/skills `frontend-design`, addyosmani/agent-skills `frontend-ui-engineering`, design-md protocol

Desain yang baik punya identitas yang tidak bisa disalahartikan. AI coding agent secara default
menghasilkan tampilan yang sama: card rounded-2xl, gradient biru-ungu, stat besar dengan label kecil,
tombol dengan arrow icon, dan layout grid seragam. Skill ini mengajarkan cara keluar dari semua itu.

---

## FASE 1 — Tentukan Identitas (Wajib, Sebelum Kode)

Terinspirasi dari **anthropics/frontend-design**: *"Approach this as the design lead at a small studio
known for giving every client a visual identity that could not be mistaken for anyone else's."*

Sebelum menulis satu baris kode, jawab dan tulis sebagai komentar:

```
// === DESIGN BRIEF ===
// Produk    : [nama dan apa yang dilakukan]
// Audiens   : [siapa yang akan memakainya]
// Satu kata : [presisi / hangat / berani / playful / serius]
// Signature : [satu elemen unik yang membuat halaman ini tak terlupakan]
// Referensi : [bukan "modern" — sebutkan sesuatu yang konkret]
```

Jika brief tidak menyebutkan visual direction → tentukan sendiri, pilih sesuatu spesifik, dan justifikasi.

---

## FASE 2 — Buat Design Token System

Terinspirasi dari **design-md protocol**: token harus machine-readable dan human-understandable.

Definisikan token di `tailwind.config.ts` atau sebagai CSS variables, bukan ambil dari default Tailwind begitu saja:

```ts
// tailwind.config.ts — contoh token yang disengaja
colors: {
  brand: {
    primary:   '#1B4332', // hijau tua — bukan teal generic
    accent:    '#D4A853', // emas — satu accent, dipakai dengan hemat
    surface:   '#F9F6EF', // krem hangat — bukan putih murni
    muted:     '#6B7280',
  },
  // Semantic tokens — ikuti ini, bukan raw hex di komponen
  text: {
    primary:   'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
  },
  bg: {
    surface:   'var(--color-bg-surface)',
    elevated:  'var(--color-bg-elevated)',
  },
},
fontFamily: {
  display: ['"Playfair Display"', 'Georgia', 'serif'], // karakterful, untuk heading
  body:    ['"DM Sans"', 'system-ui', 'sans-serif'],   // readable, untuk body
  mono:    ['"JetBrains Mono"', 'monospace'],          // untuk kode/data
},
```

**Aturan warna:**
- Gunakan **semantic color tokens** (`text-primary`, `bg-surface`) — bukan raw hex di JSX
- Kontras minimum: 4.5:1 untuk teks normal, 3:1 untuk teks besar (WCAG AA)
- Jangan andalkan warna saja untuk menyampaikan informasi — tambahkan ikon atau teks

---

## FASE 3 — Wireframe ASCII Sebelum Build

Layout adalah keputusan informasi, bukan dekorasi. Buat wireframe dulu:

```
┌──────────────────────────────────────────┐
│  Logo                    [Nav] [CTA]     │
├──────────────────────────────────────────┤
│                                          │
│  [Headline — thesis terkuat produk]      │
│  [Subtext — satu kalimat, konkret]       │
│                                          │
│  [Primary CTA]    [Secondary (opsional)] │
│                                          │
├──────────────────────────────────────────┤
│  Content section — layout sesuai data   │
└──────────────────────────────────────────┘
```

Wireframe = kontrak. Jangan skip. Grid hanya jika konten memang setara dan paralel.

---

## FASE 4 — Hindari AI Aesthetic (Tabel Referensi)

Terinspirasi dari **addyosmani/frontend-ui-engineering** — tabel lengkap pattern yang harus dihindari:

| AI Default | Mengapa Bermasalah | Alternatif Production-Quality |
|---|---|---|
| Gradient ungu/biru di hero | 80% SaaS AI pakai ini — tidak punya identitas | Warna solid berani, tekstur, atau tipografi murni |
| `rounded-2xl` di semua card | Pilihan default Tailwind, bukan keputusan | Border-radius konsisten dari design system |
| `shadow-sm` di semua card | Depth noise yang bersaing dengan konten | Shadow hanya jika design system menetapkannya |
| Grid 3 kolom seragam | Layout shortcut yang abaikan prioritas informasi | Layout sesuai hierarki konten |
| Stat besar + label kecil di bawah | Template yang semua orang pakai | Visualisasi data dengan cara yang relevan konteks |
| Icon arrow `→` di semua tombol | Tidak informatif | Teks spesifik, atau icon yang relevan aksi |
| Padding besar merata di semua section | Hancurkan hierarki visual | Spacing scale konsisten dari 4/8px grid |
| Cream `#F4F1EA` + serif + terracotta | Satu dari 3 AI look yang paling umum | Pilih jika memang sesuai brief, bukan karena default |
| Near-black + acid-green/vermilion | AI look #2 yang sangat umum | Sama — boleh jika memang sesuai, tidak jika tidak |
| Hairline rules + broadsheet layout | AI look #3 | Idem |
| Lorem ipsum | Sembunyikan masalah layout nyata | Konten representatif dari awal |
| "Get Started" / "Learn More →" | Tidak bilang apa yang didapat user | "Mulai Proyek Pertama", "Coba Gratis 14 Hari" |
| Foto stock orang tersenyum | Tidak punya identitas | Screenshot nyata, ilustrasi, atau abstract graphic |

**Calibration:** Tiga look paling umum di atas *bisa* dipakai — tapi hanya jika brief memang memintanya,
bukan karena itu pilihan defaultmu.

---

## FASE 5 — Arsitektur Komponen (Referensi addyosmani)

### Struktur File — Colocate

```
src/components/
  FeatureName/
    FeatureName.tsx        # Implementasi
    FeatureName.test.tsx   # Test
    use-feature-name.ts    # Hook jika state kompleks
    types.ts               # Types jika banyak
```

### Pola Komposisi (Bukan Konfigurasi)

```tsx
// ✅ Composable — fleksibel dan readable
<Card>
  <CardHeader><CardTitle>Judul</CardTitle></CardHeader>
  <CardBody><Content /></CardBody>
</Card>

// ❌ Over-configured — sulit di-extend
<Card title="Judul" headerVariant="large" bodyPadding="md" content={<Content />} />
```

### Pisah Data dari Tampilan

```tsx
// Container — ambil data, handle states
export function TaskListContainer() {
  const { data, isLoading, error, refetch } = useTasks()
  if (isLoading) return <TaskListSkeleton />
  if (error) return <ErrorState message="Gagal memuat" retry={refetch} />
  if (!data?.length) return <EmptyState message="Belum ada task" onAction={handleCreate} />
  return <TaskList tasks={data} />
}

// Presentasi — hanya render, tidak tahu soal fetching
export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul role="list" className="divide-y divide-border-default">
      {tasks.map(task => <TaskItem key={task.id} task={task} />)}
    </ul>
  )
}
```

---

## FASE 6 — Aksesibilitas (WCAG 2.1 AA — Wajib)

Bukan nice-to-have. Di banyak jurisdiksi ini kewajiban hukum.

```tsx
// ✅ Keyboard accessible
<button onClick={handleClick}>Simpan</button>

// ❌ Tidak bisa diakses keyboard
<div onClick={handleClick}>Simpan</div>

// Label gambar
<button aria-label="Tutup dialog"><XIcon /></button>

// Label form — SELALU pakai htmlFor, bukan placeholder saja
<label htmlFor="email">Email</label>
<input id="email" type="email" placeholder="nama@domain.com" />

// Focus management saat modal terbuka
useEffect(() => {
  if (isOpen) closeButtonRef.current?.focus()
}, [isOpen])
```

**Cek aksesibilitas:**
- Tab melalui semua halaman — setiap elemen interaktif harus terjangkau
- Screen reader harus bisa menyampaikan struktur dan konten
- Jangan andalkan warna saja (merah/hijau tanpa teks/ikon)

---

## FASE 7 — States yang Sering Dilupakan

Setiap komponen yang fetch data harus handle semua state ini:

```tsx
// Loading — skeleton, bukan spinner untuk konten besar
function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat..." className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="h-12 bg-bg-muted animate-pulse rounded" />
      ))}
    </div>
  )
}

// Error — dengan aksi recovery
function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div role="alert" className="text-center py-12">
      <p className="text-text-secondary">{message}</p>
      {retry && <button onClick={retry} className="mt-4">Coba Lagi</button>}
    </div>
  )
}

// Empty — arahkan ke aksi, bukan hanya teks
function EmptyState({ message, onAction }: { message: string; onAction?: () => void }) {
  return (
    <div role="status" className="text-center py-12">
      <p className="text-text-secondary">{message}</p>
      {onAction && <button onClick={onAction} className="mt-4">Buat Sekarang</button>}
    </div>
  )
}
```

---

## FASE 8 — Teks dalam Desain (Referensi anthropics/frontend-design)

Teks adalah material desain, bukan dekorasi.

- **Tulis dari sisi user** — "Kelola notifikasi", bukan "Konfigurasi webhook"
- **Voice aktif** — "Simpan Perubahan", bukan "Submit"
- **Konsisten** — tombol "Publikasikan" → toast "Berhasil dipublikasikan"
- **Error: spesifik + actionable** — "Email tidak valid" bukan "Terjadi kesalahan"
- **Empty state = undangan aksi** — "Belum ada proyek. Buat proyek pertamamu."
- **Sentence case** — bukan Title Case Di Setiap Kata

---

## Checklist Akhir Sebelum Deliver

```
IDENTITAS
[ ] Brief tertulis sebagai komentar (produk, audiens, signature)
[ ] Design token didefinisikan — bukan ambil dari default

VISUAL
[ ] Tidak ada satu pun pola dari tabel AI Aesthetic di atas (atau ada justifikasi)
[ ] Spacing dari 4/8px grid — tidak ada nilai arbitrary (13px, 2.3rem)
[ ] Tipografi punya hierarki jelas (h1 → h2 → body → small)
[ ] Warna: semantic token, kontras cukup, tidak andalkan warna saja

ENGINEERING
[ ] Komponen < 200 baris — jika lebih, pecah
[ ] Tidak ada inline styles (kecuali nilai dinamis)
[ ] Semua state dihandle: loading, error, empty, success
[ ] Tidak ada console.error saat render

AKSESIBILITAS
[ ] Keyboard navigation berfungsi (Tab melalui seluruh halaman)
[ ] Semua gambar/ikon punya aria-label
[ ] Semua input punya label terhubung (htmlFor)
[ ] Focus management benar saat modal/dialog

RESPONSIF
[ ] 375px (mobile) — tidak ada overflow horizontal
[ ] 768px (tablet)
[ ] 1280px (desktop)
[ ] Dark mode jika project mendukung

KONTEN
[ ] Tidak ada Lorem Ipsum — semua teks representatif
[ ] CTA spesifik — bukan "Get Started" atau "Learn More"
[ ] Error message actionable
```

---

## Output yang Diharapkan

Setiap output harus menyertakan:

1. **Design brief** (komentar singkat: produk, audiens, signature element, justifikasi pilihan)
2. **Kode komponen lengkap** menggunakan semantic tokens dan pola yang benar
3. **Catatan** jika ada yang perlu dikonfigurasi (font import, image nyata, env variable)

Jika ada pilihan desain yang tidak obvious → jelaskan mengapa itu pilihan yang tepat untuk brief ini,
bukan hanya apa yang dilakukan.
