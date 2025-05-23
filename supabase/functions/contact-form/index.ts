
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
    const { name, email, message, subject = "Contact Form Submission" } = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields (name, email, message)" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Store message in database
    const { data: messageData, error: messageError } = await supabase
      .from("email_messages")
      .insert([{ name, email, message, subject }])
      .select();

    if (messageError) {
      console.error("Database error:", messageError);
      return new Response(
        JSON.stringify({ error: messageError.message }),
        {
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create email content
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
        ${message.replace(/\n/g, "<br />")}
      </div>
      <p><em>This email was sent from the SaffireTech website contact form.</em></p>
    `;

    // Create notification record
    await supabase.from("notifications").insert([
      {
        type: "contact_form",
        recipient: adminEmail,
        subject,
        content: message,
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
        subject: `[SaffireTech] ${subject}`,
        html: htmlContent
      })
    });

    const emailResult = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been received. We'll get back to you soon!",
        messageId: messageData?.[0]?.id || null,
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
