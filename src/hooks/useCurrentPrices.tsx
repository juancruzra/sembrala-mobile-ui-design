
import { useState, useEffect } from 'react';
import { fetchCurrentPrices, getCurrentPrices } from '@/config/prices';

export const useCurrentPrices = () => {
  const [currentPrices, setCurrentPrices] = useState(getCurrentPrices());
  const [loading, setLoading] = useState(true);

  const refreshPrices = async () => {
    try {
      await fetchCurrentPrices();
      setCurrentPrices(getCurrentPrices());
    } catch (error) {
      console.error('Error refreshing prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPrices();

    // Intervalo para refrescar cada 30 segundos
    const interval = setInterval(() => {
      console.log('Refreshing current prices...');
      refreshPrices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    currentPrices,
    loading,
    refreshPrices,
  };
};
