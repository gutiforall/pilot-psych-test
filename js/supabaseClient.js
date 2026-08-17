import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// La anon key de Supabase está pensada para ir en el cliente (protegida por
// las políticas RLS de supabase/schema.sql), así que es normal que estos
// valores queden en el repo público — no son un secreto.
const SUPABASE_URL = "TU_SUPABASE_URL_AQUI";
const SUPABASE_ANON_KEY = "TU_SUPABASE_ANON_KEY_AQUI";

export const isSupabaseConfigured = !SUPABASE_URL.includes("AQUI") && !SUPABASE_ANON_KEY.includes("AQUI");

export const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
