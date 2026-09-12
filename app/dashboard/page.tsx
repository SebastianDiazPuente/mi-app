import Link from "next/link";
import { 
  Users, 
  Compass, 
  ShieldAlert, 
  Feather, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight, 
  BookOpen, 
  CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MOCK_PERSONAJES, 
  MOCK_LUGARES, 
  MOCK_FACCIONES, 
  MOCK_CAPITULOS, 
  MOCK_ALERTAS_CONSISTENCIA, 
  MOCK_PROYECTO 
} from "@/lib/mock-data";

export default function DashboardPage() {
  const totalPalabras = MOCK_CAPITULOS.reduce((acc, cap) => {
    return acc + cap.escenas.reduce((escAcc, esc) => escAcc + esc.conteoPalabras, 0);
  }, 0);

  const stats = [
    {
      title: "Personajes",
      value: MOCK_PERSONAJES.length,
      subtitle: `${MOCK_PERSONAJES.filter(p => p.rol === "Protagonista").length} protagonista(s)`,
      icon: Users,
      href: "/fichas/personajes",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Lugares",
      value: MOCK_LUGARES.length,
      subtitle: "Escenarios mapeados",
      icon: Compass,
      href: "/fichas/lugares",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Facciones",
      value: MOCK_FACCIONES.length,
      subtitle: "Grupos e ideologías",
      icon: ShieldAlert,
      href: "/fichas/facciones",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Capítulos",
      value: MOCK_CAPITULOS.length,
      subtitle: `${totalPalabras} palabras registradas`,
      icon: Feather,
      href: "/editor",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Bienvenida y Resumen del Proyecto */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Panel de Control Literario
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {MOCK_PROYECTO.titulo}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            {MOCK_PROYECTO.descripcion}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
          >
            <Feather className="h-4 w-4" />
            <span>Continuar Escribiendo</span>
          </Link>
          <Link
            href="/fichas"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-800 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition"
          >
            <BookOpen className="h-4 w-4" />
            <span>Gestionar Fichas</span>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} href={item.href} className="group">
              <Card className="hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-md">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.title}</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{item.value}</p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{item.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Sección Doble: Verificador de Consistencia IA y Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Consistencia IA (2 columnas) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Verificador de Consistencia Narrativa con IA
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Monitoreo cruzado entre eventos de capítulos, ubicaciones y fichas de personajes
                </p>
              </div>
            </div>
            <Badge variant="warning">
              {MOCK_ALERTAS_CONSISTENCIA.length} alertas detectadas
            </Badge>
          </div>

          <div className="space-y-3">
            {MOCK_ALERTAS_CONSISTENCIA.map((alerta) => (
              <Card key={alerta.id} className="border-l-4 border-l-amber-500 dark:border-l-amber-500">
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={alerta.severidad === "Crítico" ? "danger" : alerta.severidad === "Advertencia" ? "warning" : "secondary"}
                        >
                          {alerta.severidad}
                        </Badge>
                        <span className="text-xs text-zinc-400">|</span>
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{alerta.categoria}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {alerta.titulo}
                      </h3>
                    </div>
                    <Link
                      href="/editor"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 flex-shrink-0"
                    >
                      Resolver <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {alerta.descripcion}
                  </p>

                  {alerta.sugerenciaResolucion && (
                    <div className="mt-2 p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Sugerencia IA: </span>
                        {alerta.sugerenciaResolucion}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Panel Lateral: Fichas Recientes & Asistente IA */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Personajes Clave</span>
                <Link href="/fichas/personajes" className="text-xs text-indigo-600 font-normal hover:underline">
                  Ver todos
                </Link>
              </CardTitle>
              <CardDescription>Principales figuras del manuscrito</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_PERSONAJES.slice(0, 3).map((personaje) => (
                <div key={personaje.id} className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{personaje.nombre}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{personaje.ocupacion || personaje.alias}</p>
                  </div>
                  <Badge variant={personaje.rol === "Protagonista" ? "purple" : "outline"}>
                    {personaje.rol}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tarjeta de Asistente IA Activo */}
          <Card className="bg-gradient-to-br from-indigo-900 to-zinc-900 text-white border-0 shadow-lg">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-white/10">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">Asistente de Escritura</h4>
                  <p className="text-xs text-zinc-300">Autocompletado & Consistencia</p>
                </div>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed">
                Podés usar el botón mágico de IA en las fichas para generar personalidad, metas y trasfondos coherentes con tu universo narrativo.
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  API Configurada
                </span>
                <Link
                  href="/configuracion"
                  className="font-semibold text-indigo-300 hover:text-white transition"
                >
                  Ajustar modelo &rarr;
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
