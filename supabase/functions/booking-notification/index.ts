
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const adminEmail = "enosaf7@gmail.com";

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse request body
    const { 
      customerName, 
      customerEmail, 
      service, 
      deadline, 
      requirements,
      orderId
    } = await req.json();

    // Validate required fields
    if (!customerName || !service || !orderId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create email content
    const htmlContent = `
      <h2>New Service Booking</h2>
      <p><strong>Customer:</strong> ${customerName} ${customerEmail ? `(${customerEmail})` : ''}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
      ${requirements ? `<p><strong>Requirements:</strong></p>
      <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
        ${requirements.replace(/\n/g, "<br />")}
      </div>` : ''}
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><em>This booking was made through the SaffireTech website.</em></p>
    `;

    // Create notification record
    await supabase.from("notifications").insert([
      {
        type: "booking",
        recipient: adminEmail,
        subject: `New Booking: ${service}`,
        content: JSON.stringify({ customerName, service, deadline, requirements }),
        status: "pending"
      }
    ]);

    // Send email notification
    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        to: adminEmail,
        subject: `[SaffireTech] New Booking: ${service}`,
        html: htmlContent
      })
    });

    const emailResult = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Booking notification sent",
        emailStatus: emailResult
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
