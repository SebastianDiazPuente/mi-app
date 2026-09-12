"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Compass, 
  Plus, 
  Sparkles, 
  Search, 
  ArrowLeft, 
  Loader2,
  MapPin,
  CloudSun
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lugar, TipoLugar } from "@/types/fichas";
import { MOCK_LUGARES } from "@/lib/mock-data";
import { autocompletarCampoConIA } from "@/lib/ai-service";

export default function LugaresPage() {
  const [lugares, setLugares] = useState<Lugar[]>(MOCK_LUGARES);
  const [seleccionado, setSeleccionado] = useState<Lugar>(MOCK_LUGARES[0]);
  const [busqueda, setBusqueda] = useState("");
  const [cargandoCampo, setCargandoCampo] = useState<string | null>(null);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  const [nuevoLugar, setNuevoLugar] = useState<Partial<Lugar>>({
    nombre: "",
    tipo: "Ciudad",
    descripcion: "",
    climaAmbiente: "",
    facciónControladora: "",
    notasSensoriales: "",
  });

  const lugaresFiltrados = lugares.filter((l) =>
    l.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAutocompletar = async (campo: "descripcion" | "climaAmbiente", esFormularioNuevo = false) => {
    setCargandoCampo(campo);
    try {
      const contexto = esFormularioNuevo ? nuevoLugar : seleccionado;
      const res = await autocompletarCampoConIA({
        campo,
        tipoEntidad: "lugar",
        contextoActual: contexto as Record<string, unknown>,
      });

      if (res.exito) {
        if (esFormularioNuevo) {
          setNuevoLugar((prev) => ({ ...prev, [campo]: res.contenidoGenerado }));
        } else {
          setSeleccionado((prev) => ({ ...prev, [campo]: res.contenidoGenerado }));
          setLugares((prev) =>
            prev.map((l) => (l.id === seleccionado.id ? { ...l, [campo]: res.contenidoGenerado } : l))
          );
        }
      }
    } finally {
      setCargandoCampo(null);
    }
  };

  const guardarNuevo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoLugar.nombre) return;

    const creado: Lugar = {
      id: `lug-${lugares.length + 1}`,
      nombre: nuevoLugar.nombre,
      tipo: (nuevoLugar.tipo as TipoLugar) || "Ciudad",
      descripcion: nuevoLugar.descripcion || "Sin descripción",
      climaAmbiente: nuevoLugar.climaAmbiente || "",
      facciónControladora: nuevoLugar.facciónControladora || "Neutral",
      notasSensoriales: nuevoLugar.notasSensoriales || "",
      puntosInteres: [],
      eventosHistoricos: [],
      creadoEn: "2026-03-05",
      actualizadoEn: "2026-03-05",
    };

    setLugares([creado, ...lugares]);
    setSeleccionado(creado);
    setMostrandoFormulario(false);
    setNuevoLugar({
      nombre: "",
      tipo: "Ciudad",
      descripcion: "",
      climaAmbiente: "",
      facciónControladora: "",
      notasSensoriales: "",
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/fichas"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Biblia de Lore</span>
              <span className="text-zinc-400">/</span>
              <span className="text-xs text-zinc-500">Lugares y Escenarios</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Compass className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Fichas de Lugares
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMostrandoFormulario(!mostrandoFormulario)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>{mostrandoFormulario ? "Ver Detalles" : "Nuevo Lugar"}</span>
        </button>
      </div>

      {/* Grid: Lista a la izquierda / Detalles o Formulario a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar lugar por nombre o tipo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {lugaresFiltrados.map((l) => {
              const esActivo = seleccionado.id === l.id && !mostrandoFormulario;
              return (
                <div
                  key={l.id}
                  onClick={() => {
                    setSeleccionado(l);
                    setMostrandoFormulario(false);
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                    esActivo
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-600 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                      {l.nombre}
                    </h3>
                    <Badge variant="outline">{l.tipo}</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                    {l.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          {mostrandoFormulario ? (
            <Card>
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-bold">Registrar Nuevo Lugar / Escenario</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={guardarNuevo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nombre del Lugar *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Archipiélago de Cristal"
                        value={nuevoLugar.nombre}
                        onChange={(e) => setNuevoLugar({ ...nuevoLugar, nombre: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tipo de Escenario</label>
                      <select
                        value={nuevoLugar.tipo}
                        onChange={(e) => setNuevoLugar({ ...nuevoLugar, tipo: e.target.value as TipoLugar })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Ciudad">Ciudad</option>
                        <option value="Reino">Reino</option>
                        <option value="Edificación / Fortaleza">Edificación / Fortaleza</option>
                        <option value="Paraje Natural">Paraje Natural</option>
                        <option value="Región">Región</option>
                        <option value="Taberna / Posada">Taberna / Posada</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Descripción Arquitectónica / Geográfica</label>
                      <button
                        type="button"
                        disabled={cargandoCampo === "descripcion"}
                        onClick={() => handleAutocompletar("descripcion", true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 transition border border-emerald-200 dark:border-emerald-800"
                      >
                        {cargandoCampo === "descripcion" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-emerald-600" />}
                        <span>Autocompletar con IA</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={nuevoLugar.descripcion}
                      onChange={(e) => setNuevoLugar({ ...nuevoLugar, descripcion: e.target.value })}
                      placeholder="Construcción, dimensiones, disposición de calles o relieve..."
                      className="w-full p-2.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Clima & Atmósfera</label>
                      <button
                        type="button"
                        disabled={cargandoCampo === "climaAmbiente"}
                        onClick={() => handleAutocompletar("climaAmbiente", true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 transition border border-emerald-200 dark:border-emerald-800"
                      >
                        {cargandoCampo === "climaAmbiente" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-emerald-600" />}
                        <span>Generar Clima con IA</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={nuevoLugar.climaAmbiente}
                      onChange={(e) => setNuevoLugar({ ...nuevoLugar, climaAmbiente: e.target.value })}
                      placeholder="Niebla, vientos marinos, temperaturas, sensación térmica..."
                      className="w-full p-2.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setMostrandoFormulario(false)}
                      className="px-4 py-2 text-xs font-medium rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                      Guardar Lugar
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="space-y-6">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      {seleccionado.nombre}
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {seleccionado.tipo} {seleccionado.ubicacionPadre && `• En ${seleccionado.ubicacionPadre}`}
                    </p>
                  </div>
                  <Badge variant="success">{seleccionado.facciónControladora || "Territorio Neutral"}</Badge>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Descripción General
                    </h4>
                    <button
                      onClick={() => handleAutocompletar("descripcion", false)}
                      disabled={cargandoCampo === "descripcion"}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {cargandoCampo === "descripcion" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      <span>Enriquecer con IA</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed border border-zinc-100 dark:border-zinc-800/60">
                    {seleccionado.descripcion}
                  </div>
                </div>

                {seleccionado.climaAmbiente && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <CloudSun className="h-3.5 w-3.5 text-amber-500" />
                      Clima y Condiciones Ambientales
                    </h4>
                    <div className="p-3 rounded-lg bg-amber-500/5 text-xs text-zinc-700 dark:text-zinc-300 border border-amber-500/10">
                      {seleccionado.climaAmbiente}
                    </div>
                  </div>
                )}

                {seleccionado.notasSensoriales && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Detalles Sensoriales (Olores, Sonidos, Texturas)
                    </h4>
                    <div className="p-3 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/20 text-xs text-indigo-950 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-900/30">
                      {seleccionado.notasSensoriales}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
