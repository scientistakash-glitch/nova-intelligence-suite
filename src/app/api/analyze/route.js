import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { apSummary, gstSummary, dualRiskVendors, totalBooked, totalMatched, totalAtRisk, deadline, daysRemaining } = body;

    const systemPrompt = `You are Nova's AI filing assistant. You analyse AP exception data 
and GSTR-2B reconciliation status for Indian finance teams and produce a concise, 
actionable filing readiness brief for a finance team.

Always respond in this exact JSON structure:
{
  "verdict": "DO NOT FILE" | "SAFE TO FILE" | "FILE WITH CAUTION",
  "readiness_percent": number,
  "summary": "2-3 sentence plain English brief. Specific vendor names. Specific rupee amounts. No filler.",
  "top_actions": [
    { "priority": 1, "vendor": "vendor name", "action": "specific action", "amount_unblocked": number },
    { "priority": 2, "vendor": "vendor name", "action": "specific action", "amount_unblocked": number }
  ],
  "safe_to_defer": "One sentence on what can be safely ignored this month."
}

Rules:
- Never say "I" or "we". Write as Nova AI.
- Use rupee amounts with L notation (e.g. ₹3.2L not ₹320000) or Cr notation.
- Be direct. The Finance team reads this in 20 seconds.
- Verdict is DO NOT FILE if any Missing or GSTIN Cancelled vendor has ITC > ₹50,000.
- Readiness = (matched ITC / total booked ITC) * 100, rounded to nearest integer.`;

    const userPrompt = `
Filing deadline: ${deadline}
Days remaining: ${daysRemaining}

AP Exceptions summary:
${JSON.stringify(apSummary, null, 2)}

GSTR-2B Status summary:
${JSON.stringify(gstSummary, null, 2)}

Vendors appearing in both AP exceptions and 2B gaps:
${JSON.stringify(dualRiskVendors, null, 2)}

Total ITC booked: ₹${totalBooked}
Total ITC matched: ₹${totalMatched}
Total ITC at risk: ₹${totalAtRisk}

Generate the filing readiness brief.
`;

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a mock response if no API key is set for demo purposes, so it doesn't break
      return NextResponse.json({
        "verdict": "DO NOT FILE",
        "readiness_percent": 74,
        "summary": "Do not file yet. Your Accounts Team flagged 9 issues with Pinnacle Industries, and they are also causing your largest tax gap of ₹3.2L. This is the exact same problem showing up in two different places.\n\n• Fix Pinnacle first.\n• Prism Telecom is a separate risk because their invoice is completely missing from the GST portal. If you file before they do, you will permanently lose ₹2.4L.",
        "top_actions": [
          { "priority": 1, "vendor": "Pinnacle Industries", "action": "Raise credit note request for qty difference", "amount_unblocked": 320000 },
          { "priority": 2, "vendor": "Prism Telecom", "action": "Chase to file GSTR-1", "amount_unblocked": 241000 },
          { "priority": 3, "vendor": "Spectrum Events", "action": "Escalate GSTIN cancelled", "amount_unblocked": 218000 }
        ],
        "safe_to_defer": "Meridian Motors is low priority (₹6K diff) and Citadel Finance usually files by the 16th."
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.1,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API Error:", err);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.content[0].text;
    
    // Extract JSON in case Claude wrapped it in markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    if (jsonMatch) {
      text = jsonMatch[0].replace(/```json\n?/, '').replace(/```/, '');
    }
    
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Analysis route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
