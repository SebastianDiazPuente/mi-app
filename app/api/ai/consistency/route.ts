import { NextResponse } from "next/server";
import { MOCK_ALERTAS_CONSISTENCIA } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { texto, contexto } = body;

    return NextResponse.json({
      exito: true,
      alertas: MOCK_ALERTAS_CONSISTENCIA,
      resumen: `Análisis completado para la escena. Se cruzaron datos con ${contexto?.personajesIds?.length || 0} personajes y la ficha del lugar.`,
      palabrasAnalizadas: texto ? texto.trim().split(/\s+/).length : 0,
    });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : "Error al verificar consistencia";
    return NextResponse.json(
      {
        exito: false,
        alertas: [],
        resumen: mensaje,
      },
      { status: 500 }
    );
  }
}
