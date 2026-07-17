import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Upload gambar diizinkan sampai 5MB (lihat upload-action.ts). Naikkan
      // limit body Server Actions dari default 1MB + sedikit headroom untuk
      // overhead multipart form.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
