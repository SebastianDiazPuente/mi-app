export type NivelSeveridadConsistencia = "Crítico" | "Advertencia" | "Sugerencia";

export type CategoriaInconsistencia = 
  | "Lugar y Distancia"
  | "Línea Temporal"
  | "Lore / Canon"
  | "Personalidad o Rasgo"
  | "Estado Físico / Muerte";

export interface AlertaConsistencia {
  id: string;
  categoria: CategoriaInconsistencia;
  severidad: NivelSeveridadConsistencia;
  titulo: string;
  descripcion: string;
  fragmentoAfectado?: string;
  sugerenciaResolucion?: string;
  entidadesInvolucradas: {
    tipo: "Personaje" | "Lugar" | "Facción" | "Tiempo";
    id?: string;
    nombre: string;
  }[];
}

export type ProveedorIA = "gemini" | "openai" | "anthropic" | "ollama" | "personalizado";

export interface ConfiguracionIA {
  proveedor: ProveedorIA;
  apiKey?: string;
  baseUrl?: string;
  modelo: string;
  temperatura: number;
  conectado: boolean;
}

export interface SolicitudAutocompletado {
  campo: string; // ej. "personalidad", "trasfondo", "continuar_escena"
  tipoEntidad: "personaje" | "lugar" | "faccion" | "escena";
  contextoActual: Record<string, unknown>;
  indicacionesUsuario?: string;
}

export interface RespuestaAutocompletado {
  exito: boolean;
  contenidoGenerado: string;
  mensajeError?: string;
}
