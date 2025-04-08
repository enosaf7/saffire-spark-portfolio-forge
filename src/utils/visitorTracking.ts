
import { supabase } from "@/integrations/supabase/client";

export async function trackVisit(pageVisited: string): Promise<void> {
  try {
    const visitorData = {
      ip_address: 'anonymous', // For privacy reasons we're not actually collecting IP
      user_agent: navigator.userAgent,
      page_visited: pageVisited
    };
    
    await supabase.from('visitors').insert(visitorData);
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
}
