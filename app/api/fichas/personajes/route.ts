import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { MOCK_PERSONAJES } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rol = searchParams.get("rol");
  const busqueda = searchParams.get("q");

  if (!isSupabaseServerConfigured) {
    let filtrados = [...MOCK_PERSONAJES];
    if (rol) {
      filtrados = filtrados.filter((p) => p.rol.toLowerCase() === rol.toLowerCase());
    }
    if (busqueda) {
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.alias?.toLowerCase().includes(busqueda.toLowerCase())
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

  let query = supabase.from("personajes").select("*").order("creado_en", { ascending: false });

  if (rol) {
    query = query.eq("rol", rol);
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
        { error: "El nombre del personaje es obligatorio" },
        { status: 400 }
      );
    }

    if (!isSupabaseServerConfigured) {
      // Fallback local: devolvemos el objeto simulando creación
      const nuevo = {
        id: `per-${Date.now()}`,
        ...cuerpo,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
      };
      return NextResponse.json({
        datos: nuevo,
        fuente: "local_mock",
        mensaje: "Personaje simulado (Supabase no configurado)",
      }, { status: 201 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("personajes")
      .insert([
        {
          nombre: cuerpo.nombre,
          alias: cuerpo.alias || null,
          rol: cuerpo.rol || "Secundario",
          edad: cuerpo.edad || null,
          ocupacion: cuerpo.ocupacion || null,
          faccion_id: cuerpo.faccionId || null,
          faccion_nombre: cuerpo.faccionNombre || null,
          apariencia: cuerpo.apariencia || "",
          personalidad: cuerpo.personalidad || "",
          trasfondo: cuerpo.trasfondo || "",
          objetivos: cuerpo.objetivos || "",
          miedos_debilidades: cuerpo.miedosDebilidades || null,
          relaciones: cuerpo.relaciones || [],
          notas_privadas: cuerpo.notasPrivadas || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ datos: data, fuente: "supabase" }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al crear personaje";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
