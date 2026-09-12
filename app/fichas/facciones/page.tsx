"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Plus, 
  Sparkles, 
  Search, 
  ArrowLeft, 
  Loader2,
  Swords,
  Handshake
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Faccion, AlineamientoFaccion } from "@/types/fichas";
import { MOCK_FACCIONES } from "@/lib/mock-data";
import { autocompletarCampoConIA } from "@/lib/ai-service";

export default function FaccionesPage() {
  const [facciones, setFacciones] = useState<Faccion[]>(MOCK_FACCIONES);
  const [seleccionada, setSeleccionada] = useState<Faccion>(MOCK_FACCIONES[0]);
  const [busqueda, setBusqueda] = useState("");
  const [cargandoCampo, setCargandoCampo] = useState<string | null>(null);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  const [nuevaFaccion, setNuevaFaccion] = useState<Partial<Faccion>>({
    nombre: "",
    lema: "",
    tipoAlineamiento: "Orden",
    sedePrincipal: "",
    ideologiaObjetivos: "",
    recursosPoder: "",
  });

  const faccionesFiltradas = facciones.filter((f) =>
    f.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    f.tipoAlineamiento.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAutocompletar = async (campo: "ideologiaObjetivos" | "recursosPoder", esFormularioNuevo = false) => {
    setCargandoCampo(campo);
    try {
      const contexto = esFormularioNuevo ? nuevaFaccion : seleccionada;
      const res = await autocompletarCampoConIA({
        campo,
        tipoEntidad: "faccion",
        contextoActual: contexto as Record<string, unknown>,
      });

      if (res.exito) {
        if (esFormularioNuevo) {
          setNuevaFaccion((prev) => ({ ...prev, [campo]: res.contenidoGenerado }));
        } else {
          setSeleccionada((prev) => ({ ...prev, [campo]: res.contenidoGenerado }));
          setFacciones((prev) =>
            prev.map((f) => (f.id === seleccionada.id ? { ...f, [campo]: res.contenidoGenerado } : f))
          );
        }
      }
    } finally {
      setCargandoCampo(null);
    }
  };

  const guardarNueva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaFaccion.nombre) return;

    const creada: Faccion = {
      id: `fac-${facciones.length + 1}`,
      nombre: nuevaFaccion.nombre,
      lema: nuevaFaccion.lema || "",
      tipoAlineamiento: (nuevaFaccion.tipoAlineamiento as AlineamientoFaccion) || "Orden",
      sedePrincipal: nuevaFaccion.sedePrincipal || "Desconocida",
      ideologiaObjetivos: nuevaFaccion.ideologiaObjetivos || "Sin especificar",
      recursosPoder: nuevaFaccion.recursosPoder || "",
      lideres: [],
      aliados: [],
      enemigos: [],
      creadoEn: "2026-03-05",
      actualizadoEn: "2026-03-05",
    };

    setFacciones([creada, ...facciones]);
    setSeleccionada(creada);
    setMostrandoFormulario(false);
    setNuevaFaccion({
      nombre: "",
      lema: "",
      tipoAlineamiento: "Orden",
      sedePrincipal: "",
      ideologiaObjetivos: "",
      recursosPoder: "",
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
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
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Biblia de Lore</span>
              <span className="text-zinc-400">/</span>
              <span className="text-xs text-zinc-500">Facciones y Gremios</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Fichas de Facciones
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMostrandoFormulario(!mostrandoFormulario)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition shadow-sm shadow-purple-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>{mostrandoFormulario ? "Ver Detalles" : "Nueva Facción"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o alineamiento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {faccionesFiltradas.map((f) => {
              const esActivo = seleccionada.id === f.id && !mostrandoFormulario;
              return (
                <div
                  key={f.id}
                  onClick={() => {
                    setSeleccionada(f);
                    setMostrandoFormulario(false);
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                    esActivo
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 dark:border-purple-600 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {f.nombre}
                    </h3>
                    <Badge variant="purple">{f.tipoAlineamiento}</Badge>
                  </div>
                  {f.lema && (
                    <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400 mt-1">
                      &quot;{f.lema}&quot;
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                    {f.ideologiaObjetivos}
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
                <CardTitle className="text-base font-bold">Registrar Nueva Facción u Organización</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={guardarNueva} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nombre de la Facción *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Inquisidores del Alba"
                        value={nuevaFaccion.nombre}
                        onChange={(e) => setNuevaFaccion({ ...nuevaFaccion, nombre: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Alineamiento Político/Moral</label>
                      <select
                        value={nuevaFaccion.tipoAlineamiento}
                        onChange={(e) => setNuevaFaccion({ ...nuevaFaccion, tipoAlineamiento: e.target.value as AlineamientoFaccion })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        <option value="Orden">Orden</option>
                        <option value="Rebelión">Rebelión</option>
                        <option value="Neutro">Neutro</option>
                        <option value="Caos">Caos</option>
                        <option value="Gremial">Gremial</option>
                        <option value="Religioso">Religioso</option>
                        <option value="Militar">Militar</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Lema o Frase Distintiva</label>
                    <input
                      type="text"
                      placeholder="Ej: La sangre es el precio del silencio..."
                      value={nuevaFaccion.lema}
                      onChange={(e) => setNuevaFaccion({ ...nuevaFaccion, lema: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Ideología & Objetivos Políticos</label>
                      <button
                        type="button"
                        disabled={cargandoCampo === "ideologiaObjetivos"}
                        onClick={() => handleAutocompletar("ideologiaObjetivos", true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-100 transition border border-purple-200 dark:border-purple-800"
                      >
                        {cargandoCampo === "ideologiaObjetivos" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-purple-600" />}
                        <span>Generar con IA</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={nuevaFaccion.ideologiaObjetivos}
                      onChange={(e) => setNuevaFaccion({ ...nuevaFaccion, ideologiaObjetivos: e.target.value })}
                      placeholder="Doctrinas, fines ocultos, rivalidades históricas..."
                      className="w-full p-2.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"
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
                      className="px-5 py-2 text-xs font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition shadow-sm"
                    >
                      Guardar Facción
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
                      <ShieldAlert className="h-5 w-5 text-purple-600" />
                      {seleccionada.nombre}
                    </h2>
                    {seleccionada.lema && (
                      <p className="text-xs italic text-indigo-600 dark:text-indigo-400 mt-1">
                        &quot;{seleccionada.lema}&quot;
                      </p>
                    )}
                  </div>
                  <Badge variant="purple">{seleccionada.tipoAlineamiento}</Badge>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-5">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Ideología y Objetivos
                  </h4>
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed border border-zinc-100 dark:border-zinc-800/60">
                    {seleccionada.ideologiaObjetivos}
                  </div>
                </div>

                {seleccionada.recursosPoder && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Recursos y Capacidad Militar / Política
                    </h4>
                    <div className="p-3 rounded-lg bg-purple-500/5 text-xs text-zinc-700 dark:text-zinc-300 border border-purple-500/15">
                      {seleccionada.recursosPoder}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Handshake className="h-3.5 w-3.5" />
                      Aliados Reconocidos
                    </h5>
                    {seleccionada.aliados.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {seleccionada.aliados.map((a) => (
                          <Badge key={a} variant="success">{a}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">Sin alianzas registradas</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <Swords className="h-3.5 w-3.5" />
                      Enemigos Declarados
                    </h5>
                    {seleccionada.enemigos.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {seleccionada.enemigos.map((e) => (
                          <Badge key={e} variant="danger">{e}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">Sin hostilidades activas</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
