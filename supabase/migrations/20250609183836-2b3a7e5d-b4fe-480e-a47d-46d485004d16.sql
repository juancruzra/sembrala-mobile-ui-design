
-- Crear tabla para tenencias de productos (inventario)
CREATE TABLE public.tenencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  producto_nombre TEXT NOT NULL,
  cantidad NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, producto_nombre)
);

-- Crear tabla para vencimientos
CREATE TABLE public.vencimientos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  concepto TEXT NOT NULL,
  monto NUMERIC NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  categoria TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security para ambas tablas
ALTER TABLE public.tenencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vencimientos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tenencias
CREATE POLICY "Users can view their own tenencias" 
  ON public.tenencias 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tenencias" 
  ON public.tenencias 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tenencias" 
  ON public.tenencias 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tenencias" 
  ON public.tenencias 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para vencimientos
CREATE POLICY "Users can view their own vencimientos" 
  ON public.vencimientos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vencimientos" 
  ON public.vencimientos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vencimientos" 
  ON public.vencimientos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vencimientos" 
  ON public.vencimientos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en tenencias
CREATE TRIGGER update_tenencias_updated_at 
  BEFORE UPDATE ON public.tenencias 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
