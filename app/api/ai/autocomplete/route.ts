import { NextResponse } from "next/server";
import { SolicitudAutocompletado, RespuestaAutocompletado } from "@/types/ai";

export async function POST(request: Request) {
  try {
    const body: SolicitudAutocompletado = await request.json();
    const { campo, tipoEntidad, contextoActual } = body;

    let generado = "";

    if (tipoEntidad === "personaje") {
      const nombre = (contextoActual?.nombre as string) || "el personaje";
      if (campo === "personalidad") {
        generado = `Personalidad compleja y reservada para ${nombre}. Muestra una serenidad imperturbable ante situaciones de peligro inminente, con una marcada aversión a la mentira y un sentido del honor moldeado por pérdidas pasadas.`;
      } else if (campo === "trasfondo") {
        generado = `Nacido en los límites meridionales del imperio, ${nombre} sobrevivió a las purgas iniciales ocultando su verdadera herencia. Formado en las disciplinas del códice antiguo antes de verse forzado a la clandestinidad.`;
      } else if (campo === "apariencia") {
        generado = `Complexión atlética y enjuta, mirada de iris pálido que parece estudiar cada detalle. Porta un sayo de viaje con costuras reforzadas de cuero y un relicario de bronce oxidado colgado del cuello.`;
      } else if (campo === "objetivos") {
        generado = `Descifrar el mecanismo de las Bóvedas de Éter y encontrar pruebas para exonerar a sus aliados antes de la próxima luna de cosecha.`;
      } else {
        generado = `Detalles narrativos enriquecidos para el campo "${campo}" de ${nombre}.`;
      }
    } else if (tipoEntidad === "lugar") {
      const nombreLugar = (contextoActual?.nombre as string) || "el lugar";
      if (campo === "descripcion") {
        generado = `Un enclave amurallado al borde del abismo marino. Sus calzadas de piedra oscura resuenan con el eco constante de las olas y el aire transporta el vaho gélido de las corrientes del norte.`;
      } else if (campo === "climaAmbiente") {
        generado = `Vientos racheados constantes procedentes del acantilado, niebla matinal densa y temperaturas que descienden abruptamente tras el ocaso.`;
      } else {
        generado = `Ambientación detallada para ${nombreLugar}.`;
      }
    } else if (tipoEntidad === "faccion") {
      const nombreFac = (contextoActual?.nombre as string) || "la facción";
      if (campo === "ideologiaObjetivos") {
        generado = `Doctrina estricta basada en el equilibrio de fuerzas. Defienden que ningún poder arcano debe concentrarse en una sola dinastía, buscando restaurar los concilios independientes.`;
      } else {
        generado = `Detalles organizativos y recursos para ${nombreFac}.`;
      }
    } else {
      generado = `Continuación narrativa generada con estilo literario coherente.`;
    }

    const respuesta: RespuestaAutocompletado = {
      exito: true,
      contenidoGenerado: generado,
    };

    return NextResponse.json(respuesta);
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : "Error al procesar la solicitud de autocompletado";
    return NextResponse.json(
      {
        exito: false,
        contenidoGenerado: "",
        mensajeError: mensaje,
      },
      { status: 500 }
    );
  }
}
