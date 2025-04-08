
import { supabase } from "@/integrations/supabase/client";

export async function trackVisit(pageVisited: string): Promise<void> {
  try {
    await supabase.from('visitors').insert({
      ip_address: 'anonymous', // For privacy reasons we're not actually collecting IP
      user_agent: navigator.userAgent,
      page_visited: pageVisited
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
}
