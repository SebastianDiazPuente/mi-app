import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { MOCK_FACCIONES } from "@/lib/mock-data";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params;

  if (!isSupabaseServerConfigured) {
    const faccion = MOCK_FACCIONES.find((f) => f.id === id);
    if (!faccion) {
      return NextResponse.json({ error: "Facción no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ datos: faccion, fuente: "local_mock" });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("facciones")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Facción no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ datos: data, fuente: "supabase" });
}

export async function PUT(request: Request, { params }: RouteProps) {
  const { id } = await params;

  try {
    const cuerpo = await request.json();

    if (!isSupabaseServerConfigured) {
      return NextResponse.json({
        datos: { id, ...cuerpo, actualizado_en: new Date().toISOString() },
        fuente: "local_mock",
        mensaje: "Actualización simulada (Supabase no configurado)",
      });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("facciones")
      .update(cuerpo)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ datos: data, fuente: "supabase" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar facción";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const { id } = await params;

  if (!isSupabaseServerConfigured) {
    return NextResponse.json({
      exito: true,
      mensaje: `Facción ${id} eliminada (simulación local)`,
      fuente: "local_mock",
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }

  const { error } = await supabase
    .from("facciones")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exito: true, mensaje: "Facción eliminada correctamente", fuente: "supabase" });
}
