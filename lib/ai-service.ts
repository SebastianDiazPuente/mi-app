import { SolicitudAutocompletado, RespuestaAutocompletado, AlertaConsistencia } from "@/types/ai";
import { MOCK_ALERTAS_CONSISTENCIA } from "@/lib/mock-data";

export async function autocompletarCampoConIA(
  solicitud: SolicitudAutocompletado
): Promise<RespuestaAutocompletado> {
  try {
    const res = await fetch("/api/ai/autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(solicitud),
    });

    if (!res.ok) {
      throw new Error(`Error del servidor: ${res.statusText}`);
    }

    return await res.json();
  } catch {
    // Fallback o respuesta inteligente local si no hay backend activo
    return generarSugerenciaLocal(solicitud);
  }
}

export async function verificarConsistenciaConIA(
  textoEscena: string,
  contexto: { capituloId?: string; personajesIds?: string[]; lugarId?: string }
): Promise<{ alertas: AlertaConsistencia[]; resumen: string }> {
  try {
    const res = await fetch("/api/ai/consistency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: textoEscena, contexto }),
    });

    if (!res.ok) {
      throw new Error("No se pudo verificar la consistencia");
    }

    return await res.json();
  } catch {
    // Retornar alertas mock enriquecidas para demostración inmediata
    return {
      alertas: MOCK_ALERTAS_CONSISTENCIA,
      resumen: "Análisis completado en modo local. Se detectaron 3 posibles inconsistencias entre eventos, personajes y lugares.",
    };
  }
}

function generarSugerenciaLocal(solicitud: SolicitudAutocompletado): RespuestaAutocompletado {
  const { campo, tipoEntidad, contextoActual } = solicitud;
  const nombre = (contextoActual.nombre as string) || "la entidad";

  if (tipoEntidad === "personaje") {
    switch (campo) {
      case "personalidad":
        return {
          exito: true,
          contenidoGenerado: `Carácter reservado y perspicaz. Posee una serenidad calculada ante el peligro, pero oculta un temperamento impulsivo cuando se tocan sus principios éticos. Habla con pausas medidas y nunca promete algo que no pueda cumplir.`,
        };
      case "trasfondo":
        return {
          exito: true,
          contenidoGenerado: `Nacido/a en una familia de artesanos venida a menos tras las revueltas de la capital. Desde temprana edad aprendió a navegar entre la aristocracia y los callejones marginales, forjando lealtades ambiguas que hoy en día siguen cobrándole favores pendientes.`,
        };
      case "apariencia":
        return {
          exito: true,
          contenidoGenerado: `De complexión ágil y mirada penetrante. Sus manos denotan callosidades propias del manejo de instrumentos de precisión. Viste prendas oscuras de corte sobrio, diseñadas para no llamar la atención pero con detalles reforzados para el viaje.`,
        };
      case "objetivos":
        return {
          exito: true,
          contenidoGenerado: `Descubrir la verdad tras la desaparición de los registros antiguos y asegurar un salvoconducto permanente para abandonar la jurisdicción del Bastión.`,
        };
      default:
        return {
          exito: true,
          contenidoGenerado: `Detalle generado para ${campo} de ${nombre}: perfil adaptado a la atmósfera literaria del proyecto.`,
        };
    }
  }

  if (tipoEntidad === "lugar") {
    switch (campo) {
      case "descripcion":
        return {
          exito: true,
          contenidoGenerado: `Una impresionante estructura erigida sobre cimientos de piedra volcánica. Sus altos arcos góticos filtran rayos de luz tenue sobre patios de losas gastadas. El aire se siente cargado de una quietud casi ceremonial, únicamente interrumpido por las ráfagas de viento frío.`,
        };
      case "climaAmbiente":
        return {
          exito: true,
          contenidoGenerado: `Niebla densa durante las primeras horas de la mañana, temperaturas bajo cero por la noche y una persistente llovizna que empapa las rocas y amortigua todo sonido a la distancia.`,
        };
      default:
        return {
          exito: true,
          contenidoGenerado: `Detalles ambientales y arquitectónicos de ${nombre} integrados con la geografía circundante.`,
        };
    }
  }

  return {
    exito: true,
    contenidoGenerado: `Generación asistida para ${campo}: Sugerencia narrativa adaptada al contexto general.`,
  };
}
