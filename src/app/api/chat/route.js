import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Read the CSV templates to act as context for Haiku
    const publicDir = path.join(process.cwd(), 'public');
    
    let digestData = '';
    let apData = '';
    let tdsData = '';
    let gstrData = '';
    
    try {
      digestData = fs.readFileSync(path.join(publicDir, 'digest-data-sample.csv'), 'utf-8');
      apData = fs.readFileSync(path.join(publicDir, 'ap_exceptions_sample.csv'), 'utf-8');
      tdsData = fs.readFileSync(path.join(publicDir, 'tds-register-sample.csv'), 'utf-8');
      gstrData = fs.readFileSync(path.join(publicDir, 'gstr_2b_status_sample.csv'), 'utf-8');
    } catch (e) {
      console.warn("Could not read all CSV templates. Falling back to available data.");
    }

    const systemPrompt = `You are Nova, an elite AI finance assistant for enterprise teams. 
You have ingested the user's weekly operational data via our standardized CSV templates.

Here is the ingested data context:

=== Accounts Payable Exceptions ===
${apData}

=== TDS Register Shortfalls ===
${tdsData}

=== GSTR-2B Status ===
${gstrData}

=== Weekly Digest Summary ===
${digestData}

Answer queries strictly using this ingested context. If a user asks about vendor risk, cross-reference their AP volume with their GST/TDS history from the templates. For example, Pinnacle Industries has Qty Mismatch issues. Keep responses highly concise, analytical, and action-oriented. Use a professional, direct tone. Do not hallucinate data that is not in the CSVs. If the user asks something outside the scope of the data, politely inform them that your current context is limited to the ingested AP, TDS, and GST templates.`;

    // Call Claude 4.5 Haiku (using 3.5 latest ID for compatibility)
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    return NextResponse.json({ reply: response.content[0].text });
  } catch (error) {
    console.error('Anthropic API Error:', error);
    // Return a graceful fallback instead of an error status
    return NextResponse.json({ 
      reply: "This is a demo instance. I will need more data to build the whole user journey and provide specific analysis on this topic." 
    });
  }
}
