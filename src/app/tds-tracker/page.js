'use client';

import { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import { AlertCircle, CheckCircle, Loader, X as XIcon } from 'lucide-react';
import LeftNav from '@/components/shared/LeftNav';
import MetricCard from '@/components/shared/MetricCard';
import VendorNudgeModal from '@/components/shared/VendorNudgeModal';
import ProcessingScreen from '@/components/shared/ProcessingScreen';

const formatRupees = (amount) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export default function TDSTracker() {
  const [appState, setAppState] = useState('hook'); // hook, processing, dashboard
  const [loadingStep, setLoadingStep] = useState(-1);
  const [tdsData, setTdsData] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [selectedDeductor, setSelectedDeductor] = useState(null);
  const [checklistState, setChecklistState] = useState({});
  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [nudgeDraft, setNudgeDraft] = useState('');

  const fileInputRef = useRef(null);

  const loadSampleData = async () => {
    setAppState('processing');
    
    // Step 0: Start
    setTimeout(() => setLoadingStep(0), 500);
    
    try {
      const response = await fetch('/tds-register-sample.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: async (results) => {
          setTimeout(() => setLoadingStep(1), 1500);
          
          setTdsData(results.data);
          
          setTimeout(() => setLoadingStep(2), 2500);
          
          setTimeout(async () => {
            setLoadingStep(3);
            
            try {
              const aiResponse = await fetch('/api/tds-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: results.data })
              });
              const aiResult = await aiResponse.json();
              setAiData(aiResult);
              
              setTimeout(() => {
                setLoadingStep(4);
                setTimeout(() => setAppState('dashboard'), 800);
              }, 1000);
              
            } catch (err) {
              console.error(err);
              setAppState('dashboard');
            }
            
          }, 3500);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) loadSampleData(); // Fallback to sample logic for demo simplicity
  };

  const handleGenerateNudge = (deductor) => {
    setNudgeDraft(`Drafting professional email to ${deductor} finance team...`);
    setShowNudgeModal(true);
    
    setTimeout(() => {
      setNudgeDraft(`To: finance@${deductor.toLowerCase().replace(/\s+/g, '')}.com\nSubject: Urgent: Form 16A Request - Q4 FY 2025-26\n\nDear ${deductor} Finance Team,\n\nWe are writing to request the Form 16A certificate for TDS deducted on payments made to us during Q4 FY 2025-26.\n\nOur records show TDS deducted under [section to be confirmed]. The certificate is required for our advance tax computation due 15 March.\n\nPlease share Form 16A at the earliest to avoid delays in our tax credit processing.\n\nRegards,\nFinance Team - Meridian Manufacturing Pvt Ltd`);
    }, 1500);
  };

  if (appState === 'hook') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% -20%, rgba(46, 157, 97, 0.05), var(--nova-bg) 60%)' }}>
        <div style={{ maxWidth: '1000px', width: '100%', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <h1 className="animate-fade-up" style={{ fontSize: '56px', color: 'var(--nova-navy)', lineHeight: '1.1', marginBottom: '48px', letterSpacing: '-0.02em', textAlign: 'center' }}>
            It's the 15th of March.
          </h1>
          
          <div className="animate-fade-up delay-100" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px', width: '100%' }}>
            {/* The Business Reality */}
            <div className="nova-card" style={{ background: '#fff', borderTop: '4px solid var(--nova-navy)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--nova-bg)', padding: '8px', borderRadius: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--nova-navy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 style={{ fontSize: '18px', color: 'var(--nova-navy)' }}>The Business Reality</h3>
              </div>
              <p style={{ color: 'var(--nova-muted)', lineHeight: '1.6' }}>
                Your company received ₹48L from clients this quarter. Each client deducted TDS before processing your payment. That TDS should appear as a credit in your Form 26AS.
              </p>
            </div>

            {/* The Compliance Reality */}
            <div className="nova-card" style={{ background: '#fff', borderTop: '4px solid var(--nova-amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--nova-amber-bg)', padding: '8px', borderRadius: '8px' }}>
                  <AlertCircle size={20} color="var(--nova-amber-text)" />
                </div>
                <h3 style={{ fontSize: '18px', color: 'var(--nova-navy)' }}>The Compliance Reality</h3>
              </div>
              <p style={{ color: 'var(--nova-muted)', lineHeight: '1.6' }}>
                Three clients haven't shared Form 16A yet. Two certificates have amounts that don't match your books. One client deducted at the wrong rate.
              </p>
            </div>
          </div>

          <p className="animate-fade-up delay-200" style={{ fontSize: '18px', color: 'var(--nova-navy-light)', lineHeight: '1.6', marginBottom: '48px', maxWidth: '720px', textAlign: 'center' }}>
            Nobody in your team knows how much TDS credit you're actually sitting on - or how much you'll have to pay in advance tax because of the shortfall.<br/><br/>
            <strong>Nova connects the dots instantly, backed by an AI-native conversational layer.</strong>
          </p>

          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
            <button className="nova-btn-primary pulse" onClick={loadSampleData}>
              Try with sample data
            </button>
            <button className="nova-btn-secondary" onClick={() => fileInputRef.current?.click()}>
              Upload Form 16A PDFs <span>↑</span>
            </button>
          </div>
          
          <input type="file" ref={fileInputRef} style={{display:'none'}} accept=".csv,.pdf" onChange={handleFileUpload} />
          
          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <a href="/tds-register-template.csv" download style={{ fontSize: '13px', color: 'var(--nova-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Template: TDS Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'processing') {
    return (
      <ProcessingScreen 
        title="Analysing TDS Receivables"
        steps={[
          "TDS register loaded",
          "Form 16A certificates parsed",
          "Calculating shortfalls and mismatches",
          "Generating TDS credit summary..."
        ]}
        currentStep={loadingStep}
      />
    );
  }

  const expectedTotal = tdsData.reduce((sum, r) => sum + (r.expected_tds || 0), 0);
  const confirmedTotal = tdsData.reduce((sum, r) => sum + (r.certificate_amount || 0), 0);
  const shortfallTotal = expectedTotal - confirmedTotal;
  const missingCount = tdsData.filter(r => r.certificate_received === 'No').length;

  // Calculate unblocked Advance Tax Cash Impact from checked actions
  const unblockedTax = Object.keys(checklistState).reduce((sum, index) => {
    if (checklistState[index] && aiData?.top_actions[index]) {
      return sum + aiData.top_actions[index].amount_at_risk;
    }
    return sum;
  }, 0);

  const currentCashImpact = shortfallTotal - unblockedTax;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nova-bg)', display: 'flex' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <div className="no-print" style={{ background: 'var(--nova-surface)', borderBottom: '1px solid var(--nova-border)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--nova-navy)' }}>TDS Credit Tracker - Q4 FY 2025-26</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--nova-muted)', fontSize: '14px' }}>
            <AlertCircle size={16} /> Advance tax due: 15 March
          </div>
        </div>

        <div style={{ padding: '32px', maxWidth: '1440px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
          
          {/* Horizontal Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
            <MetricCard 
              title="TDS CREDIT CONFIRMED" 
              value={formatRupees(confirmedTotal)} 
              color="green" 
              subtext={`${tdsData.length - missingCount} certificates matched`} 
            />

            <MetricCard 
              title="TDS SHORTFALL" 
              value={formatRupees(shortfallTotal)} 
              color="red" 
              delay="100"
              subtext={`${missingCount} deductors pending`} 
            />

            <MetricCard 
              title="CERTIFICATES MISSING" 
              value={`${missingCount} of ${tdsData.length}`} 
              color="amber" 
              delay="200"
              subtext="overdue by avg 22 days" 
            />

            <MetricCard 
              title="ADVANCE TAX IMPACT" 
              value={formatRupees(currentCashImpact)} 
              color="navy" 
              delay="300"
              subtext={unblockedTax > 0 ? `Saved ${formatRupees(unblockedTax)} via actions` : `additional cash outflow`} 
            />
          </div>

          {/* AI Header */}
          <div className="animate-fade-up delay-300" style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'var(--nova-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--nova-border)' }}>
             <div style={{ width: 28, height: 28, background: 'var(--nova-green-bg)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <span style={{ color: 'var(--nova-green-text)', fontSize: '14px' }}>✨</span>
              </div>
              <div>
                <span style={{ color: 'var(--nova-navy)', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  <strong>Nova Insight:</strong><br/>
                  {aiData?.summary}
                </span>
              </div>
          </div>

          {/* Deductor Table */}
          <div className="nova-card animate-fade-up delay-300" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="nova-table">
                <thead>
                  <tr>
                    <th>Deductor</th>
                    <th>TAN</th>
                    <th>Section</th>
                    <th>Expected</th>
                    <th>Certificate</th>
                    <th>Status</th>
                    <th>Shortfall</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tdsData.map((row, i) => {
                    const hasAction = aiData?.top_actions?.some(a => a.deductor === row.deductor_name);
                    const isError = row.shortfall > 0;
                    
                    return (
                      <tr key={i} onClick={() => setSelectedDeductor(row.deductor_name)} style={{ cursor: 'pointer' }} className="hover:bg-gray-50 transition-colors">
                        <td style={{ fontWeight: '600', color: 'var(--nova-navy)' }}>{row.deductor_name}</td>
                        <td style={{ color: 'var(--nova-muted)', fontSize: '13px' }}>{row.tan}</td>
                        <td>{row.tds_section}</td>
                        <td style={{ fontWeight: '500' }}>{formatRupees(row.expected_tds)}</td>
                        <td style={{ fontWeight: '500' }}>{row.certificate_received === 'Yes' ? formatRupees(row.certificate_amount) : '-'}</td>
                        <td>
                          <span className={`nova-badge ${isError ? 'red' : 'green'}`}>
                            {isError && <AlertCircle size={12}/>}
                            {!isError && <CheckCircle size={12}/>}
                            {row.status}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600', color: isError ? 'var(--nova-red-text)' : 'inherit' }}>
                          {row.shortfall > 0 ? formatRupees(row.shortfall) : '-'}
                        </td>
                        <td>
                          {hasAction ? (
                            <button className="nova-btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={(e) => { e.stopPropagation(); setSelectedDeductor(row.deductor_name); }}>
                              Review Issue
                            </button>
                          ) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="no-print animate-fade-up delay-300" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="nova-btn-secondary" onClick={() => window.print()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Export TDS Summary
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel Overlay */}
      {selectedDeductor && (() => {
        const d = tdsData.find(x => x.deductor_name === selectedDeductor);
        const hasAction = aiData?.top_actions?.some(a => a.deductor === selectedDeductor);

        return (
          <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, backdropFilter: 'blur(2px)', transition: 'all 0.3s' }} onClick={() => setSelectedDeductor(null)}>
            <div 
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '520px', background: '#fff', boxShadow: '-4px 0 32px rgba(0,0,0,0.15)', padding: '32px', overflowY: 'auto', animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', color: 'var(--nova-navy)', marginBottom: '4px' }}>{selectedDeductor}</h2>
                  <div style={{ fontSize: '14px', color: 'var(--nova-muted)', marginBottom: '12px' }}>TAN: {d.tan}</div>
                  <div className={`nova-badge ${d.shortfall > 0 ? 'red' : 'green'}`}>{d.status}</div>
                </div>
                <button onClick={() => setSelectedDeductor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nova-muted)' }}>
                  <XIcon size={24} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--nova-border)' }}>
                <div>
                  <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--nova-label)', letterSpacing: '0.5px', marginBottom: '12px' }}>YOUR REGISTER</h3>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Section:</strong> {d.tds_section}</div>
                  <div style={{ fontSize: '14px', color: 'var(--nova-muted)', marginBottom: '12px' }}>({d.nature_of_payment})</div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}><strong>Expected:</strong> {formatRupees(d.expected_tds)}</div>
                  <div style={{ fontSize: '14px', color: 'var(--nova-muted)' }}>Quarter: {d.quarter}</div>
                </div>
                <div>
                  <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--nova-label)', letterSpacing: '0.5px', marginBottom: '12px' }}>CERTIFICATE STATUS</h3>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: d.certificate_received === 'No' ? 'var(--nova-red-text)' : 'var(--nova-green-text)', marginBottom: '8px' }}>
                    {d.certificate_received === 'No' ? 'No Form 16A received' : `Form 16A received: ${formatRupees(d.certificate_amount)}`}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--nova-muted)' }}>{d.notes}</div>
                </div>
              </div>

              {hasAction && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--nova-muted)', letterSpacing: '0.5px', marginBottom: '16px', borderBottom: '1px solid var(--nova-border)', paddingBottom: '8px' }}>Action Required</h3>
                  {aiData.top_actions.map((action, i) => {
                    if (action.deductor !== selectedDeductor) return null;
                    return (
                      <label key={i} style={{ display: 'flex', gap: '16px', padding: '20px', border: '1px solid var(--nova-border)', borderRadius: '8px', cursor: 'pointer', background: checklistState[i] ? 'var(--nova-green-bg)' : '#fff', transition: 'background 0.2s' }}>
                        <input 
                          type="checkbox" 
                          checked={!!checklistState[i]} 
                          onChange={(e) => setChecklistState({...checklistState, [i]: e.target.checked})}
                          style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: 'var(--nova-green)' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: checklistState[i] ? 'var(--nova-green-text)' : 'var(--nova-navy)', textDecoration: checklistState[i] ? 'line-through' : 'none' }}>
                            {action.action}
                          </div>
                          <div style={{ color: 'var(--nova-muted)', fontSize: '14px' }}>
                            Secures {formatRupees(action.amount_at_risk)} advance tax impact
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {d.shortfall > 0 && (
                <div style={{ marginBottom: '32px', background: 'var(--nova-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--nova-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--nova-navy)', marginBottom: '4px' }}>Client Communication</h4>
                      <p style={{ fontSize: '13px', color: 'var(--nova-muted)' }}>Draft an email to resolve this TDS gap.</p>
                    </div>
                    <button className="nova-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => handleGenerateNudge(selectedDeductor)}>
                      Generate Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <VendorNudgeModal 
        isOpen={showNudgeModal}
        onClose={() => setShowNudgeModal(false)}
        title="Draft Certificate Request"
        draftText={nudgeDraft}
        onDraftChange={setNudgeDraft}
      />
    </div>
  );
}
