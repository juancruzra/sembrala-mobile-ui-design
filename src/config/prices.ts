
import axios from 'axios';

// URL del webhook de n8n
const PRICES_API_URL = 'https://pynandi.app.n8n.cloud/webhook/precioscultivos';

// Exportar CROP_PRICES con valores nulos para current
export const CROP_PRICES = {
  // Precios Actuales (en ARS por tonelada) - Se inicializan como null
  current: {
    soja: null as number | null,
    maiz: null as number | null,
    trigo: null as number | null,
    girasol: null as number | null,
  },
  
  // Precios Proyectados (en ARS por tonelada) - Mantener hardcodeados
  projected: {
    soja: 350000,
    maiz: 220000,
    trigo: 250000,
    girasol: 430000,
  }
};

// Función para convertir precio de string a número (formato argentino)
const parsePrice = (priceStr: string): number | null => {
  try {
    // Remover el símbolo de peso si existe
    let cleanedPrice = priceStr.replace(/[$]/g, '');
    
    // Para formato argentino: "$323.800,00" 
    // Eliminar los puntos (separadores de miles) y reemplazar coma por punto (decimales)
    cleanedPrice = cleanedPrice.replace(/\./g, '').replace(',', '.');
    
    const numericPrice = parseFloat(cleanedPrice);
    
    console.log(`Parsing price: "${priceStr}" -> cleaned: "${cleanedPrice}" -> numeric: ${numericPrice}`);
    
    return isNaN(numericPrice) ? null : numericPrice;
  } catch (e) {
    console.error('Error parsing price:', e);
    return null;
  }
};

// Función para obtener los precios actuales desde la API
export async function fetchCurrentPrices(): Promise<void> {
  try {
    const response = await axios.get(PRICES_API_URL);
    const apiData = response.data;
    
    // Actualizar los precios si se encuentran en la respuesta
    if (apiData?.cultivos) {
      CROP_PRICES.current.soja = apiData.cultivos.find((c: any) => c.cultivo.toLowerCase() === 'soja')?.precio 
        ? parsePrice(apiData.cultivos.find((c: any) => c.cultivo.toLowerCase() === 'soja')!.precio) 
        : null;
        
      CROP_PRICES.current.maiz = apiData.cultivos.find((c: any) => c.cultivo.toLowerCase() === 'maiz' || c.cultivo.toLowerCase() === 'maíz')?.precio 
        ? parsePrice(apiData.cultivos.find((c: any) => c.cultivo.toLowerCase() === 'maiz' || c.cultivo.toLowerCase() === 'maíz')!.precio) 
        : null;
        
      CROP_PRICES.current.trigo = apiData.cultivos.find((c: any) => c.cultivo.toLowerCase() === 'trigo')?.precio 
        ? parsePrice(apiData.cultivos.find((c: any) => c.cultivo.toLowerCase() === 'trigo')!.precio) 
        : null;
        
      CROP_PRICES.current.girasol = apiData.cultivos.find((c: any) => c.cultivo.toLowerCase() === 'girasol')?.precio 
        ? parsePrice(apiData.cultivos.find((c: any) => c.cultivo.toLowerCase() === 'girasol')!.precio) 
        : null;
    }
    
    console.log('Precios actuales actualizados desde la API:', CROP_PRICES.current);
  } catch (error) {
    console.error('Error al cargar precios desde la API:', error);
    // No modificamos los precios (quedan como null)
  }
}

// Función para obtener los precios actuales (la que faltaba)
export const getCurrentPrices = () => {
  return CROP_PRICES.current;
};

// Inicializar los precios actuales con la API al cargar
fetchCurrentPrices();

// Helper para obtener precio por clave de producto
export const getPriceByProductKey = (productKey: string): number | null => {
  if (productKey.endsWith('_actual')) {
    const crop = productKey.replace('_actual', '') as keyof typeof CROP_PRICES.current;
    return CROP_PRICES.current[crop] || null;
  }
  
  if (productKey.endsWith('_proyectada')) {
    const crop = productKey.replace('_proyectada', '') as keyof typeof CROP_PRICES.projected;
    return CROP_PRICES.projected[crop] || null;
  }
  
  return null;
};
