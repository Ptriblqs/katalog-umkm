import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getCleanUrl() {
  const rawUrl = process.env.SUPABASE_URL || "";
  return rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

/**
 * Membuat client Supabase untuk koneksi server dengan kunci rahasia (SUPABASE_SECRET_KEY).
 * Digunakan untuk membaca katalog dan detail produk tanpa bergantung pada autentikasi pengunjung.
 */
export function createClient() {
  const supabaseUrl = getCleanUrl();
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "Konfigurasi Supabase belum lengkap. Pastikan SUPABASE_URL dan SUPABASE_SECRET_KEY sudah diisi di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Membuat client Supabase sesi admin memakai SUPABASE_PUBLISHABLE_KEY dan cookies (@supabase/ssr).
 * Digunakan untuk login, keluar, ganti password, dan aksi kelola produk.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();
  const supabaseUrl = getCleanUrl();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "Konfigurasi Supabase Auth belum lengkap. Pastikan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY sudah diisi di environment variable."
    );
  }

  return createSSRServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Dipanggil dari Server Component (read-only cookie context)
        }
      },
    },
  });
}

export const createServerClient = createClient;
export const createAuthClient = createSessionClient;
export default createClient;
