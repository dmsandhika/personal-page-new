import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Gambar dikompres di browser sebelum upload (lihat lib/compress-image.ts),
      // jadi body biasanya kecil. Limit dinaikkan sebagai headroom kalau kompresi
      // gagal untuk file sangat besar, biar errornya jelas dari validasi upload.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
