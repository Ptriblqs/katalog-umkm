import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Membuat client Supabase untuk koneksi server dengan kunci rahasia (SUPABASE_SECRET_KEY).
 * Digunakan untuk membaca katalog dan detail produk tanpa bergantung pada autentikasi pengunjung.
 */
export function createClient() {
  const rawUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!rawUrl || !secretKey) {
    throw new Error(
      "Konfigurasi Supabase belum lengkap. Pastikan SUPABASE_URL dan SUPABASE_SECRET_KEY sudah diisi di environment variable."
    );
  }

  // Normalisasi URL jika terdapat akhiran /rest/v1 atau trailing slash
  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  return createSupabaseClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createClient;
export default createClient;

