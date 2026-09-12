"use client";

import Link from "next/link";
import { Sparkles, Plus, BookCheck, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex items-center gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Proyecto Activo
          </span>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Las Crónicas del Velo Fracturado
            <span className="text-[10px] text-zinc-400 font-normal">v0.1</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/configuracion">
          <Badge variant="success" className="cursor-pointer flex items-center gap-1.5 py-1 px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="h-3 w-3" />
            <span>IA: Asistente Listo</span>
          </Badge>
        </Link>

        <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />

        <Link
          href="/editor"
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
        >
          <BookCheck className="h-3.5 w-3.5" />
          <span>Abrir Editor</span>
        </Link>

        <Link
          href="/fichas/personajes"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nueva Ficha</span>
        </Link>

        <Link
          href="/configuracion"
          className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          title="Configuración"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
