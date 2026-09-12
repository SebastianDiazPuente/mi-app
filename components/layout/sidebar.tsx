"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Compass, 
  ShieldAlert, 
  Feather, 
  Bot, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  ScrollText
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Editor de Capítulos",
      href: "/editor",
      icon: Feather,
      active: pathname.startsWith("/editor"),
    },
  ];

  const fichasItems = [
    {
      label: "Todas las Fichas",
      href: "/fichas",
      icon: BookOpen,
      active: pathname === "/fichas",
    },
    {
      label: "Personajes",
      href: "/fichas/personajes",
      icon: Users,
      active: pathname.startsWith("/fichas/personajes"),
    },
    {
      label: "Lugares",
      href: "/fichas/lugares",
      icon: Compass,
      active: pathname.startsWith("/fichas/lugares"),
    },
    {
      label: "Facciones",
      href: "/fichas/facciones",
      icon: ShieldAlert,
      active: pathname.startsWith("/fichas/facciones"),
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-200 bg-zinc-50/50 flex flex-col h-screen sticky top-0 dark:border-zinc-800 dark:bg-zinc-950/80">
      {/* Brand / Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-500/30">
          <ScrollText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            LoreSmith AI
            <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Asistente Literario</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
            Principal
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                    item.active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-colors", item.active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
            Gestor de Lore & Fichas
          </p>
          <nav className="space-y-1">
            {fichasItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                    item.active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4 transition-colors", item.active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500")} />
                    <span>{item.label}</span>
                  </div>
                  {item.active && <ChevronRight className="h-3.5 w-3.5 text-indigo-500" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / AI Status & Config Link */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        <Link
          href="/configuracion"
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            pathname === "/configuracion"
              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
          )}
        >
          <Bot className="h-4 w-4 text-emerald-500" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-medium">Motor de IA</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Modo Asistido Activo</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
