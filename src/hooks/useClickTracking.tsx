
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useClickTracking = () => {
  const { user } = useAuth();

  const trackClick = async (clickType: 'billetera' | 'ventas' | 'costos') => {
    if (!user) return;

    try {
      await supabase
        .from('click_tracking')
        .insert({
          user_id: user.id,
          click_counter: clickType
        });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return { trackClick };
};
