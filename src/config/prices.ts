
import axios from 'axios';

// URL del webhook de n8n
const PRICES_API_URL = 'https://us-central1-sembrala-test2.cloudfunctions.net/getPreciosPizarra';

// Exportar CROP_PRICES con valores nulos para current
export const CROP_PRICES = {
  current: {
    soja: null as number | null,
    maiz: null as number | null,
    trigo: null as number | null,
    girasol: null as number | null,
  },
  projected: {
    soja: 350000,
    maiz: 220000,
    trigo: 250000,
    girasol: 430000,
  }
};

const parsePrice = (priceStr: string): number | null => {
  if (!priceStr) return null;
  try {
    // Remover símbolo de peso si existe
    let cleanedPrice = priceStr.replace(/[$]/g, '');
    // Eliminar los puntos (separadores de miles) y reemplazar coma por punto (decimales)
    cleanedPrice = cleanedPrice.replace(/\./g, '').replace(',', '.');
    const numericPrice = parseFloat(cleanedPrice);
    return isNaN(numericPrice) ? null : numericPrice;
  } catch {
    return null;
  }
};

export async function fetchCurrentPrices(): Promise<void> {
  try {
    const response = await axios.get(PRICES_API_URL);
    const apiData = response.data;

    // Ahora chequeamos `precios` en vez de `cultivos`
    if (apiData?.precios && Array.isArray(apiData.precios)) {
      // Match por nombres de productos. Cuidado con tildes.
      const normalizar = (s: string) =>
        s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      // Buscar cada cultivo por nombre normalizado
      const sojaData = apiData.precios.find((c: any) => normalizar(c.producto) === 'soja');
      const maizData = apiData.precios.find((c: any) => normalizar(c.producto) === 'maiz');
      const trigoData = apiData.precios.find((c: any) => normalizar(c.producto) === 'trigo');
      const girasolData = apiData.precios.find((c: any) => normalizar(c.producto) === 'girasol');

      CROP_PRICES.current.soja = sojaData?.precio 
        ?? (sojaData?.precio_str ? parsePrice(sojaData.precio_str) : null);
      CROP_PRICES.current.maiz = maizData?.precio 
        ?? (maizData?.precio_str ? parsePrice(maizData.precio_str) : null);
      CROP_PRICES.current.trigo = trigoData?.precio 
        ?? (trigoData?.precio_str ? parsePrice(trigoData.precio_str) : null);
      CROP_PRICES.current.girasol = girasolData?.precio 
        ?? (girasolData?.precio_str ? parsePrice(girasolData.precio_str) : null);
    } else {
      // Si la API no trajo lo esperado, deja todo en null
      CROP_PRICES.current.soja = null;
      CROP_PRICES.current.maiz = null;
      CROP_PRICES.current.trigo = null;
      CROP_PRICES.current.girasol = null;
    }
  } catch (error) {
    // Si hay error, deja todo en null
    CROP_PRICES.current.soja = null;
    CROP_PRICES.current.maiz = null;
    CROP_PRICES.current.trigo = null;
    CROP_PRICES.current.girasol = null;
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
    const price = CROP_PRICES.current[crop] || null;
    return price;
  }
  if (productKey.endsWith('_proyectada')) {
    const crop = productKey.replace('_proyectada', '') as keyof typeof CROP_PRICES.projected;
    const price = CROP_PRICES.projected[crop] || null;
    return price;
  }
  return null;
};
