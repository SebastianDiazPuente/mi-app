"use client";

import { useState } from "react";
import { 
  Feather, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  Save, 
  RefreshCw, 
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Capitulo, Escena } from "@/types/editor";
import { AlertaConsistencia } from "@/types/ai";
import { 
  MOCK_CAPITULOS, 
  MOCK_PERSONAJES, 
  MOCK_LUGARES, 
  MOCK_ALERTAS_CONSISTENCIA 
} from "@/lib/mock-data";
import { verificarConsistenciaConIA } from "@/lib/ai-service";

export default function EditorPage() {
  const [capitulos, setCapitulos] = useState<Capitulo[]>(MOCK_CAPITULOS);
  const [escenaActiva, setEscenaActiva] = useState<Escena>(MOCK_CAPITULOS[0].escenas[0]);
  const [alertas, setAlertas] = useState<AlertaConsistencia[]>(MOCK_ALERTAS_CONSISTENCIA);
  const [verificando, setVerificando] = useState(false);
  const [generandoIA, setGenerandoIA] = useState(false);
  const [pestanaLateral, setPestanaLateral] = useState<"consistencia" | "asistente">("consistencia");
  const [guardadoReciente, setGuardadoReciente] = useState(false);

  // Conteo de palabras en tiempo real
  const conteoPalabras = escenaActiva.contenido.trim()
    ? escenaActiva.contenido.trim().split(/\s+/).length
    : 0;

  const handleTextoChange = (nuevoTexto: string) => {
    setEscenaActiva((prev) => ({
      ...prev,
      contenido: nuevoTexto,
      conteoPalabras: nuevoTexto.trim() ? nuevoTexto.trim().split(/\s+/).length : 0,
    }));
  };

  const handleGuardar = () => {
    setCapitulos((prev) =>
      prev.map((cap) => ({
        ...cap,
        escenas: cap.escenas.map((esc) =>
          esc.id === escenaActiva.id ? escenaActiva : esc
        ),
      }))
    );
    setGuardadoReciente(true);
    setTimeout(() => setGuardadoReciente(false), 2500);
  };

  const handleVerificarConsistencia = async () => {
    setVerificando(true);
    try {
      const res = await verificarConsistenciaConIA(escenaActiva.contenido, {
        capituloId: escenaActiva.capituloId,
        personajesIds: escenaActiva.personajesInvolucradosIds,
        lugarId: escenaActiva.lugarId,
      });
      setAlertas(res.alertas);
    } finally {
      setVerificando(false);
    }
  };

  const handleContinuarConIA = async () => {
    setGenerandoIA(true);
    setTimeout(() => {
      const continuacion = `\n\nEl silencio en la estancia se volvió insoportable. Un murmullo tenue provino del exterior, como si alguien estuviese examinando los cerrojos de la entrada con sigilo premeditado.`;
      const nuevoTexto = escenaActiva.contenido + continuacion;
      setEscenaActiva((prev) => ({
        ...prev,
        contenido: nuevoTexto,
        conteoPalabras: nuevoTexto.trim().split(/\s+/).length,
      }));
      setGenerandoIA(false);
    }, 1200);
  };

  const agregarNuevaEscena = (capituloId: string) => {
    const cap = capitulos.find((c) => c.id === capituloId);
    if (!cap) return;

    const numeroNuevaEscena = cap.escenas.length + 1;
    const nuevaEsc: Escena = {
      id: `esc-${capituloId}-${numeroNuevaEscena}`,
      capituloId,
      numero: numeroNuevaEscena,
      titulo: `Escena ${numeroNuevaEscena}`,
      contenido: "",
      lugarId: MOCK_LUGARES[0].id,
      lugarNombre: MOCK_LUGARES[0].nombre,
      tiempoNarrativo: "Mismo día, horas después",
      personajesInvolucradosIds: [MOCK_PERSONAJES[0].id],
      conteoPalabras: 0,
      estado: "Borrador",
      creadoEn: "2026-03-05",
      actualizadoEn: "2026-03-05",
    };

    setCapitulos((prev) =>
      prev.map((c) =>
        c.id === capituloId ? { ...c, escenas: [...c.escenas, nuevaEsc] } : c
      )
    );
    setEscenaActiva(nuevaEsc);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      {/* Barra de herramientas del Editor */}
      <div className="h-13 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Feather className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-zinc-500">Editor de Manuscrito</span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px] sm:max-w-xs">
            {escenaActiva.titulo}
          </span>
          <Badge variant={escenaActiva.estado === "Completada" ? "success" : "secondary"}>
            {escenaActiva.estado}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline-block">
            {conteoPalabras} palabras
          </span>

          <button
            onClick={handleGuardar}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
          >
            {guardadoReciente ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Guardado</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 text-zinc-500" />
                <span>Guardar</span>
              </>
            )}
          </button>

          <button
            onClick={handleContinuarConIA}
            disabled={generandoIA}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
          >
            {generandoIA ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>Continuar con IA</span>
          </button>
        </div>
      </div>

      {/* Contenedor Principal de 3 Paneles */}
      <div className="flex-1 flex min-h-0">
        {/* Panel 1: Lista de Capítulos y Escenas (Izquierda) */}
        <div className="w-72 flex-shrink-0 bg-zinc-50/70 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Índice de Capítulos
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {capitulos.map((cap) => (
              <div key={cap.id} className="space-y-1.5">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Capítulo {cap.numero}: {cap.titulo}
                  </span>
                  <button
                    onClick={() => agregarNuevaEscena(cap.id)}
                    title="Añadir escena"
                    className="p-1 text-zinc-400 hover:text-indigo-600 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-1 pl-2 border-l border-zinc-200 dark:border-zinc-800 ml-2">
                  {cap.escenas.map((esc) => {
                    const esActiva = esc.id === escenaActiva.id;
                    return (
                      <button
                        key={esc.id}
                        onClick={() => setEscenaActiva(esc)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between ${
                          esActiva
                            ? "bg-indigo-100/70 text-indigo-900 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40"
                        }`}
                      >
                        <span className="truncate mr-2">
                          {esc.numero}. {esc.titulo}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {esc.conteoPalabras}p
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Editor Central de Redacción */}
        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 overflow-hidden">
          {/* Ficha de Metadatos de la Escena (Contexto para IA) */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-zinc-400 block font-semibold">Escenario</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate block">
                  {escenaActiva.lugarNombre || "Sin lugar asignado"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-zinc-400 block font-semibold">Línea Temporal</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate block">
                  {escenaActiva.tiempoNarrativo || "No especificado"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-zinc-400 block font-semibold">Personajes Presentes</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate block">
                  {escenaActiva.personajesInvolucradosIds.length} personaje(s) en escena
                </span>
              </div>
            </div>
          </div>

          {/* Área de Escritura */}
          <div className="flex-1 p-6 overflow-y-auto">
            <input
              type="text"
              value={escenaActiva.titulo}
              onChange={(e) => setEscenaActiva({ ...escenaActiva, titulo: e.target.value })}
              className="w-full text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 border-none outline-none focus:ring-0 bg-transparent mb-4 placeholder-zinc-300"
              placeholder="Título de la escena..."
            />
            <textarea
              value={escenaActiva.contenido}
              onChange={(e) => handleTextoChange(e.target.value)}
              placeholder="Comenzá a escribir tu escena aquí... La IA vigilará en tiempo real que no contradigas el lore o la ubicación de tus personajes."
              className="w-full h-[calc(100%-4rem)] resize-none border-none outline-none focus:ring-0 bg-transparent text-sm sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 font-serif placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Panel 3: Asistente IA Lateral & Verificador de Consistencia (Derecha) */}
        <div className="w-80 flex-shrink-0 bg-zinc-50 dark:bg-zinc-900/60 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
          {/* Pestañas de Asistencia */}
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 flex gap-2">
            <button
              onClick={() => setPestanaLateral("consistencia")}
              className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 ${
                pestanaLateral === "consistencia"
                  ? "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Consistencia</span>
              <span className="text-[10px] px-1 rounded-full bg-amber-500/20">{alertas.length}</span>
            </button>

            <button
              onClick={() => setPestanaLateral("asistente")}
              className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 ${
                pestanaLateral === "asistente"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ideas & IA</span>
            </button>
          </div>

          {/* Contenido de la Pestaña Lateral */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {pestanaLateral === "consistencia" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Conflictos Detectados
                  </span>
                  <button
                    onClick={handleVerificarConsistencia}
                    disabled={verificando}
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <RefreshCw className={`h-3 w-3 ${verificando ? "animate-spin" : ""}`} />
                    <span>Escanear</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {alertas.map((alerta) => (
                    <div
                      key={alerta.id}
                      className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            alerta.severidad === "Crítico"
                              ? "danger"
                              : alerta.severidad === "Advertencia"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {alerta.severidad}
                        </Badge>
                        <span className="text-[10px] text-zinc-400">{alerta.categoria}</span>
                      </div>

                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {alerta.titulo}
                      </h4>

                      <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                        {alerta.descripcion}
                      </p>

                      {alerta.sugerenciaResolucion && (
                        <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-amber-200/60 dark:border-amber-900/30 text-[11px] text-indigo-900 dark:text-indigo-300">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            Sugerencia:{" "}
                          </span>
                          {alerta.sugerenciaResolucion}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Asistente de Redacción
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Sugerencias estilísticas y ganchos argumentales basados en las fichas de tu mundo.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleContinuarConIA}
                    className="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 transition text-xs space-y-1"
                  >
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                      Añadir giro imprevisto
                    </span>
                    <p className="text-zinc-500 text-[11px]">
                      Introduce una complicación física o moral coherente con el antagonista.
                    </p>
                  </button>

                  <button
                    onClick={handleContinuarConIA}
                    className="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 transition text-xs space-y-1"
                  >
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                      Sensaciones del Lugar
                    </span>
                    <p className="text-zinc-500 text-[11px]">
                      Inyecta la niebla y aromas salinos de Valdoris en la escena actual.
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
