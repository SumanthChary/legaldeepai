import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const dodoApiKey = Deno.env.get('DODO_PAYMENTS_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify Dodo payment
async function verifyDodoPayment(transactionId: string): Promise<any> {
  try {
    // For demo purposes, we'll simulate a successful payment verification
    // In a real implementation, this would call the actual Dodo Payments API
    if (transactionId.startsWith('dodo_')) {
      // Simulate successful payment
      const amount = transactionId.split('_')[1] ? 
        (Date.now().toString().slice(-2) === transactionId.split('_')[1].slice(-2) ? '29.99' : '99.99') : 
        '29.99';
      
      return {
        id: transactionId,
        status: 'completed',
        amount: amount,
        currency: 'USD',
        created_at: new Date().toISOString()
      };
    }
    
    // If not a demo transaction, attempt real API call
    const response = await fetch(`https://api.dodopayments.com/v1/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${dodoApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Dodo API error:', response.status, await response.text());
      throw new Error(`Dodo API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dodo payment verification:', data);
    return data;
  } catch (error) {
    console.error('Error verifying Dodo payment:', error);
    throw error;
  }
}

// Rate limiting helper
const rateLimitMap = new Map();
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10;
  
  const userRequests = rateLimitMap.get(userId) || [];
  const recentRequests = userRequests.filter((time: number) => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(userId, recentRequests);
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId, userId, planType, amount } = await req.json();
    
    console.log('Processing Dodo payment:', { transactionId, userId, planType, amount });

    // Basic validation
    if (!transactionId || !userId || !planType || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: transactionId, userId, planType, amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the payment with Dodo Payments
    const paymentDetails = await verifyDodoPayment(transactionId);
    
    if (!paymentDetails || paymentDetails.status !== 'completed') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment not completed or invalid transaction' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify amount matches
    const expectedAmount = parseFloat(amount);
    const actualAmount = parseFloat(paymentDetails.amount);
    
    if (Math.abs(actualAmount - expectedAmount) > 0.01) {
      console.error(`Amount mismatch: expected ${expectedAmount}, got ${actualAmount}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment amount mismatch' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate subscription dates
    const now = new Date();
    const currentPeriodStart = now;
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    // Update or insert subscription
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        source: 'dodo'
      });

    if (subscriptionError) {
      console.error('Subscription error:', subscriptionError);
      throw new Error('Failed to update subscription');
    }

    // Update profile with document limits based on plan
    let documentLimit = 3; // Free tier default
    switch (planType) {
      case 'professional':
        documentLimit = 500;
        break;
      case 'enterprise':
        documentLimit = 999999;
        break;
      case 'pay_per_document':
        documentLimit = 1;
        break;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        document_limit: documentLimit,
        source: 'dodo'
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Profile update error:', profileError);
      // Don't fail the whole process for profile update
    }

    console.log('Successfully processed Dodo payment for user:', userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment processed successfully',
        subscription: {
          plan_type: planType,
          document_limit: documentLimit
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error processing Dodo payment:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});