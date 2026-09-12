import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Conexión Supabase SSR
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Consulta en servidor a la tabla: <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs text-indigo-600 dark:text-indigo-400">todos</code>
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
        >
          Ir al Dashboard Literario &rarr;
        </Link>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-sm space-y-2">
          <p className="font-semibold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Aviso de la base de datos:
          </p>
          <p className="font-mono text-xs bg-black/5 dark:bg-black/30 p-2 rounded">
            {error.message}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            La conexión con Supabase está activa. Si aún no creaste la tabla <code className="font-mono">todos</code>, podés crearla en tu panel de Supabase o ejecutar el esquema completo de tu biblia literaria desde <code className="font-mono">supabase/schema.sql</code>.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Registros obtenidos ({todos?.length || 0}):
          </h2>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden">
            {todos && todos.length > 0 ? (
              todos.map((todo: { id: string | number; name?: string; title?: string }) => (
                <li key={todo.id} className="p-3.5 text-sm text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                  <span className="font-medium">{todo.name || todo.title || JSON.stringify(todo)}</span>
                  <span className="text-xs text-zinc-400 font-mono">ID: {todo.id}</span>
                </li>
              ))
            ) : (
              <li className="p-6 text-sm text-zinc-400 italic text-center">
                Conexión establecida con éxito. La tabla &apos;todos&apos; está vacía actualmente.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
