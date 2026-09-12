export type RolPersonaje = "Protagonista" | "Antagonista" | "Secundario" | "De reparto" | "Histórico";

export interface RelacionPersonaje {
  personajeId: string;
  nombrePersonaje: string;
  tipo: "Aliado" | "Enemigo" | "Familiar" | "Mentor" | "Amante" | "Rival" | "Neutro";
  descripcion: string;
}

export interface Personaje {
  id: string;
  nombre: string;
  alias?: string;
  rol: RolPersonaje;
  edad?: string | number;
  ocupacion?: string;
  facciónId?: string;
  facciónNombre?: string;
  apariencia: string;
  personalidad: string;
  trasfondo: string;
  objetivos: string;
  miedosDebilidades?: string;
  relaciones: RelacionPersonaje[];
  notasPrivadas?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export type TipoLugar = "Ciudad" | "Reino" | "Edificación / Fortaleza" | "Paraje Natural" | "Región" | "Taberna / Posada" | "Otro";

export interface Lugar {
  id: string;
  nombre: string;
  tipo: TipoLugar;
  ubicacionPadre?: string;
  descripcion: string;
  climaAmbiente?: string;
  facciónControladora?: string;
  puntosInteres?: string[];
  eventosHistoricos?: string[];
  notasSensoriales?: string; // Olores, sonidos característicos
  creadoEn: string;
  actualizadoEn: string;
}

export type AlineamientoFaccion = "Orden" | "Rebelión" | "Neutro" | "Caos" | "Gremial" | "Religioso" | "Militar";

export interface Faccion {
  id: string;
  nombre: string;
  lema?: string;
  tipoAlineamiento: AlineamientoFaccion;
  lideres: string[];
  sedePrincipal?: string;
  ideologiaObjetivos: string;
  recursosPoder?: string;
  aliados: string[];
  enemigos: string[];
  creadoEn: string;
  actualizadoEn: string;
}
