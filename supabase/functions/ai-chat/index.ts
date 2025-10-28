import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Crisis keywords for detection
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'self harm',
  'cutting', 'hurt myself', 'no reason to live', 'better off dead',
  'suicide plan', 'आत्महत्या', 'मरना चाहता', 'ఆత్మహత్య'
];

const detectCrisis = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, userId } = await req.json();
    
    console.log('Received chat request:', { message, userId });
    
    const isCrisis = detectCrisis(message);
    
    // Analyze sentiment and emotion
    const sentimentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Analyze the emotional content of the user's message. Return ONLY a JSON object with this structure:
{
  "sentiment": "positive" | "neutral" | "negative",
  "emotions": ["sad", "anxious", "hopeful", etc.],
  "intensity": 1-10,
  "crisis_level": "none" | "low" | "medium" | "high"
}`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const sentimentData = await sentimentResponse.json();
    let emotionAnalysis;
    try {
      emotionAnalysis = JSON.parse(sentimentData.choices[0].message.content);
    } catch {
      emotionAnalysis = {
        sentiment: 'neutral',
        emotions: [],
        intensity: 5,
        crisis_level: isCrisis ? 'high' : 'none'
      };
    }

    // Override crisis level if keywords detected
    if (isCrisis) {
      emotionAnalysis.crisis_level = 'high';
    }

    // Generate empathetic response
    const systemPrompt = isCrisis 
      ? `You are Zenora, a compassionate AI mental wellness companion. The user is in crisis and may be experiencing thoughts of self-harm.

CRITICAL RESPONSE PROTOCOL:
1. Express immediate care and concern
2. Acknowledge their pain without judgment
3. Gently remind them they're not alone
4. Provide these helplines:
   - AASRA: +91-9820466626 (24/7)
   - Tele-MANAS: 14416 (24/7, toll-free)
   - Vandrevala Foundation: +91-9999666555 (24/7)
5. Encourage them to reach out to someone they trust
6. Remind them this feeling is temporary and help is available

Be warm, direct, and focused on immediate safety.`
      : `You are Zenora, a compassionate AI mental wellness companion for Indian users.

Guidelines:
- Be empathetic, warm, and culturally sensitive to Indian context
- Use simple, accessible language (avoid jargon)
- Acknowledge emotions before offering solutions
- Respect cultural values: family dynamics, community ties, spirituality
- Avoid Western-centric advice
- Be supportive without being prescriptive
- When appropriate, incorporate concepts familiar in Indian culture (balance, inner peace, etc.)

Current user emotion: ${emotionAnalysis.sentiment} (intensity: ${emotionAnalysis.intensity}/10)
Detected emotions: ${emotionAnalysis.emotions.join(', ')}

Respond with empathy appropriate to their emotional state.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context || []),
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Store emotion analysis in database if userId provided
    if (userId) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Store in mood_entries if it's a significant emotional state
      if (emotionAnalysis.intensity >= 6) {
        await supabase.from('mood_entries').insert({
          user_id: userId,
          mood: emotionAnalysis.sentiment,
          energy_level: Math.max(1, 10 - emotionAnalysis.intensity),
          stress_level: emotionAnalysis.intensity,
          notes: `Auto-detected from chat: ${emotionAnalysis.emotions.join(', ')}`
        });
      }
    }

    console.log('AI response generated successfully', { emotionAnalysis, isCrisis });

    return new Response(
      JSON.stringify({ 
        response: reply,
        emotionAnalysis,
        isCrisis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I'm having trouble connecting right now. Please try again in a moment."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});