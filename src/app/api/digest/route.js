import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { data } = await req.json();

    const systemPrompt = `You are Nova's AI Finance Agent. You synthesize complex financial operations data into highly structured, stylized HTML reports.

You will be given a JSON array of weekly digest data.
You must return a JSON object with exactly two keys: "controllerBrief" and "cfoPack".
The value for each key MUST be a highly stylized, professionally written HTML string matching the exact structure and CSS classes shown below.

Template for "controllerBrief" (You must use these exact classes):
<div class="report-content">
  <div class="report-header">
    <h2>FINANCE TEAM BRIEF</h2>
    <p>Week of 17 March 2026 &middot; Prepared by Nova AI</p>
  </div>
  <h3>THIS WEEK AT A GLANCE</h3>
  <table class="report-table">
    <tbody>
      <tr><td>Accounts Payable Exceptions</td><td><strong>XX unresolved</strong> <span style="color:var(--nova-red-text)">(↑ X from last week)</span></td></tr>
      <tr><td>ITC at Risk</td><td><strong>₹X.XXL</strong></td></tr>
      <tr><td>Filing Readiness</td><td><strong>XX%</strong> (deadline: 6 days)</td></tr>
      <tr><td>Cash Outflow Est</td><td><strong>₹X.XL</strong> (if filed today)</td></tr>
      <tr><td>TDS Shortfall</td><td><strong>₹X.XL</strong> (advance tax: 3 days)</td></tr>
    </tbody>
  </table>
  <h3>WHAT NEEDS YOUR ATTENTION MONDAY</h3>
  <div class="report-alert">
    <strong>1. Vendor Name - Urgent</strong>
    <p>Context about the issue.</p>
    <p class="action"><strong>Action:</strong> What needs to be done today.</p>
  </div>
  ... (add more alerts based on data) ...
  <h3>WHAT CAN WAIT</h3>
  <ul class="report-list">
    <li><strong>Vendor Name issue:</strong> Context. Monitor.</li>
  </ul>
  <h3>IF YOU RESOLVE CRITICAL ISSUES THIS WEEK</h3>
  <table class="report-table highlight-table">
    <tbody>
      <tr><td>Filing readiness</td><td>XX% &rarr; <strong>XX%</strong></td></tr>
      <tr><td>Cash outflow</td><td>₹XX.XL &rarr; <strong>₹X.XL</strong></td></tr>
      <tr><td>ITC recovered</td><td><strong>₹X.XL</strong></td></tr>
    </tbody>
  </table>
</div>

Template for "cfoPack" (You must use these exact classes):
<div class="report-content">
  <div class="report-header">
    <h2>FINANCE INTELLIGENCE REPORT</h2>
    <p>Meridian Manufacturing Pvt Ltd<br/>Week ending 17 March 2026 &middot; Prepared by Nova AI</p>
  </div>
  <h3>EXECUTIVE SUMMARY</h3>
  <p>Executive level synthesis of the data.</p>
  <h3>KEY RISKS & EXPOSURES</h3>
  <p><strong>1. GST Cash Outflow Risk:</strong> context.</p>
  <p><strong>2. Advance Tax Exposure:</strong> context.</p>
  ...
  <h3>STRATEGIC MITIGATIONS</h3>
  <ul class="report-list">
    <li><strong>Action category:</strong> explanation.</li>
  </ul>
  <h3>WORKING CAPITAL IMPACT SCENARIOS</h3>
  <table class="report-table bordered">
    <thead>
      <tr>
        <th>Scenario</th>
        <th>GST Outflow</th>
        <th>TDS Outflow</th>
        <th>Total Cash Impact</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Scenario A</strong> (no action)</td>
        <td>₹XX.XL</td>
        <td>₹XX.XL</td>
        <td><strong>₹XX.XL</strong></td>
      </tr>
      ...
    </tbody>
  </table>
  <p class="summary-text" style="margin-top: 16px; font-weight: 500; color: var(--nova-green-text);">Resolving all identified issues saves <strong>₹XX.XL</strong> in working capital this month.</p>
  <div class="report-footer">
    Confidential &middot; Meridian Manufacturing Pvt Ltd
  </div>
</div>

Analyze the JSON data provided and generate the HTML strictly adhering to the classes above. Do not wrap the JSON object in markdown blocks.`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: JSON.stringify(data) }
      ],
    });

    let text = response.content[0].text;
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    if (jsonMatch) {
      text = jsonMatch[0].replace(/```json\n?/, '').replace(/```/, '');
    }
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('Digest API Error:', error);
    // Fallback Mock Response perfectly aligned with the sample data to prevent UI crashing on demo
    const controllerBrief = `<div class="report-content"><div class="report-header"><h2>FINANCE TEAM BRIEF</h2><p>Week of 17 March 2026 &middot; Prepared by Nova AI</p></div><h3>THIS WEEK AT A GLANCE</h3><table class="report-table"><tbody><tr><td>Accounts Payable Exceptions</td><td><strong>14 unresolved</strong> <span style="color:var(--nova-red-text)">(↑ 3 from last week)</span></td></tr><tr><td>ITC at Risk</td><td><strong>₹5.42L</strong></td></tr><tr><td>Filing Readiness</td><td><strong>74%</strong> (deadline: 6 days)</td></tr><tr><td>Cash Outflow Est</td><td><strong>₹12.5L</strong> (if filed today)</td></tr><tr><td>TDS Shortfall</td><td><strong>₹16.8L</strong> (advance tax: 3 days)</td></tr></tbody></table><h3>WHAT NEEDS YOUR ATTENTION MONDAY</h3><div class="report-alert"><strong>1. API Fallback - Demo Mode</strong><p>The Anthropic API failed to respond, so Nova is showing a cached fallback view.</p><p class="action"><strong>Action:</strong> Check API Keys and Network.</p></div></div>`;
    const cfoPack = `<div class="report-content"><div class="report-header"><h2>FINANCE INTELLIGENCE REPORT</h2><p>Meridian Manufacturing Pvt Ltd<br/>Week ending 17 March 2026 &middot; Prepared by Nova AI</p></div><h3>EXECUTIVE SUMMARY</h3><p>The overall compliance posture is in fallback mode. The API failed to return a live response.</p></div>`;
    
    return NextResponse.json({
      controllerBrief,
      cfoPack
    });
  }
}
