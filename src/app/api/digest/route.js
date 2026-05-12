import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();

    // In a real app, we would make 2 parallel Anthropic calls here:
    // const [controllerBrief, cfoPack] = await Promise.all([callClaude(promptA), callClaude(promptB)])
    
    // Simulating API processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    const controllerBrief = `
<div class="report-content">
  <div class="report-header">
    <h2>FINANCE TEAM BRIEF</h2>
    <p>Week of 17 March 2026 &middot; Prepared by Nova AI</p>
  </div>

  <h3>THIS WEEK AT A GLANCE</h3>
  <table class="report-table">
    <tbody>
      <tr><td>Accounts Payable Exceptions</td><td><strong>14 unresolved</strong> <span style="color:var(--nova-red-text)">(↑ 3 from last week)</span></td></tr>
      <tr><td>ITC at Risk</td><td><strong>₹5.42L</strong></td></tr>
      <tr><td>Filing Readiness</td><td><strong>74%</strong> (deadline: 6 days)</td></tr>
      <tr><td>Cash Outflow Est</td><td><strong>₹12.5L</strong> (if filed today)</td></tr>
      <tr><td>TDS Shortfall</td><td><strong>₹16.8L</strong> (advance tax: 3 days)</td></tr>
    </tbody>
  </table>

  <h3>WHAT NEEDS YOUR ATTENTION MONDAY</h3>
  <div class="report-alert">
    <strong>1. Pinnacle Industries - Urgent</strong>
    <p>9 Accounts Payable exceptions this week, all qty mismatch, same issue 3 consecutive weeks. Also your biggest ITC gap (₹3.2L).</p>
    <p class="action"><strong>Action:</strong> Raise credit note request. Send nudge today.</p>
  </div>
  
  <div class="report-alert">
    <strong>2. Prism Telecom - Do not file before resolving</strong>
    <p>Invoice missing from 2B. ₹2.4L ITC lost permanently if you file GSTR-3B before Prism uploads.</p>
    <p class="action"><strong>Action:</strong> Call accounts team. Email already drafted.</p>
  </div>

  <div class="report-alert">
    <strong>3. Citadel Finance - TDS certificate overdue 22 days</strong>
    <p>₹8.4L TDS credit unconfirmed. Section mismatch (194C vs 194J) also needs clarification before advance tax filing on 15 March.</p>
    <p class="action"><strong>Action:</strong> Escalate to senior contact today.</p>
  </div>

  <div class="report-alert">
    <strong>4. Spectrum Events - GSTIN cancelled</strong>
    <p>₹2.18L ITC not claimable. Payment should be held.</p>
    <p class="action"><strong>Action:</strong> Finance head approval before next payment run.</p>
  </div>

  <h3>WHAT CAN WAIT</h3>
  <ul class="report-list">
    <li><strong>Meridian Motors GRN pending:</strong> ₹6K diff, low risk. Vendor has been contacted. Monitor.</li>
    <li><strong>Nexgen Technologies rate mismatch:</strong> Accounts Payable only, 2B clean. Raise debit note next cycle.</li>
  </ul>

  <h3>IF YOU RESOLVE PINNACLE + PRISM THIS WEEK</h3>
  <table class="report-table highlight-table">
    <tbody>
      <tr><td>Filing readiness</td><td>74% &rarr; <strong>94%</strong></td></tr>
      <tr><td>Cash outflow</td><td>₹12.5L &rarr; <strong>₹7.1L</strong></td></tr>
      <tr><td>ITC recovered</td><td><strong>₹5.6L</strong></td></tr>
    </tbody>
  </table>
</div>`;

    const cfoPack = `
<div class="report-content">
  <div class="report-header">
    <h2>FINANCE INTELLIGENCE REPORT</h2>
    <p>Meridian Manufacturing Pvt Ltd<br/>Week ending 17 March 2026 &middot; Prepared by Nova AI</p>
  </div>

  <h3>EXECUTIVE SUMMARY</h3>
  <p>The overall compliance posture for March is stable, but <strong>₹22.2L</strong> in working capital is currently locked due to operational bottlenecks across GST and TDS workflows.</p>
  <p>Filing readiness for March GSTR-3B stands at <strong>74%</strong>. The primary exposure is driven by recurring vendor fulfilment discrepancies, representing a structural process gap rather than an isolated compliance failure.</p>

  <h3>KEY RISKS & EXPOSURES</h3>
  <p><strong>1. GST Cash Outflow Risk:</strong> If unresolved, estimated GST cash outflow on 20 March is ₹12.5L. Resolving the two critical vendors reduces this to ₹7.1L - a direct working capital saving of <strong>₹5.4L</strong>.</p>
  <p><strong>2. Advance Tax Exposure:</strong> <strong>₹16.8L</strong> of TDS credit remains unconfirmed with advance tax due in 3 days. A material classification dispute (194C vs 194J) accounts for half of this exposure.</p>
  <p><strong>3. Vendor Solvency:</strong> One vendor has had its GSTIN cancelled, resulting in a permanent ITC loss of ₹2.18L. Future transactions with this entity carry high regulatory risk.</p>

  <h3>STRATEGIC MITIGATIONS</h3>
  <ul class="report-list">
    <li><strong>Credit Note Automation:</strong> The finance team is deploying automated credit note nudges to resolve the ₹3.2L fulfillment exposure by 18 March.</li>
    <li><strong>Enterprise Escalation:</strong> Direct engagement with vendor leadership has been initiated to classify and unblock the ₹8.4L TDS credit prior to the advance tax deadline.</li>
    <li><strong>Payment Suspensions:</strong> All future payment runs to cancelled GSTIN entities have been suspended pending legal review.</li>
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
        <td>₹12.5L</td>
        <td>₹16.8L</td>
        <td><strong>₹29.3L</strong></td>
      </tr>
      <tr>
        <td><strong>Scenario B</strong> (resolve critical)</td>
        <td>₹7.1L</td>
        <td>₹16.8L</td>
        <td><strong>₹23.9L</strong></td>
      </tr>
      <tr class="highlight-row">
        <td><strong>Scenario C</strong> (resolve all)</td>
        <td>₹7.1L</td>
        <td>resolved</td>
        <td><strong>₹7.1L</strong></td>
      </tr>
    </tbody>
  </table>
  <p class="summary-text" style="margin-top: 16px; font-weight: 500; color: var(--nova-green-text);">Resolving all identified issues saves <strong>₹22.2L</strong> in working capital this month.</p>

  <div class="report-footer">
    Confidential &middot; Meridian Manufacturing Pvt Ltd
  </div>
</div>`;

    return NextResponse.json({
      controllerBrief,
      cfoPack
    });
  } catch (error) {
    console.error('Digest API Error:', error);
    return NextResponse.json({ error: 'Failed to generate digest' }, { status: 500 });
  }
}
