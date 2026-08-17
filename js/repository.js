import { supabase, isSupabaseConfigured } from "./supabaseClient.js";

const ORG = "APEX SYNDICATE";

async function getOrCreatePiloto(nombre) {
  const { data: existing, error: selectError } = await supabase
    .from("pilotos")
    .select("id")
    .ilike("nombre", nombre)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing.id;

  const { data: created, error: insertError } = await supabase
    .from("pilotos")
    .insert({ nombre, org: ORG })
    .select("id")
    .single();

  if (insertError) throw insertError;
  return created.id;
}

export async function saveResult({ nombre, scores, respuestaDudosa, answers }) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase no está configurado todavía (ver js/supabaseClient.js).");
  }

  const pilotoId = await getOrCreatePiloto(nombre);

  const { error } = await supabase.from("resultados_test").insert({
    piloto_id: pilotoId,
    puntuacion_aire: scores.percentages.aire,
    puntuacion_agua: scores.percentages.agua,
    puntuacion_tierra: scores.percentages.tierra,
    puntuacion_fuego: scores.percentages.fuego,
    respuesta_dudosa: respuestaDudosa,
    respuestas_crudas: answers,
  });

  if (error) throw error;
}
