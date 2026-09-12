import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseServerConfigured) {
    return NextResponse.json({
      configurado: false,
      conectado: false,
      mensaje: "Las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY no están definidas en .env.local",
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({
      configurado: false,
      conectado: false,
      mensaje: "No se pudo inicializar el cliente de Supabase",
    });
  }

  try {
    // Intento de consulta leve para verificar conectividad
    const { error } = await supabase
      .from("facciones")
      .select("count", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        configurado: true,
        conectado: false,
        mensaje: `Error al consultar Supabase: ${error.message}. Asegurate de haber ejecutado el script 'supabase/schema.sql'.`,
      });
    }

    return NextResponse.json({
      configurado: true,
      conectado: true,
      mensaje: "Conexión a la base de datos de Supabase establecida exitosamente.",
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido al conectar con Supabase";
    return NextResponse.json({
      configurado: true,
      conectado: false,
      mensaje: errorMsg,
    });
  }
}
