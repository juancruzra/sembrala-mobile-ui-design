
export const CROP_PRICES = {
  // Precios Actuales (en ARS por tonelada)
  current: {
    soja: 321300,
    maiz: 203700,
    trigo: 235500,
    girasol: 411775,
  },
  
  // Precios Proyectados (en ARS por tonelada)
  projected: {
    soja: 350000,
    maiz: 220000,
    trigo: 250000,
    girasol: 430000,
  }
} as const;

// Helper para obtener precio por clave de producto
export const getPriceByProductKey = (productKey: string): number => {
  if (productKey.endsWith('_actual')) {
    const crop = productKey.replace('_actual', '') as keyof typeof CROP_PRICES.current;
    return CROP_PRICES.current[crop] || 100000;
  }
  
  if (productKey.endsWith('_proyectada')) {
    const crop = productKey.replace('_proyectada', '') as keyof typeof CROP_PRICES.projected;
    return CROP_PRICES.projected[crop] || 100000;
  }
  
  return 100000;
};
