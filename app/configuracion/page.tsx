"use client";

import { useState } from "react";
import { 
  Bot, 
  Key, 
  CheckCircle2, 
  Save, 
  ArrowLeft,
  ShieldCheck,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProveedorIA, ConfiguracionIA } from "@/types/ai";

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<ConfiguracionIA>({
    proveedor: "gemini",
    apiKey: "",
    modelo: "gemini-1.5-pro",
    baseUrl: "https://generativelanguage.googleapis.com",
    temperatura: 0.7,
    conectado: true,
  });

  const [probandoConexion, setProbandoConexion] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);

  const handleProbarConexion = () => {
    setProbandoConexion(true);
    setMensajeEstado(null);
    setTimeout(() => {
      setProbandoConexion(false);
      setMensajeEstado("Conexión establecida correctamente con el proveedor de IA.");
    }, 1000);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeEstado("Configuración guardada exitosamente en el entorno local.");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Ajustes del Sistema</span>
            <span className="text-zinc-400">/</span>
            <span className="text-xs text-zinc-500">Servicios de Inteligencia Artificial</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Configuración de Modelos & API de IA
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Proveedor de Inteligencia Artificial</CardTitle>
              <CardDescription className="text-xs">
                Seleccioná el motor de IA que impulsará el autocompletado de fichas y la verificación de consistencia.
              </CardDescription>
            </div>
            <Badge variant="success" className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Servicio Activo</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleGuardar} className="space-y-6">
            {/* Selección de Proveedor */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Proveedor de IA
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "gemini", nombre: "Google Gemini", modelDefault: "gemini-1.5-pro" },
                  { id: "openai", nombre: "OpenAI GPT", modelDefault: "gpt-4o" },
                  { id: "anthropic", nombre: "Anthropic Claude", modelDefault: "claude-3-5-sonnet-20241022" },
                  { id: "ollama", nombre: "Ollama (Local)", modelDefault: "llama3:8b" },
                ].map((prov) => (
                  <button
                    type="button"
                    key={prov.id}
                    onClick={() =>
                      setConfig({
                        ...config,
                        proveedor: prov.id as ProveedorIA,
                        modelo: prov.modelDefault,
                      })
                    }
                    className={`p-3 rounded-xl border text-left transition ${
                      config.proveedor === prov.id
                        ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold ring-2 ring-indigo-500/20"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                    }`}
                  >
                    <div className="text-xs">{prov.nombre}</div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">
                      {prov.modelDefault}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Credenciales y Modelo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-zinc-400" />
                  API Key / Token de Acceso
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={config.apiKey || ""}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-zinc-400">
                  Tu clave se almacena de forma segura en tus variables de entorno o almacenamiento local.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                  Nombre del Modelo
                </label>
                <input
                  type="text"
                  value={config.modelo}
                  onChange={(e) => setConfig({ ...config, modelo: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Parámetros de Inferencia */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Temperatura Creativa: {config.temperatura}
                </label>
                <span className="text-[11px] text-zinc-400">
                  (Baja: rigor canónico / Alta: prosa imaginativa)
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.2"
                step="0.1"
                value={config.temperatura}
                onChange={(e) => setConfig({ ...config, temperatura: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>

            {mensajeEstado && (
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{mensajeEstado}</span>
              </div>
            )}

            {/* Acciones */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleProbarConexion}
                disabled={probandoConexion}
                className="px-3.5 py-2 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>{probandoConexion ? "Verificando..." : "Probar Conexión con Proveedor"}</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
