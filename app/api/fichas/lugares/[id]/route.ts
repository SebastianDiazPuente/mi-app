import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { MOCK_LUGARES } from "@/lib/mock-data";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params;

  if (!isSupabaseServerConfigured) {
    const lugar = MOCK_LUGARES.find((l) => l.id === id);
    if (!lugar) {
      return NextResponse.json({ error: "Lugar no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ datos: lugar, fuente: "local_mock" });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("lugares")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Lugar no encontrado" }, { status: 404 });
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
      .from("lugares")
      .update(cuerpo)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ datos: data, fuente: "supabase" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar lugar";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const { id } = await params;

  if (!isSupabaseServerConfigured) {
    return NextResponse.json({
      exito: true,
      mensaje: `Lugar ${id} eliminado (simulación local)`,
      fuente: "local_mock",
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }

  const { error } = await supabase
    .from("lugares")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exito: true, mensaje: "Lugar eliminado correctamente", fuente: "supabase" });
}
