import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { MOCK_CAPITULOS } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const capituloId = searchParams.get("capituloId");

  if (!isSupabaseServerConfigured) {
    const todasLasEscenas = MOCK_CAPITULOS.flatMap((c) => c.escenas);
    const filtradas = capituloId
      ? todasLasEscenas.filter((e) => e.capituloId === capituloId)
      : todasLasEscenas;

    return NextResponse.json({
      datos: filtradas,
      fuente: "local_mock",
      mensaje: "Mostrando escenas locales (Supabase no configurado)",
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Error al inicializar Supabase" }, { status: 500 });
  }

  let query = supabase.from("escenas").select("*").order("numero", { ascending: true });

  if (capituloId) {
    query = query.eq("capitulo_id", capituloId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ datos: data, fuente: "supabase" });
}

export async function POST(request: Request) {
  try {
    const cuerpo = await request.json();

    if (!cuerpo.capituloId || !cuerpo.titulo) {
      return NextResponse.json(
        { error: "El capituloId y el título de la escena son obligatorios" },
        { status: 400 }
      );
    }

    const conteoPalabras = cuerpo.contenido ? cuerpo.contenido.trim().split(/\s+/).length : 0;

    if (!isSupabaseServerConfigured) {
      const nueva = {
        id: `esc-${Date.now()}`,
        capituloId: cuerpo.capituloId,
        numero: cuerpo.numero || 1,
        titulo: cuerpo.titulo,
        contenido: cuerpo.contenido || "",
        lugarId: cuerpo.lugarId || null,
        lugarNombre: cuerpo.lugarNombre || null,
        tiempoNarrativo: cuerpo.tiempoNarrativo || null,
        personajesInvolucradosIds: cuerpo.personajesInvolucradosIds || [],
        conteoPalabras,
        estado: cuerpo.estado || "Borrador",
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };
      return NextResponse.json({
        datos: nueva,
        fuente: "local_mock",
      }, { status: 201 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("escenas")
      .insert([
        {
          capitulo_id: cuerpo.capituloId,
          numero: cuerpo.numero || 1,
          titulo: cuerpo.titulo,
          resumen: cuerpo.resumen || null,
          contenido: cuerpo.contenido || "",
          lugar_id: cuerpo.lugarId || null,
          lugar_nombre: cuerpo.lugarNombre || null,
          tiempo_narrativo: cuerpo.tiempoNarrativo || null,
          personajes_involucrados_ids: cuerpo.personajesInvolucradosIds || [],
          conteo_palabras: conteoPalabras,
          estado: cuerpo.estado || "Borrador",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ datos: data, fuente: "supabase" }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al registrar escena";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
