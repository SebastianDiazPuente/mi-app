import Link from "next/link";
import { Users, Compass, ShieldAlert, Plus, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_PERSONAJES, MOCK_LUGARES, MOCK_FACCIONES } from "@/lib/mock-data";

export default function FichasHubPage() {
  const secciones = [
    {
      titulo: "Personajes",
      descripcion: "Héroes, villanos, mentores y secundarios. Con perfiles psicológicos, relaciones y metas.",
      total: MOCK_PERSONAJES.length,
      href: "/fichas/personajes",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      itemsPreview: MOCK_PERSONAJES.map(p => ({ id: p.id, nombre: p.nombre, detalle: p.rol })),
    },
    {
      titulo: "Lugares y Escenarios",
      descripcion: "Ciudades, tabernas, ruinas y parajes salvajes. Descripciones sensoriales y contexto histórico.",
      total: MOCK_LUGARES.length,
      href: "/fichas/lugares",
      icon: Compass,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      itemsPreview: MOCK_LUGARES.map(l => ({ id: l.id, nombre: l.nombre, detalle: l.tipo })),
    },
    {
      titulo: "Facciones y Gremios",
      descripcion: "Organizaciones, cultos, ejércitos y dinastías con sus dogmas, líderes y alianzas.",
      total: MOCK_FACCIONES.length,
      href: "/fichas/facciones",
      icon: ShieldAlert,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      itemsPreview: MOCK_FACCIONES.map(f => ({ id: f.id, nombre: f.nombre, detalle: f.tipoAlineamiento })),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Biblia de Lore & Worldbuilding
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Gestor de Fichas
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Centralizá todos los elementos narrativos de tu universo. La IA utiliza estas fichas como fuente canónica para validar la consistencia en el editor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" className="flex items-center gap-1.5 py-1.5 px-3 text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Autocompletado de Campos IA Habilitado</span>
          </Badge>
        </div>
      </div>

      {/* Grid de Secciones de Fichas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {secciones.map((sec) => {
          const Icon = sec.icon;
          return (
            <Card key={sec.titulo} className="flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800 transition shadow-sm">
              <div>
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="space-y-1">
                    <div className={`p-2.5 rounded-xl w-fit ${sec.bg} ${sec.color} mb-2`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{sec.titulo}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {sec.descripcion}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {sec.total} fichas
                  </Badge>
                </CardHeader>

                <CardContent className="pt-2">
                  <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                    Registros en el manuscrito
                  </div>
                  <div className="space-y-2">
                    {sec.itemsPreview.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 text-xs"
                      >
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate mr-2">
                          {item.nombre}
                        </span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                          {item.detalle}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>

              <div className="p-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 mt-4 flex items-center justify-between">
                <Link
                  href={sec.href}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
                >
                  Explorar sección
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href={sec.href}
                  className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition"
                  title="Añadir ficha"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
