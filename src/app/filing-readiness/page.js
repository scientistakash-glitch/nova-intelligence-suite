"use client";

import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import LeftNav from '@/components/shared/LeftNav';
import MetricCard from '@/components/shared/MetricCard';
import VendorNudgeModal from '@/components/shared/VendorNudgeModal';
import ProcessingScreen from '@/components/shared/ProcessingScreen';

// --- SVG Icons ---
const CheckCircle = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const AlertCircle = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Loader = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}>
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line>
  </svg>
);

const XIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Formatter ---
const formatRupees = (num) => {
  if (!num) return '₹0';
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  return `₹${num.toLocaleString('en-IN')}`;
};

export default function NovaDemo() {
  const [appState, setAppState] = useState('hook'); // 'hook', 'processing', 'dashboard'
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeTab, setActiveTab] = useState('vendor'); // 'vendor' | 'checklist'
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  const [apData, setApData] = useState([]);
  const [gstData, setGstData] = useState([]);
  const [aiData, setAiData] = useState(null);
  
  const [checklistState, setChecklistState] = useState({});
  const [readinessOverride, setReadinessOverride] = useState(null);

  const fileInputApRef = useRef(null);
  const fileInputGstRef = useRef(null);

  const loadSampleData = async () => {
    setAppState('processing');
    setLoadingStep(0);
    
    // Simulate parsing delays
    const apRes = await fetch('/ap_exceptions_sample.csv');
    const apText = await apRes.text();
    const parsedAp = Papa.parse(apText, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
    setApData(parsedAp);
    
    setTimeout(() => setLoadingStep(1), 500);
    
    const gstRes = await fetch('/gstr_2b_status_sample.csv');
    const gstText = await gstRes.text();
    const parsedGst = Papa.parse(gstText, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
    setGstData(parsedGst);
    
    setTimeout(() => setLoadingStep(2), 1000);
    
    // Process Data
    const apSummary = parsedAp.reduce((acc, row) => {
      acc[row.vendor_name] = (acc[row.vendor_name] || 0) + 1;
      return acc;
    }, {});
    
    const gstSummary = parsedGst.reduce((acc, row) => {
      if(row.status !== 'Matched') {
        acc[row.vendor_name] = (acc[row.vendor_name] || 0) + row.itc_at_risk;
      }
      return acc;
    }, {});
    
    const dualRiskVendors = Object.keys(apSummary).filter(v => Object.keys(gstSummary).includes(v));
    const totalBooked = parsedGst.reduce((sum, r) => sum + (r.booked_amount || 0), 0);
    const totalAtRisk = parsedGst.reduce((sum, r) => sum + (r.itc_at_risk || 0), 0);
    const totalMatched = totalBooked - totalAtRisk;

    setTimeout(async () => {
      setLoadingStep(3);
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apSummary, gstSummary, dualRiskVendors, totalBooked, totalMatched, totalAtRisk,
            deadline: "20 March 2026",
            daysRemaining: 6
          })
        });
        const data = await res.json();
        setAiData(data);
        setLoadingStep(4);
        setTimeout(() => setAppState('dashboard'), 500);
      } catch (err) {
        console.error(err);
        setAppState('dashboard'); // fallback
      }
    }, 1500);
  };

  const handleFileUpload = (e) => {
    // Simplified for demo: assuming users click both or just "Try Sample"
    // To implement file reading properly, you'd read both files via FileReader
    alert("In this demo, please use 'Try with sample data' for the full experience, or ensure your local dev has the API keys configured.");
  };

  const currentReadiness = readinessOverride !== null 
    ? readinessOverride 
    : (aiData?.readiness_percent || 74);

  // Group vendors for the table
  const tableVendors = gstData.map(g => {
    const apExceptionsCount = apData.filter(a => a.vendor_name === g.vendor_name).length;
    const apType = apExceptionsCount > 0 ? apData.find(a => a.vendor_name === g.vendor_name).exception_type : '-';
    const isDual = apExceptionsCount > 0 && g.status !== 'Mismatch' && g.status !== 'Matched';
    
    let flag = { label: 'Safe', class: 'green' };
    if (isDual) flag = { label: 'Dual risk', class: 'red' };
    else if (g.status === 'Missing' || g.status === 'GSTIN Cancelled') flag = { label: 'Critical', class: 'red' };
    else if (apExceptionsCount > 0 || g.status === 'Mismatch') flag = { label: 'Watch', class: 'amber' };
    
    return {
      vendor: g.vendor_name,
      apExceptions: apExceptionsCount,
      apType,
      status: g.status,
      itcRisk: g.itc_at_risk,
      flag,
      hasAction: aiData?.top_actions?.some(a => a.vendor === g.vendor_name)
    };
  });

  const activeChecklistCount = Object.values(checklistState).filter(Boolean).length;
  const totalChecklist = aiData?.top_actions?.length || 0;
  
  // Cash flow logic
  const baseLiability = 2000000; // Rs 20L monthly liability
  const totalMatchedITC = gstData.filter(g => g.status === 'Matched').reduce((sum, g) => sum + g.booked_amount, 0);
  
  // Calculate unblocked ITC from checked actions
  const unblockedITC = Object.keys(checklistState).reduce((sum, index) => {
    if (checklistState[index] && aiData?.top_actions[index]) {
      return sum + aiData.top_actions[index].amount_unblocked;
    }
    return sum;
  }, 0);

  const currentCashOutflow = baseLiability - totalMatchedITC - unblockedITC;

  useEffect(() => {
    if (totalChecklist > 0 && activeChecklistCount === totalChecklist) {
      setReadinessOverride(100);
    } else if (activeChecklistCount > 0) {
      setReadinessOverride((aiData?.readiness_percent || 74) + (Math.floor((100 - (aiData?.readiness_percent || 74)) * (activeChecklistCount / totalChecklist))));
    } else {
      setReadinessOverride(null);
    }
  }, [checklistState, activeChecklistCount, totalChecklist, aiData]);

  // Nudge Modal State
  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [nudgeDraft, setNudgeDraft] = useState('');
  
  const handleGenerateNudge = (vendor) => {
    setNudgeDraft(`Drafting professional email to ${vendor} accounts team...`);
    setShowNudgeModal(true);
    
    // Simulate API call for draft generation
    setTimeout(() => {
      setNudgeDraft(`To: accounts@${vendor.toLowerCase().replace(/\s+/g, '')}.com\nSubject: Urgent: GSTR-1 Filing Required / Mismatch Resolution\n\nDear ${vendor} Team,\n\nWe note an outstanding issue regarding our recent invoice reconciliation that requires your immediate attention to unblock Input Tax Credit before our filing deadline on the 20th.\n\nPlease review your GSTR-1 filing status or correct the quantities as discussed.\n\nRegards,\nAccounts Payable Team\nMeridian Manufacturing Pvt Ltd`);
    }, 1500);
  };

  if (appState === 'hook') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% -20%, rgba(46, 157, 97, 0.05), var(--nova-bg) 60%)' }}>
        <div style={{ maxWidth: '1000px', width: '100%', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <h1 className="animate-fade-up" style={{ fontSize: '56px', color: 'var(--nova-navy)', lineHeight: '1.1', marginBottom: '48px', letterSpacing: '-0.02em', textAlign: 'center' }}>
            It's the 14th.<br/>You have 6 days to file GSTR-3B.
          </h1>
          
          <div className="animate-fade-up delay-100" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px', width: '100%' }}>
            {/* The AP Reality */}
            <div className="nova-card" style={{ background: '#fff', borderTop: '4px solid var(--nova-amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--nova-amber-bg)', padding: '8px', borderRadius: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--nova-amber-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <h3 style={{ fontSize: '18px', color: 'var(--nova-navy)' }}>The Accounts Reality</h3>
              </div>
              <p style={{ color: 'var(--nova-muted)', lineHeight: '1.6' }}>
                Your Accounts Payable Team is chasing <strong>14 unresolved invoice exceptions</strong>. Goods haven't arrived, quantities don't match, and Goods Receipt Notes (GRN) are still pending.
              </p>
            </div>

            {/* The Tax Reality */}
            <div className="nova-card" style={{ background: '#fff', borderTop: '4px solid var(--nova-red)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--nova-red-bg)', padding: '8px', borderRadius: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--nova-red-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <h3 style={{ fontSize: '18px', color: 'var(--nova-navy)' }}>The Tax Reality</h3>
              </div>
              <p style={{ color: 'var(--nova-muted)', lineHeight: '1.6' }}>
                Meanwhile, your GST portal just generated GSTR-2B and shows <strong>5 missing invoices</strong>. <span style={{ color: 'var(--nova-red-text)', fontWeight: '600' }}>₹5.4 Lakhs in Input Tax Credit</span> is currently at risk.
              </p>
            </div>
          </div>

          <p className="animate-fade-up delay-200" style={{ fontSize: '18px', color: 'var(--nova-navy-light)', lineHeight: '1.6', marginBottom: '48px', maxWidth: '720px', textAlign: 'center' }}>
            Right now, these teams are working in silos. Nobody knows which Accounts Payable exceptions are causing the GST gaps, or exactly how much money you will permanently lose if you click "File" today. <br/><br/>
            <strong>Nova changes that by instantly connecting the dots.</strong>
          </p>

          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
            <button className="nova-btn-primary pulse" onClick={loadSampleData}>
              Try with sample data
            </button>
            <button className="nova-btn-secondary" onClick={() => fileInputApRef.current?.click()}>
              Upload my files <span>↑</span>
            </button>
          </div>
          
          <input type="file" ref={fileInputApRef} style={{display:'none'}} accept=".csv" onChange={handleFileUpload} />
          
          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <a href="/ap_exceptions_template.csv" download style={{ fontSize: '13px', color: 'var(--nova-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Template: Accounts Payable Exceptions
            </a>
            <a href="/gstr_2b_status_template.csv" download style={{ fontSize: '13px', color: 'var(--nova-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Template: GSTR-2B
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'processing') {
    return (
      <ProcessingScreen 
        title="Analysing your data"
        steps={[
          "Accounts Payable exceptions loaded",
          "GSTR-2B status loaded",
          "Joined on vendor name",
          "Generating filing readiness summary..."
        ]}
        currentStep={loadingStep}
      />
    );
  }

  // Dashboard
  const atRiskAmount = gstData.reduce((sum, row) => sum + (row.itc_at_risk || 0), 0);
  const exceptionsCount = apData.length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nova-bg)', display: 'flex' }}>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <div className="no-print" style={{ background: 'var(--nova-surface)', borderBottom: '1px solid var(--nova-border)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--nova-navy)' }}>Filing Readiness - March 2026</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--nova-muted)', fontSize: '14px' }}>
            <AlertCircle size={16} /> 6 Days Remaining · GSTR-3B due 20 Mar
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '32px', maxWidth: '1440px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
          
          {/* Horizontal Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
            
            <MetricCard 
              title="FILING READINESS" 
              value={`${currentReadiness}%`} 
              color={currentReadiness > 90 ? 'green' : 'amber'} 
              subtext="Safe to file above 90%"
            >
              <div style={{ height: '8px', background: 'var(--nova-border)', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--nova-green)', width: `${currentReadiness}%`, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
              </div>
            </MetricCard>

            <MetricCard 
              title="ITC AT RISK" 
              value={formatRupees(atRiskAmount)} 
              color="red" 
              delay="100"
              subtext={`across ${gstData.filter(g => g.itc_at_risk > 0).length} vendors`} 
            />

            <MetricCard 
              title="ACCOUNTS PAYABLE EXCEPTIONS" 
              value={exceptionsCount} 
              color="amber" 
              delay="200"
              subtext={`${apData.filter(a => a.vendor_name === 'Pinnacle Industries').length} from Pinnacle`} 
            />

            <MetricCard 
              title="EST. GST CASH OUTFLOW" 
              value={formatRupees(currentCashOutflow)} 
              color="navy" 
              delay="300"
              subtext={unblockedITC > 0 ? `Saved ${formatRupees(unblockedITC)} via checklist` : `Based on ₹20L liability`} 
            />

          </div>

          {/* AI Header for Table */}
          <div className="animate-fade-up delay-300" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--nova-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--nova-border)' }}>
             <div style={{ width: 28, height: 28, background: 'var(--nova-green-bg)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'var(--nova-green-text)', fontSize: '14px' }}>✨</span>
              </div>
              <span style={{ color: 'var(--nova-navy)', fontSize: '15px', lineHeight: '1.5' }}>
                 <strong>Nova Insight:</strong> Do not file yet. Your Accounts Payable Team flagged 9 issues with Pinnacle Industries. Review their Priority Actions in the table below to unblock ₹3.2L in Input Tax Credit.
              </span>
          </div>

          {/* Vendor Risk Table */}
          <div className="nova-card animate-fade-up delay-300" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="nova-table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Exceptions</th>
                    <th>Type</th>
                    <th>2B Status</th>
                    <th>ITC At Risk</th>
                    <th>Risk Flag</th>
                    <th>Priority Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableVendors.map((row, i) => (
                    <tr key={i} onClick={() => setSelectedVendor(row.vendor)} style={{ cursor: 'pointer' }} className="hover:bg-gray-50 transition-colors">
                      <td style={{ fontWeight: '600', color: 'var(--nova-navy)' }}>{row.vendor}</td>
                      <td>
                        {row.apExceptions > 0 ? <span className="nova-badge amber">{row.apExceptions}</span> : '-'}
                      </td>
                      <td style={{ color: 'var(--nova-muted)' }}>{row.apType}</td>
                      <td>{row.status}</td>
                      <td style={{ fontWeight: '500' }}>{row.itcRisk > 0 ? formatRupees(row.itcRisk) : '-'}</td>
                      <td>
                        <span className={`nova-badge ${row.flag.class}`}>
                          {row.flag.class === 'red' && <AlertCircle size={12}/>}
                          {row.flag.class === 'green' && <CheckCircle size={12}/>}
                          {row.flag.class === 'amber' && <AlertCircle size={12}/>}
                          {row.flag.label}
                        </span>
                      </td>
                      <td>
                        {row.hasAction ? (
                          <button className="nova-btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={(e) => { e.stopPropagation(); setSelectedVendor(row.vendor); }}>
                            Review Action
                          </button>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="no-print animate-fade-up delay-300" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="nova-btn-secondary" onClick={() => window.print()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Export Filing Brief
            </button>
          </div>

        </div>
      </div>

      {/* Side Panel Overlay */}
      {selectedVendor && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, backdropFilter: 'blur(2px)', transition: 'all 0.3s' }} onClick={() => setSelectedVendor(null)}>
          <div 
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '480px', background: '#fff', boxShadow: '-4px 0 32px rgba(0,0,0,0.15)', padding: '32px', overflowY: 'auto', animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '24px', color: 'var(--nova-navy)', marginBottom: '8px' }}>{selectedVendor}</h2>
                <div className="nova-badge red">Vendor Drill-Down</div>
              </div>
              <button onClick={() => setSelectedVendor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nova-muted)' }}>
                <XIcon size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '32px', background: 'var(--nova-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--nova-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--nova-navy)', marginBottom: '4px' }}>Vendor Communication</h4>
                  <p style={{ fontSize: '13px', color: 'var(--nova-muted)' }}>Draft an email to resolve pending exceptions.</p>
                </div>
                <button className="nova-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => handleGenerateNudge(selectedVendor)}>
                  Draft Nudge
                </button>
              </div>
            </div>

            {aiData?.top_actions?.some(a => a.vendor === selectedVendor) && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--nova-muted)', letterSpacing: '0.5px', marginBottom: '16px', borderBottom: '1px solid var(--nova-border)', paddingBottom: '8px' }}>Priority Pre-Filing Action</h3>
                {aiData.top_actions.map((action, i) => {
                  if (action.vendor !== selectedVendor) return null;
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
                          Unblocks {formatRupees(action.amount_unblocked)} ITC
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--nova-muted)', letterSpacing: '0.5px', marginBottom: '16px', borderBottom: '1px solid var(--nova-border)', paddingBottom: '8px' }}>Accounts Payable Exceptions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {apData.filter(a => a.vendor_name === selectedVendor).length === 0 && <p style={{color:'var(--nova-muted)'}}>No Accounts Payable exceptions recorded.</p>}
              {apData.filter(a => a.vendor_name === selectedVendor).map((item, i) => (
                <div key={i} style={{ background: 'var(--nova-expanded-row-bg)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--nova-amber)' }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                    <span>{item.invoice_number}</span>
                    <span style={{ color: 'var(--nova-muted)' }}>{item.po_number}</span>
                    <span style={{ color: 'var(--nova-muted)' }}>{item.grn_number || 'No GRN'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--nova-amber-text)', fontSize: '14px' }}>
                    <AlertCircle size={14} /> {item.exception_detail}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--nova-muted)', letterSpacing: '0.5px', marginBottom: '16px', borderBottom: '1px solid var(--nova-border)', paddingBottom: '8px' }}>GSTR-2B Status</h3>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
              {gstData.filter(g => g.vendor_name === selectedVendor).map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--nova-muted)' }}>Booked Amount:</span>
                    <span style={{ fontWeight: '600' }}>{formatRupees(item.booked_amount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--nova-muted)' }}>Amount in 2B:</span>
                    <span style={{ fontWeight: '600' }}>{formatRupees(item.amount_in_2b)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px dashed var(--nova-border)' }}>
                    <span style={{ color: 'var(--nova-red-text)', fontWeight: '600' }}>ITC at Risk:</span>
                    <span style={{ color: 'var(--nova-red-text)', fontWeight: '700' }}>{formatRupees(item.itc_at_risk)}</span>
                  </div>
                  <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--nova-muted)' }}>{item.notes}</p>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '48px' }}>
              <button className="nova-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setSelectedVendor(null)}>
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      <VendorNudgeModal 
        isOpen={showNudgeModal}
        onClose={() => setShowNudgeModal(false)}
        title="Draft Vendor Nudge"
        draftText={nudgeDraft}
        onDraftChange={setNudgeDraft}
      />
    </div>
  );
}
