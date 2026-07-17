"use server";

// Terjemahan gratis lewat endpoint publik Google Translate (gtx). Tidak resmi
// & tanpa API key — dipakai sebagai bantuan draft di admin. Kalau gagal,
// coba instance Lingva (proxy open-source untuk Google Translate).
const GOOGLE = "https://translate.googleapis.com/translate_a/single";
const LINGVA = "https://lingva.ml/api/v1";

async function viaGoogle(text: string, source: string, target: string) {
  const url = `${GOOGLE}?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`google ${res.status}`);
  const data = (await res.json()) as [Array<[string]>];
  return (data[0] ?? []).map((seg) => seg[0]).join("");
}

async function viaLingva(text: string, source: string, target: string) {
  const url = `${LINGVA}/${source}/${target}/${encodeURIComponent(text)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`lingva ${res.status}`);
  const data = (await res.json()) as { translation?: string };
  return data.translation ?? "";
}

export async function translateText(
  text: string,
  target: string,
  source = "id"
): Promise<{ text?: string; error?: string }> {
  if (!text.trim()) return { text: "" };
  if (source === target) return { text };

  try {
    return { text: await viaGoogle(text, source, target) };
  } catch {
    try {
      return { text: await viaLingva(text, source, target) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Gagal menerjemahkan" };
    }
  }
}
