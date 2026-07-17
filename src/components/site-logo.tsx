// Logo mengambang di kiri-atas. Menampilkan versi yang sesuai tema situs
// lewat varian CSS `dark:` (tanpa JS, jadi tidak ada flash saat load).
export function SiteLogo() {
  return (
    <a
      href="#top"
      aria-label="Ke atas"
      className="fixed top-4 left-4 z-50 transition-transform hover:scale-105"
    >
      {/* Tema terang */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo/Logo_bg_light.png"
        alt="Logo"
        width={40}
        height={40}
        className="size-10 dark:hidden"
      />
      {/* Tema gelap */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo/Logo_bg_dark.png"
        alt="Logo"
        width={40}
        height={40}
        className="hidden size-10 dark:block"
      />
    </a>
  );
}
