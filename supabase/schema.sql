-- ==========================================================
-- SCRIPT DE ESQUEMA SQL PARA SUPABASE (PostgreSQL)
-- Proyecto: Gestor de Fichas & Asistente Literario con IA
-- ==========================================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: FACCIONES
CREATE TABLE IF NOT EXISTS public.facciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    lema TEXT,
    tipo_alineamiento TEXT NOT NULL DEFAULT 'Neutro', -- 'Orden', 'Rebelión', 'Neutro', 'Caos', 'Gremial', 'Religioso', 'Militar'
    sede_principal TEXT,
    ideologia_objetivos TEXT NOT NULL,
    recursos_poder TEXT,
    lideres TEXT[] DEFAULT '{}',
    aliados TEXT[] DEFAULT '{}',
    enemigos TEXT[] DEFAULT '{}',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABLA: LUGARES
CREATE TABLE IF NOT EXISTS public.lugares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'Ciudad', -- 'Ciudad', 'Reino', 'Edificación / Fortaleza', 'Paraje Natural', etc.
    ubicacion_padre TEXT,
    descripcion TEXT NOT NULL,
    clima_ambiente TEXT,
    faccion_controladora_id UUID REFERENCES public.facciones(id) ON DELETE SET NULL,
    faccion_controladora_nombre TEXT,
    puntos_interes TEXT[] DEFAULT '{}',
    eventos_historicos TEXT[] DEFAULT '{}',
    notas_sensoriales TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA: PERSONAJES
CREATE TABLE IF NOT EXISTS public.personajes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    alias TEXT,
    rol TEXT NOT NULL DEFAULT 'Secundario', -- 'Protagonista', 'Antagonista', 'Secundario', 'De reparto', 'Histórico'
    edad TEXT,
    ocupacion TEXT,
    faccion_id UUID REFERENCES public.facciones(id) ON DELETE SET NULL,
    faccion_nombre TEXT,
    apariencia TEXT NOT NULL DEFAULT '',
    personalidad TEXT NOT NULL DEFAULT '',
    trasfondo TEXT NOT NULL DEFAULT '',
    objetivos TEXT NOT NULL DEFAULT '',
    miedos_debilidades TEXT,
    relaciones JSONB DEFAULT '[]'::jsonb, -- Array de objetos: [{ personajeId, nombrePersonaje, tipo, descripcion }]
    notas_privadas TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA: PROYECTOS LITERARIOS
CREATE TABLE IF NOT EXISTS public.proyectos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL DEFAULT 'Autor',
    genero TEXT NOT NULL DEFAULT 'Fantasía',
    descripcion TEXT NOT NULL DEFAULT '',
    objetivo_palabras INTEGER DEFAULT 80000,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABLA: CAPÍTULOS
CREATE TABLE IF NOT EXISTS public.capitulos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID REFERENCES public.proyectos(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    sinopsis TEXT,
    estado TEXT NOT NULL DEFAULT 'Esbozo', -- 'Esbozo', 'En progreso', 'Revisado', 'Finalizado'
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABLA: ESCENAS
CREATE TABLE IF NOT EXISTS public.escenas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capitulo_id UUID NOT NULL REFERENCES public.capitulos(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    resumen TEXT,
    contenido TEXT NOT NULL DEFAULT '',
    lugar_id UUID REFERENCES public.lugares(id) ON DELETE SET NULL,
    lugar_nombre TEXT,
    tiempo_narrativo TEXT,
    personajes_involucrados_ids UUID[] DEFAULT '{}',
    conteo_palabras INTEGER NOT NULL DEFAULT 0,
    estado TEXT NOT NULL DEFAULT 'Borrador', -- 'Borrador', 'En revisión', 'Completada'
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABLA: ALERTAS DE CONSISTENCIA
CREATE TABLE IF NOT EXISTS public.alertas_consistencia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escena_id UUID REFERENCES public.escenas(id) ON DELETE CASCADE,
    categoria TEXT NOT NULL, -- 'Lugar y Distancia', 'Línea Temporal', 'Lore / Canon', 'Personalidad o Rasgo', 'Estado Físico / Muerte'
    severidad TEXT NOT NULL, -- 'Crítico', 'Advertencia', 'Sugerencia'
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    fragmento_afectado TEXT,
    sugerencia_resolucion TEXT,
    entidades_involucradas JSONB DEFAULT '[]'::jsonb,
    resuelta BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_personajes_faccion ON public.personajes(faccion_id);
CREATE INDEX IF NOT EXISTS idx_lugares_faccion ON public.lugares(faccion_controladora_id);
CREATE INDEX IF NOT EXISTS idx_capitulos_proyecto ON public.capitulos(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_escenas_capitulo ON public.escenas(capitulo_id);
CREATE INDEX IF NOT EXISTS idx_alertas_escena ON public.alertas_consistencia(escena_id);

-- Función para actualizar 'actualizado_en' automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_facciones_actualizado_en BEFORE UPDATE ON public.facciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lugares_actualizado_en BEFORE UPDATE ON public.lugares FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personajes_actualizado_en BEFORE UPDATE ON public.personajes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proyectos_actualizado_en BEFORE UPDATE ON public.proyectos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_capitulos_actualizado_en BEFORE UPDATE ON public.capitulos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escenas_actualizado_en BEFORE UPDATE ON public.escenas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS básicas
ALTER TABLE public.facciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lugares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capitulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas_consistencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de facciones" ON public.facciones FOR SELECT USING (true);
CREATE POLICY "Permitir escritura publica de facciones" ON public.facciones FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de lugares" ON public.lugares FOR SELECT USING (true);
CREATE POLICY "Permitir escritura publica de lugares" ON public.lugares FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de personajes" ON public.personajes FOR SELECT USING (true);
CREATE POLICY "Permitir escritura publica de personajes" ON public.personajes FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de proyectos" ON public.proyectos FOR SELECT USING (true);
CREATE POLICY "Permitir escritura publica de proyectos" ON public.proyectos FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de capitulos" ON public.capitulos FOR SELECT USING (true);
CREATE POLICY "Permitir escritura publica de capitulos" ON public.capitulos FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de escenas" ON public.escenas FOR SELECT USING (true);
CREATE POLICY "Permitir escritura publica de escenas" ON public.escenas FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de alertas" ON public.alertas_consistencia FOR SELECT USING (true);
CREATE POLICY "Permitir escritura publica de alertas" ON public.alertas_consistencia FOR ALL USING (true);
