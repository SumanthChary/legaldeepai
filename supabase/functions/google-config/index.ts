import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔑 Google config requested');
    const clientId = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID');
    
    if (!clientId) {
      console.error('❌ GOOGLE_OAUTH_CLIENT_ID not found in environment');
      return new Response(
        JSON.stringify({ 
          error: 'Google Client ID not configured',
          details: 'Please set GOOGLE_OAUTH_CLIENT_ID in Supabase Edge Functions secrets'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Google Client ID found, returning to client');
    return new Response(
      JSON.stringify({ 
        clientId,
        message: 'Google Client ID retrieved successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error in google-config function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});