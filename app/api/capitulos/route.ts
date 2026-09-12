import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { MOCK_CAPITULOS } from "@/lib/mock-data";

export async function GET() {
  if (!isSupabaseServerConfigured) {
    return NextResponse.json({
      datos: MOCK_CAPITULOS,
      fuente: "local_mock",
      mensaje: "Mostrando capítulos locales (Supabase no configurado)",
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Error al inicializar Supabase" }, { status: 500 });
  }

  // Trae capítulos con sus escenas anidadas ordenadas por número
  const { data, error } = await supabase
    .from("capitulos")
    .select("*, escenas(*)")
    .order("numero", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ datos: data, fuente: "supabase" });
}

export async function POST(request: Request) {
  try {
    const cuerpo = await request.json();

    if (!cuerpo.titulo) {
      return NextResponse.json(
        { error: "El título del capítulo es obligatorio" },
        { status: 400 }
      );
    }

    if (!isSupabaseServerConfigured) {
      const nuevo = {
        id: `cap-${Date.now()}`,
        numero: cuerpo.numero || 1,
        titulo: cuerpo.titulo,
        sinopsis: cuerpo.sinopsis || "",
        estado: cuerpo.estado || "Esbozo",
        escenas: [],
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };
      return NextResponse.json({
        datos: nuevo,
        fuente: "local_mock",
      }, { status: 201 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("capitulos")
      .insert([
        {
          proyecto_id: cuerpo.proyectoId || null,
          numero: cuerpo.numero || 1,
          titulo: cuerpo.titulo,
          sinopsis: cuerpo.sinopsis || null,
          estado: cuerpo.estado || "Esbozo",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ datos: data, fuente: "supabase" }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al registrar capítulo";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
