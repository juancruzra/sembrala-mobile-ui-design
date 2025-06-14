import axios from 'axios';

// URL del webhook de n8n
const PRICES_API_URL = 'https://pynandi.app.n8n.cloud/webhook/precioscultivos';

// Estructura de respuesta esperada de la API
interface CropPricesResponse {
  cultivos: Array<{
    cultivo: string;
    precio: string; // Ej: "$323.800,00"
  }>;
}

// Función para convertir precio de string a número
const parsePrice = (priceStr: string): number => {
  return parseInt(priceStr.replace(/[$\.,]/g, '').replace(/,/g, ''));
};

// Función para obtener los precios actuales desde la API de n8n
async function fetchCurrentPrices(): Promise<typeof CROP_PRICES.current> {
  try {
    const response = await axios.get(PRICES_API_URL);
    const apiData = response.data as CropPricesResponse;
    
    // Mapear los cultivos a la estructura actual
    return {
      soja: apiData.cultivos.find(c => c.cultivo.toLowerCase() === 'soja')?.precio 
        ? parsePrice(apiData.cultivos.find(c => c.cultivo.toLowerCase() === 'soja')!.precio) 
        : defaultPrices.soja,
      maiz: apiData.cultivos.find(c => c.cultivo.toLowerCase() === 'maiz' || c.cultivo.toLowerCase() === 'maíz')?.precio 
        ? parsePrice(apiData.cultivos.find(c => c.cultivo.toLowerCase() === 'maiz' || c.cultivo.toLowerCase() === 'maíz')!.precio) 
        : defaultPrices.maiz,
      trigo: apiData.cultivos.find(c => c.cultivo.toLowerCase() === 'trigo')?.precio 
        ? parsePrice(apiData.cultivos.find(c => c.cultivo.toLowerCase() === 'trigo')!.precio) 
        : defaultPrices.trigo,
      girasol: apiData.cultivos.find(c => c.cultivo.toLowerCase() === 'girasol')?.precio 
        ? parsePrice(apiData.cultivos.find(c => c.cultivo.toLowerCase() === 'girasol')!.precio) 
        : defaultPrices.girasol,
    };
  } catch (error) {
    console.error('Error al obtener precios de la API, usando valores por defecto:', error);

// Exportar CROP_PRICES como un objeto que se inicializa con la API
export const CROP_PRICES = {
  // Precios Actuales (en ARS por tonelada) - Se inicializan con la API
  current: await fetchCurrentPrices(),
  
  // Precios Proyectados (en ARS por tonelada) - Mantener hardcodeados
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
