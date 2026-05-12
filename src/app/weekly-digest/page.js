'use client';

import { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import LeftNav from '@/components/shared/LeftNav';
import ProcessingScreen from '@/components/shared/ProcessingScreen';

export default function WeeklyDigest() {
  const [appState, setAppState] = useState('hook'); // hook, processing, dashboard
  const [loadingStep, setLoadingStep] = useState(-1);
  const [digestData, setDigestData] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [activeOutput, setActiveOutput] = useState(null);

  const fileInputRef = useRef(null);

  const loadSampleData = async () => {
    setAppState('processing');
    
    // Step 0: Start
    setTimeout(() => setLoadingStep(0), 500);
    
    try {
      const response = await fetch('/digest-data-sample.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: async (results) => {
          setTimeout(() => setLoadingStep(1), 1500);
          
          setDigestData(results.data);
          
          setTimeout(() => setLoadingStep(2), 2500);
          
          setTimeout(async () => {
            setLoadingStep(3);
            
            try {
              const aiResponse = await fetch('/api/digest', {
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
    if (file) {
      setAppState('processing');
      setTimeout(() => setLoadingStep(0), 500);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: async (results) => {
          setTimeout(() => setLoadingStep(1), 1500);
          setDigestData(results.data);
          setTimeout(() => setLoadingStep(2), 2500);
          
          setTimeout(async () => {
            setLoadingStep(3);
            try {
              const aiResponse = await fetch('/api/digest', {
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
    }
  };

  if (appState === 'hook') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% -20%, rgba(46, 157, 97, 0.05), var(--nova-bg) 60%)' }}>
        <div style={{ maxWidth: '1000px', width: '100%', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <h1 className="animate-fade-up" style={{ fontSize: '56px', color: 'var(--nova-navy)', lineHeight: '1.1', marginBottom: '48px', letterSpacing: '-0.02em', textAlign: 'center' }}>
            It's Friday afternoon.
          </h1>
          
          <div className="animate-fade-up delay-100" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px', width: '100%' }}>
            {/* The Finance Team's Reality */}
            <div className="nova-card" style={{ background: '#fff', borderTop: '4px solid var(--nova-navy)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--nova-bg)', padding: '8px', borderRadius: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--nova-navy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <h3 style={{ fontSize: '18px', color: 'var(--nova-navy)' }}>The Finance Team's Reality</h3>
              </div>
              <p style={{ color: 'var(--nova-muted)', lineHeight: '1.6' }}>
                Needs to prep the Monday morning brief. This means pulling Accounts Payable reports, GST summaries, vendor risk flags, and cash flow numbers from four different systems manually.
              </p>
            </div>

            {/* The CFO's Request */}
            <div className="nova-card" style={{ background: '#fff', borderTop: '4px solid var(--nova-green)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--nova-green-bg)', padding: '8px', borderRadius: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--nova-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <h3 style={{ fontSize: '18px', color: 'var(--nova-navy)' }}>The CFO's Request</h3>
              </div>
              <p style={{ color: 'var(--nova-muted)', lineHeight: '1.6' }}>
                Wants a strategic board pack update before the weekend. Both require the exact same underlying operational data, but completely different analytical outputs.
              </p>
            </div>
          </div>

          <p className="animate-fade-up delay-200" style={{ fontSize: '18px', color: 'var(--nova-navy-light)', lineHeight: '1.6', marginBottom: '48px', maxWidth: '720px', textAlign: 'center' }}>
            Right now, this requires hours of manual cross-referencing and writing.<br/><br/>
            <strong>Nova synthesizes both in 10 seconds.</strong> It is backed by a powerful AI-native conversational layer that lets your team query the entire finance stack instantly.
          </p>

          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
            <button className="nova-btn-primary pulse" onClick={loadSampleData}>
              Try with sample data
            </button>
            <button className="nova-btn-secondary" onClick={() => fileInputRef.current?.click()}>
              Upload weekly data <span>↑</span>
            </button>
          </div>
          
          <input type="file" ref={fileInputRef} style={{display:'none'}} accept=".csv" onChange={handleFileUpload} />
          
          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <a href="/digest-data-template.csv" download style={{ fontSize: '13px', color: 'var(--nova-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Template: Weekly Summary
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'processing') {
    return (
      <ProcessingScreen 
        title="Building your digest"
        steps={[
          "Weekly data loaded",
          "Risk assessed",
          "Generating Finance Team brief...",
          "Generating strategic CFO board pack..."
        ]}
        currentStep={loadingStep}
      />
    );
  }

  const printDocument = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nova-bg)', display: 'flex' }}>

      <style>{`
        .hover-lift:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.08) !important;
        }
        .report-content {
          font-family: var(--font-body);
          color: var(--nova-navy);
          line-height: 1.6;
          font-size: 15px;
        }
        .report-header {
          border-bottom: 2px solid var(--nova-navy);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }
        .report-header h2 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -0.01em;
        }
        .report-header p {
          color: var(--nova-muted);
          margin: 0;
          font-size: 15px;
        }
        .report-content h3 {
          font-family: var(--font-display);
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--nova-muted);
          border-bottom: 1px solid var(--nova-border);
          padding-bottom: 8px;
          margin: 32px 0 16px 0;
        }
        .report-content p {
          margin: 0 0 16px 0;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        .report-table td {
          padding: 12px 0;
          border-bottom: 1px solid var(--nova-border);
        }
        .report-table td:last-child {
          text-align: right;
        }
        .report-table.bordered th, .report-table.bordered td {
          padding: 12px 16px;
          border: 1px solid var(--nova-border);
        }
        .report-table.bordered th {
          background: var(--nova-bg);
          font-weight: 600;
          text-align: left;
          color: var(--nova-muted);
        }
        .report-table.bordered td:last-child, .report-table.bordered th:last-child {
          text-align: right;
        }
        .highlight-row {
          background: var(--nova-green-bg);
        }
        .highlight-row td {
          color: var(--nova-green-text);
          font-weight: 600;
        }
        .report-alert {
          background: var(--nova-bg);
          border-left: 4px solid var(--nova-amber);
          padding: 16px;
          margin-bottom: 16px;
          border-radius: 0 8px 8px 0;
        }
        .report-alert strong {
          display: block;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .report-alert .action {
          margin: 12px 0 0 0;
          color: var(--nova-amber-text);
          font-size: 14px;
        }
        .report-recommendation {
          background: var(--nova-navy);
          color: white;
          padding: 16px;
          border-radius: 8px;
          margin: 24px 0;
          font-weight: 500;
        }
        .report-list {
          margin: 0 0 24px 0;
          padding-left: 20px;
        }
        .report-list li {
          margin-bottom: 12px;
        }
        .report-footer {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid var(--nova-border);
          color: var(--nova-muted);
          font-size: 13px;
          text-align: center;
        }
      `}</style>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <div className="no-print" style={{ background: 'var(--nova-surface)', borderBottom: '1px solid var(--nova-border)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--nova-navy)' }}>Weekly Digest - Week of 17 March 2026</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--nova-muted)', fontSize: '14px' }}>
              <AlertCircle size={14} /> Data synced: 10 mins ago
            </div>
            {activeOutput && (
              <button className="nova-btn-primary" onClick={printDocument} style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Export PDF
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          
          {!activeOutput ? (
            <div className="animate-fade-up">
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--nova-navy)', marginBottom: '8px' }}>Synthesis Complete</h2>
              <p style={{ fontSize: '16px', color: 'var(--nova-muted)', marginBottom: '32px' }}>Select an intelligence output to view.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div 
                  className="nova-card hover-lift" 
                  onClick={() => setActiveOutput('controller')}
                  style={{ background: '#fff', cursor: 'pointer', borderTop: '4px solid var(--nova-navy)', padding: '32px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--nova-navy)', margin: 0 }}>Finance Team Weekly Brief</h3>
                    <div style={{ background: 'var(--nova-bg)', padding: '8px 16px', borderRadius: '24px', fontSize: '13px', fontWeight: '500', color: 'var(--nova-navy)' }}>
                      View Output &rarr;
                    </div>
                  </div>
                  <p style={{ fontSize: '15px', color: 'var(--nova-muted)', margin: 0, lineHeight: '1.6' }}>
                    Operational summary of Accounts Payable exceptions, TDS shortfalls, and prioritized action items for Monday morning.
                  </p>
                </div>

                <div 
                  className="nova-card hover-lift" 
                  onClick={() => setActiveOutput('cfo')}
                  style={{ background: '#fff', cursor: 'pointer', borderTop: '4px solid var(--nova-green)', padding: '32px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--nova-navy)', margin: 0 }}>CFO Board Pack Narrative</h3>
                    <div style={{ background: 'var(--nova-green-bg)', padding: '8px 16px', borderRadius: '24px', fontSize: '13px', fontWeight: '500', color: 'var(--nova-green-text)' }}>
                      View Output &rarr;
                    </div>
                  </div>
                  <p style={{ fontSize: '15px', color: 'var(--nova-muted)', margin: 0, lineHeight: '1.6' }}>
                    Strategic intelligence report detailing cash flow impact scenarios, compliance risk exposures, and high-level mitigations.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-up">
              <div className="no-print" style={{ marginBottom: '24px' }}>
                <button 
                  onClick={() => setActiveOutput(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--nova-muted)', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}
                >
                  &larr; Back to Outputs
                </button>
              </div>
              
              <div className="nova-card" style={{ padding: '48px', maxWidth: '800px', margin: '0 auto', background: '#fff', minHeight: '600px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                {activeOutput === 'controller' ? (
                  <div dangerouslySetInnerHTML={{ __html: aiData?.controllerBrief }} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: aiData?.cfoPack }} />
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
