import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();

    // In a real implementation, this would call Anthropic's Claude API.
    // For this demo, we simulate the AI response based on the sample data.
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Fallback Mock Response perfectly aligned with the sample data
    return NextResponse.json({
      "verdict": "CHASE IMMEDIATELY",
      "confirmed_credit": 314000,
      "shortfall": 168000,
      "cash_impact": 168000,
      "summary": "₹16.8L of TDS credit is unconfirmed with 3 days to the advance tax deadline.\n\n• Citadel Finance is the biggest gap - ₹8.4L deducted, no Form 16A shared. They deducted under 194J but your register shows 194C. This section mismatch needs resolution before you can claim this credit.\n• Prism Telecom certificate amount (₹2.1L) doesn't match your register (₹2.4L) - ₹30K shortfall, likely a TDS rate calculation error.\n\nChase Citadel first. ₹8.4L at stake.",
      "top_actions": [
        { "priority": 1, "deductor": "Citadel Finance", "action": "Chase for Form 16A + clarify section (194J vs 194C)", "amount_at_risk": 84000 },
        { "priority": 2, "deductor": "Spectrum Events", "action": "Escalate to senior contact - no response in 15 days", "amount_at_risk": 48000 },
        { "priority": 3, "deductor": "Prism Telecom", "action": "Dispute certificate amount - Rs 30K shortfall", "amount_at_risk": 30000 }
      ],
      "safe_to_defer": "Evergreen Consumer Products was resolved in January. No action needed."
    });
  } catch (error) {
    console.error('TDS Analysis API Error:', error);
    return NextResponse.json({ error: 'Failed to analyze TDS data' }, { status: 500 });
  }
}
