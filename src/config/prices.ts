
import axios from 'axios';

// URL del webhook de n8n
const PRICES_API_URL = 'https://us-central1-sembrala-test2.cloudfunctions.net/getPreciosPizarra';

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
    console.log('parsePrice received:', priceStr, 'type:', typeof priceStr);
    
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
    console.log('🚀 Fetching prices from API:', PRICES_API_URL);
    const response = await axios.get(PRICES_API_URL);
    const apiData = response.data;
    
    console.log('📊 API Response received:', JSON.stringify(apiData, null, 2));
    
    // Actualizar los precios si se encuentran en la respuesta
    if (apiData?.cultivos) {
      console.log('🌾 Processing cultivos array:', apiData.precios);
      
      // Buscar cada cultivo y mostrar el proceso
      const sojaData = apiData.precios.find((c: any) => c.producto.toLowerCase() === 'soja');
      console.log('🟡 Soja data found:', sojaData);
      CROP_PRICES.current.soja = sojaData?.precio ? parsePrice(sojaData.precio) : null;
      console.log('✅ Soja price set to:', CROP_PRICES.current.soja);
      
      const maizData = apiData.precios.find((c: any) => c.producto.toLowerCase() === 'maiz' || c.cultivo.toLowerCase() === 'maíz');
      console.log('🟡 Maiz data found:', maizData);
      CROP_PRICES.current.maiz = maizData?.precio ? parsePrice(maizData.precio) : null;
      console.log('✅ Maiz price set to:', CROP_PRICES.current.maiz);
      
      const trigoData = apiData.precios.find((c: any) => c.producto.toLowerCase() === 'trigo');
      console.log('🟡 Trigo data found:', trigoData);
      CROP_PRICES.current.trigo = trigoData?.precio ? parsePrice(trigoData.precio) : null;
      console.log('✅ Trigo price set to:', CROP_PRICES.current.trigo);
      
      const girasolData = apiData.precios.find((c: any) => c.producto.toLowerCase() === 'girasol');
      console.log('🟡 Girasol data found:', girasolData);
      CROP_PRICES.current.girasol = girasolData?.precio ? parsePrice(girasolData.precio) : null;
      console.log('✅ Girasol price set to:', CROP_PRICES.current.girasol);
    } else {
      console.warn('⚠️ No precios array found in API response');
    }
    
    console.log('💰 Final CROP_PRICES.current:', CROP_PRICES.current);
  } catch (error) {
    console.error('❌ Error al cargar precios desde la API:', error);
    // No modificamos los precios (quedan como null)
  }
}

// Función para obtener los precios actuales (la que faltaba)
export const getCurrentPrices = () => {
  console.log('📋 getCurrentPrices called, returning:', CROP_PRICES.current);
  return CROP_PRICES.current;
};

// Inicializar los precios actuales con la API al cargar
fetchCurrentPrices();

// Helper para obtener precio por clave de producto
export const getPriceByProductKey = (productKey: string): number | null => {
  if (productKey.endsWith('_actual')) {
    const crop = productKey.replace('_actual', '') as keyof typeof CROP_PRICES.current;
    const price = CROP_PRICES.current[crop] || null;
    console.log(`🔍 getPriceByProductKey(${productKey}) -> crop: ${crop}, price: ${price}`);
    return price;
  }
  
  if (productKey.endsWith('_proyectada')) {
    const crop = productKey.replace('_proyectada', '') as keyof typeof CROP_PRICES.projected;
    const price = CROP_PRICES.projected[crop] || null;
    console.log(`🔍 getPriceByProductKey(${productKey}) -> crop: ${crop}, price: ${price}`);
    return price;
  }
  
  console.log(`🔍 getPriceByProductKey(${productKey}) -> no match found`);
  return null;
};
