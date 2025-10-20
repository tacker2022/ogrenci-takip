export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Öğrenci Takip</h1>
        <p className="text-base sm:text-lg text-black/70 dark:text-white/70">
          Öğrencileri, sınıfları ve devamsızlıkları takip edeceğiniz basit bir başlangıç
          sayfası. Aşağıdaki bağlantılardan ilgili bölümlere geçebilirsiniz.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/ogrenciler"
            className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-4 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors text-left"
          >
            <div className="text-lg font-semibold">Öğrenciler</div>
            <div className="text-sm text-black/70 dark:text-white/70">Öğrenci listesi ve detaylar</div>
          </a>
          <a
            href="/siniflar"
            className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-4 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors text-left"
          >
            <div className="text-lg font-semibold">Sınıflar</div>
            <div className="text-sm text-black/70 dark:text-white/70">Sınıf bazında takip</div>
          </a>
        </div>
      </div>
    </main>
  );
}
