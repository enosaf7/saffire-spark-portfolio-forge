
import { supabase } from "@/integrations/supabase/client";

export interface BookingData {
  customerName: string;
  customerEmail?: string;
  customerId?: string;
  service: string;
  deadline: string;
  requirements?: string;
  orderId: string;
}

export const sendBookingNotification = async (bookingData: BookingData) => {
  try {
    const { data, error } = await supabase.functions.invoke('booking-notification', {
      body: bookingData
    });
    
    if (error) {
      console.error("Error sending booking notification:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Exception in sendBookingNotification:", error);
    return { success: false, error };
  }
};
