export interface Escena {
  id: string;
  capituloId: string;
  numero: number;
  titulo: string;
  resumen?: string;
  contenido: string;
  lugarId?: string;
  lugarNombre?: string;
  tiempoNarrativo?: string; // ej. "Día 4, Medianoche" o "Invierno del año 342"
  personajesInvolucradosIds: string[];
  conteoPalabras: number;
  estado: "Borrador" | "En revisión" | "Completada";
  creadoEn: string;
  actualizadoEn: string;
}

export interface Capitulo {
  id: string;
  numero: number;
  titulo: string;
  sinopsis?: string;
  escenas: Escena[];
  estado: "Esbozo" | "En progreso" | "Revisado" | "Finalizado";
  creadoEn: string;
  actualizadoEn: string;
}

export interface ProyectoLiterario {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  descripcion: string;
  objetivoPalabras?: number;
  capitulos: Capitulo[];
}
