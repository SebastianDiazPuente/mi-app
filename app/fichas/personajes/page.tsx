"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Plus, 
  Sparkles, 
  Search, 
  ArrowLeft, 
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Personaje, RolPersonaje } from "@/types/fichas";
import { MOCK_PERSONAJES } from "@/lib/mock-data";
import { autocompletarCampoConIA } from "@/lib/ai-service";

type CampoAutocompletable = "personalidad" | "trasfondo" | "apariencia" | "objetivos";

export default function PersonajesPage() {
  const [personajes, setPersonajes] = useState<Personaje[]>(MOCK_PERSONAJES);
  const [seleccionado, setSeleccionado] = useState<Personaje>(MOCK_PERSONAJES[0]);
  const [busqueda, setBusqueda] = useState("");
  const [cargandoCampo, setCargandoCampo] = useState<string | null>(null);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  // Formulario nuevo personaje
  const [nuevoPersonaje, setNuevoPersonaje] = useState<Partial<Personaje>>({
    nombre: "",
    alias: "",
    rol: "Protagonista",
    edad: "",
    ocupacion: "",
    apariencia: "",
    personalidad: "",
    trasfondo: "",
    objetivos: "",
  });

  const personajesFiltrados = personajes.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.alias && p.alias.toLowerCase().includes(busqueda.toLowerCase())) ||
    p.rol.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAutocompletar = async (campo: CampoAutocompletable, esFormularioNuevo = false) => {
    setCargandoCampo(campo);
    try {
      const contexto = esFormularioNuevo ? nuevoPersonaje : seleccionado;
      const res = await autocompletarCampoConIA({
        campo,
        tipoEntidad: "personaje",
        contextoActual: contexto as Record<string, unknown>,
      });

      if (res.exito) {
        if (esFormularioNuevo) {
          setNuevoPersonaje((prev) => ({ ...prev, [campo]: res.contenidoGenerado }));
        } else {
          setSeleccionado((prev) => ({ ...prev, [campo]: res.contenidoGenerado }));
          setPersonajes((prev) =>
            prev.map((p) => (p.id === seleccionado.id ? { ...p, [campo]: res.contenidoGenerado } : p))
          );
        }
      }
    } finally {
      setCargandoCampo(null);
    }
  };

  const guardarNuevo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoPersonaje.nombre) return;

    const creado: Personaje = {
      id: `per-${personajes.length + 1}`,
      nombre: nuevoPersonaje.nombre,
      alias: nuevoPersonaje.alias || "",
      rol: (nuevoPersonaje.rol as RolPersonaje) || "Secundario",
      edad: nuevoPersonaje.edad || "",
      ocupacion: nuevoPersonaje.ocupacion || "",
      apariencia: nuevoPersonaje.apariencia || "Sin especificar",
      personalidad: nuevoPersonaje.personalidad || "Sin especificar",
      trasfondo: nuevoPersonaje.trasfondo || "Sin especificar",
      objetivos: nuevoPersonaje.objetivos || "Sin especificar",
      relaciones: [],
      creadoEn: "2026-03-05",
      actualizadoEn: "2026-03-05",
    };

    setPersonajes([creado, ...personajes]);
    setSeleccionado(creado);
    setMostrandoFormulario(false);
    setNuevoPersonaje({
      nombre: "",
      alias: "",
      rol: "Protagonista",
      edad: "",
      ocupacion: "",
      apariencia: "",
      personalidad: "",
      trasfondo: "",
      objetivos: "",
    });
  };

  const camposFormulario: { key: CampoAutocompletable; label: string; placeholder: string }[] = [
    { key: "personalidad", label: "Personalidad & Psicología", placeholder: "Rasgos, virtudes, defectos morales, comportamiento bajo presión..." },
    { key: "trasfondo", label: "Trasfondo & Origen", placeholder: "Infancia, eventos que moldearon su destino, secretos del pasado..." },
    { key: "apariencia", label: "Apariencia Física & Vestimenta", placeholder: "Rasgos distintivos, marcas, vestimenta representativa..." },
    { key: "objetivos", label: "Objetivos & Motivaciones", placeholder: "¿Qué busca conseguir desesperadamente? ¿Qué está dispuesto a sacrificar?" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Barra de navegación superior */}
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
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Biblia de Lore</span>
              <span className="text-zinc-400">/</span>
              <span className="text-xs text-zinc-500">Personajes</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Fichas de Personajes
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMostrandoFormulario(!mostrandoFormulario)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{mostrandoFormulario ? "Ver Detalles" : "Nuevo Personaje"}</span>
        </button>
      </div>

      {/* Interfaz dividida: Lista a la izquierda / Detalle o Formulario a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Buscador y Lista de Personajes (4 columnas) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, rol, alias..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {personajesFiltrados.map((p) => {
              const esActivo = seleccionado.id === p.id && !mostrandoFormulario;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSeleccionado(p);
                    setMostrandoFormulario(false);
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                    esActivo
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-600 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {p.nombre}
                      </h3>
                      {p.alias && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          &quot;{p.alias}&quot;
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        p.rol === "Protagonista"
                          ? "purple"
                          : p.rol === "Antagonista"
                          ? "danger"
                          : "secondary"
                      }
                    >
                      {p.rol}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                    {p.ocupacion || p.trasfondo}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Detalle o Formulario de Creación (8 columnas) */}
        <div className="lg:col-span-8">
          {mostrandoFormulario ? (
            /* Formulario para Nuevo Personaje con Botones de Autocompletado */
            <Card>
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Crear Nueva Ficha de Personaje</CardTitle>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Rellená los campos o utilizá el botón mágico de IA para generar ideas narrativas
                    </p>
                  </div>
                  <Badge variant="purple" className="flex items-center gap-1 text-xs">
                    <Sparkles className="h-3 w-3" />
                    <span>IA Asistida</span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={guardarNuevo} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Alyssa Vance"
                        value={nuevoPersonaje.nombre}
                        onChange={(e) => setNuevoPersonaje({ ...nuevoPersonaje, nombre: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Alias / Epíteto
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: La Sombra de Cristal"
                        value={nuevoPersonaje.alias}
                        onChange={(e) => setNuevoPersonaje({ ...nuevoPersonaje, alias: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Rol Narrativo
                      </label>
                      <select
                        value={nuevoPersonaje.rol}
                        onChange={(e) => setNuevoPersonaje({ ...nuevoPersonaje, rol: e.target.value as RolPersonaje })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="Protagonista">Protagonista</option>
                        <option value="Antagonista">Antagonista</option>
                        <option value="Secundario">Secundario</option>
                        <option value="De reparto">De reparto</option>
                        <option value="Histórico">Histórico</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Ocupación / Clase
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Inquisidora, Boticario, Corsario"
                        value={nuevoPersonaje.ocupacion}
                        onChange={(e) => setNuevoPersonaje({ ...nuevoPersonaje, ocupacion: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Campos con botón de autocompletado IA */}
                  {camposFormulario.map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {label}
                        </label>
                        <button
                          type="button"
                          disabled={cargandoCampo === key}
                          onClick={() => handleAutocompletar(key, true)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition border border-indigo-200 dark:border-indigo-800"
                        >
                          {cargandoCampo === key ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3 text-indigo-500" />
                          )}
                          <span>Autocompletar con IA</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        placeholder={placeholder}
                        value={nuevoPersonaje[key] || ""}
                        onChange={(e) => setNuevoPersonaje({ ...nuevoPersonaje, [key]: e.target.value })}
                        className="w-full p-2.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                      />
                    </div>
                  ))}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setMostrandoFormulario(false)}
                      className="px-4 py-2 text-xs font-medium rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                    >
                      Guardar Ficha
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* Vista Detallada del Personaje Seleccionado */
            <Card className="space-y-6">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {seleccionado.nombre}
                      </h2>
                      <Badge
                        variant={
                          seleccionado.rol === "Protagonista"
                            ? "purple"
                            : seleccionado.rol === "Antagonista"
                            ? "danger"
                            : "secondary"
                        }
                      >
                        {seleccionado.rol}
                      </Badge>
                    </div>
                    {seleccionado.alias && (
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                        &quot;{seleccionado.alias}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Edad: {seleccionado.edad || "Desconocida"}</span>
                    <span>•</span>
                    <span>{seleccionado.ocupacion || "Sin ocupación"}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-6">
                {/* Secciones con autocompletado en caliente */}
                {[
                  { key: "personalidad" as CampoAutocompletable, titulo: "Personalidad & Psicología", texto: seleccionado.personalidad },
                  { key: "trasfondo" as CampoAutocompletable, titulo: "Trasfondo & Origen", texto: seleccionado.trasfondo },
                  { key: "apariencia" as CampoAutocompletable, titulo: "Apariencia Física & Vestimenta", texto: seleccionado.apariencia },
                  { key: "objetivos" as CampoAutocompletable, titulo: "Objetivos & Conflictos Principales", texto: seleccionado.objetivos },
                ].map(({ key, titulo, texto }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {titulo}
                      </h4>
                      <button
                        onClick={() => handleAutocompletar(key, false)}
                        disabled={cargandoCampo === key}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {cargandoCampo === key ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        <span>Regenerar / Enriquecer con IA</span>
                      </button>
                    </div>
                    <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed border border-zinc-100 dark:border-zinc-800/60">
                      {texto || "Sin definir aún."}
                    </div>
                  </div>
                ))}

                {/* Relaciones del Personaje */}
                {seleccionado.relaciones && seleccionado.relaciones.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Relaciones y Vínculos de Canon
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {seleccionado.relaciones.map((rel, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {rel.nombrePersonaje}
                            </span>
                            <Badge
                              variant={
                                rel.tipo === "Aliado"
                                  ? "success"
                                  : rel.tipo === "Enemigo"
                                  ? "danger"
                                  : "outline"
                              }
                            >
                              {rel.tipo}
                            </Badge>
                          </div>
                          <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                            {rel.descripcion}
                          </p>
                        </div>
                      ))}
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
