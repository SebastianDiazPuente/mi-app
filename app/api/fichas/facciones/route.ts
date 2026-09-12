import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { MOCK_FACCIONES } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const alineamiento = searchParams.get("alineamiento");
  const busqueda = searchParams.get("q");

  if (!isSupabaseServerConfigured) {
    let filtrados = [...MOCK_FACCIONES];
    if (alineamiento) {
      filtrados = filtrados.filter((f) => f.tipoAlineamiento.toLowerCase() === alineamiento.toLowerCase());
    }
    if (busqueda) {
      filtrados = filtrados.filter((f) =>
        f.nombre.toLowerCase().includes(busqueda.toLowerCase())
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

  let query = supabase.from("facciones").select("*").order("creado_en", { ascending: false });

  if (alineamiento) {
    query = query.eq("tipo_alineamiento", alineamiento);
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
        { error: "El nombre de la facción es obligatorio" },
        { status: 400 }
      );
    }

    if (!isSupabaseServerConfigured) {
      const nuevo = {
        id: `fac-${Date.now()}`,
        ...cuerpo,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };
      return NextResponse.json({
        datos: nuevo,
        fuente: "local_mock",
        mensaje: "Facción simulada (Supabase no configurado)",
      }, { status: 201 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("facciones")
      .insert([
        {
          nombre: cuerpo.nombre,
          lema: cuerpo.lema || null,
          tipo_alineamiento: cuerpo.tipoAlineamiento || "Orden",
          sede_principal: cuerpo.sedePrincipal || null,
          ideologia_objetivos: cuerpo.ideologiaObjetivos || "",
          recursos_poder: cuerpo.recursosPoder || null,
          lideres: cuerpo.lideres || [],
          aliados: cuerpo.aliados || [],
          enemigos: cuerpo.enemigos || [],
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ datos: data, fuente: "supabase" }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al registrar facción";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
