
import { supabase } from '@/integrations/supabase/client';

export const cleanupAuthState = () => {
  // Limpiar todos los tokens de autenticación
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const handleAuthError = (error: any) => {
  console.error('Auth error details:', error);
  
  // Errores específicos con mensajes más claros
  if (error.message?.includes('Invalid login credentials')) {
    return 'Credenciales incorrectas. Verifica tu email y contraseña.';
  }
  
  if (error.message?.includes('Email not confirmed')) {
    return 'Por favor, confirma tu email antes de iniciar sesión.';
  }
  
  if (error.message?.includes('User already registered')) {
    return 'Este email ya está registrado. Intenta iniciar sesión.';
  }
  
  if (error.message?.includes('Password should be at least 6 characters')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  
  if (error.message?.includes('refresh_token_not_found')) {
    return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
  }
  
  // Si no es un error conocido, mostrar el mensaje original
  return error.message || 'Ha ocurrido un error. Intenta nuevamente.';
};
