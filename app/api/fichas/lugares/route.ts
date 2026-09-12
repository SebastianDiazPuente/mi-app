import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { MOCK_LUGARES } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo");
  const busqueda = searchParams.get("q");

  if (!isSupabaseServerConfigured) {
    let filtrados = [...MOCK_LUGARES];
    if (tipo) {
      filtrados = filtrados.filter((l) => l.tipo.toLowerCase() === tipo.toLowerCase());
    }
    if (busqueda) {
      filtrados = filtrados.filter((l) =>
        l.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    return NextResponse.json({
      datos: filtrados,
      fuente: "local_mock",
      mensaje: "Mostrando datos locales porque Supabase aún no está configurado",
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Error al inicializar Supabase" }, { status: 500 });
  }

  let query = supabase.from("lugares").select("*").order("creado_en", { ascending: false });

  if (tipo) {
    query = query.eq("tipo", tipo);
  }
  if (busqueda) {
    query = query.ilike("nombre", `%${busqueda}%`);
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

    if (!cuerpo.nombre) {
      return NextResponse.json(
        { error: "El nombre del lugar es obligatorio" },
        { status: 400 }
      );
    }

    if (!isSupabaseServerConfigured) {
      const nuevo = {
        id: `lug-${Date.now()}`,
        ...cuerpo,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };
      return NextResponse.json({
        datos: nuevo,
        fuente: "local_mock",
        mensaje: "Lugar simulado (Supabase no configurado)",
      }, { status: 201 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("lugares")
      .insert([
        {
          nombre: cuerpo.nombre,
          tipo: cuerpo.tipo || "Ciudad",
          ubicacion_padre: cuerpo.ubicacionPadre || null,
          descripcion: cuerpo.descripcion || "",
          clima_ambiente: cuerpo.climaAmbiente || null,
          faccion_controladora_id: cuerpo.facciónControladoraId || null,
          faccion_controladora_nombre: cuerpo.facciónControladora || null,
          puntos_interes: cuerpo.puntosInteres || [],
          eventos_historicos: cuerpo.eventosHistoricos || [],
          notas_sensoriales: cuerpo.notasSensoriales || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ datos: data, fuente: "supabase" }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al registrar lugar";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
