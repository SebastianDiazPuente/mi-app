import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { MOCK_CAPITULOS } from "@/lib/mock-data";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params;

  if (!isSupabaseServerConfigured) {
    const escena = MOCK_CAPITULOS.flatMap((c) => c.escenas).find((e) => e.id === id);
    if (!escena) {
      return NextResponse.json({ error: "Escena no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ datos: escena, fuente: "local_mock" });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("escenas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Escena no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ datos: data, fuente: "supabase" });
}

export async function PUT(request: Request, { params }: RouteProps) {
  const { id } = await params;

  try {
    const cuerpo = await request.json();

    if (cuerpo.contenido !== undefined) {
      cuerpo.conteo_palabras = cuerpo.contenido.trim()
        ? cuerpo.contenido.trim().split(/\s+/).length
        : 0;
    }

    if (!isSupabaseServerConfigured) {
      return NextResponse.json({
        datos: { id, ...cuerpo, actualizado_en: new Date().toISOString() },
        fuente: "local_mock",
      });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("escenas")
      .update(cuerpo)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ datos: data, fuente: "supabase" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar escena";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const { id } = await params;

  if (!isSupabaseServerConfigured) {
    return NextResponse.json({
      exito: true,
      mensaje: `Escena ${id} eliminada (simulación local)`,
      fuente: "local_mock",
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }

  const { error } = await supabase
    .from("escenas")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exito: true, mensaje: "Escena eliminada correctamente", fuente: "supabase" });
}
