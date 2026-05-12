'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, AlertCircle, ArrowRight } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { 
      role: 'assistant', 
      type: 'text', 
      content: "Hi! I'm Nova Assistant.\n\nI can help you query across your AP exceptions, TDS shortfalls, and cash flow data." 
    },
    {
      role: 'assistant',
      type: 'menu'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping, isOpen]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-nova-chat', handleOpen);
    return () => window.removeEventListener('open-nova-chat', handleOpen);
  }, []);

  const handlePromptClick = (promptId, promptText) => {
    setChatHistory(prev => [...prev, { role: 'user', content: promptText }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'assistant', type: promptId }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleChatSubmit = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    setChatHistory(prev => [...prev, { role: 'user', content: userText }]);
    setIsTyping(true);

    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          type: 'text', 
          content: "I am currently running in demo mode.\n\nIn a live environment, Nova's conversational AI engine (powered by Claude 3.5 Haiku) would synthesize a customized response to your query by analyzing your ingested CSV templates." 
        }
      ]);
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'assistant', type: 'menu' }]);
        setIsTyping(false);
      }, 500);

    }, 1500);
  };

  const renderMessageContent = (msg) => {
    if (msg.type === 'text' || msg.role === 'user') {
      return (
        <div style={{ 
          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
          background: msg.role === 'user' ? 'var(--nova-navy)' : 'white', 
          color: msg.role === 'user' ? 'white' : 'var(--nova-navy)',
          padding: '12px 16px', 
          borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0', 
          border: msg.role === 'user' ? 'none' : '1px solid var(--nova-border)', 
          fontSize: '15px', 
          lineHeight: '1.5', 
          maxWidth: '90%',
          whiteSpace: 'pre-wrap'
        }}>
          {msg.content}
        </div>
      );
    }

    if (msg.type === 'menu') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '90%', alignSelf: 'flex-start' }}>
          <button 
            onClick={() => handlePromptClick('pinnacle', 'Show Pinnacle Industries risk')}
            style={{ textAlign: 'left', background: 'white', border: '1px solid var(--nova-border)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: 'var(--nova-navy)', cursor: 'pointer', fontWeight: '500', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          >
            Show Pinnacle Industries risk <ArrowRight size={14} style={{ float: 'right', color: 'var(--nova-muted)' }}/>
          </button>
          <button 
            onClick={() => handlePromptClick('tds', 'Q4 TDS Shortfalls')}
            style={{ textAlign: 'left', background: 'white', border: '1px solid var(--nova-border)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: 'var(--nova-navy)', cursor: 'pointer', fontWeight: '500', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          >
            Q4 TDS Shortfalls <ArrowRight size={14} style={{ float: 'right', color: 'var(--nova-muted)' }}/>
          </button>
          <button 
            onClick={() => handlePromptClick('cashflow', 'Summarize Friday Cash Flow')}
            style={{ textAlign: 'left', background: 'white', border: '1px solid var(--nova-border)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: 'var(--nova-navy)', cursor: 'pointer', fontWeight: '500', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          >
            Summarize Friday Cash Flow <ArrowRight size={14} style={{ float: 'right', color: 'var(--nova-muted)' }}/>
          </button>
        </div>
      );
    }

    if (msg.type === 'pinnacle') {
      return (
        <div style={{ alignSelf: 'flex-start', background: 'white', borderRadius: '12px 12px 12px 0', border: '1px solid var(--nova-border)', width: '90%', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--nova-surface)', borderBottom: '1px solid var(--nova-border)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--nova-navy)' }}>
            <AlertCircle size={16} color="var(--nova-red-text)" /> Pinnacle Industries Risk
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--nova-muted)' }}>Exceptions</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--nova-navy)' }}>9</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--nova-muted)' }}>Issue</span>
              <span style={{ fontSize: '13px', padding: '2px 8px', background: 'var(--nova-amber-bg)', color: 'var(--nova-amber-text)', borderRadius: '12px', fontWeight: '500' }}>Qty Mismatch</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--nova-border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--nova-muted)' }}>ITC at Risk</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--nova-red-text)' }}>₹3.2L</span>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === 'tds') {
      return (
        <div style={{ alignSelf: 'flex-start', background: 'white', borderRadius: '12px 12px 12px 0', border: '1px solid var(--nova-border)', width: '90%', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--nova-surface)', borderBottom: '1px solid var(--nova-border)', fontSize: '14px', fontWeight: '600', color: 'var(--nova-navy)' }}>
            Q4 TDS Shortfalls
          </div>
          <div style={{ padding: '16px', fontSize: '13px', color: 'var(--nova-muted)', lineHeight: '1.6' }}>
            You have <strong style={{color: 'var(--nova-red-text)'}}>₹16.8L</strong> of unconfirmed TDS credit. The primary exposure is:
            <div style={{ marginTop: '12px', padding: '12px', background: 'var(--nova-bg)', borderRadius: '8px', border: '1px solid var(--nova-border)' }}>
              <strong style={{ color: 'var(--nova-navy)' }}>Citadel Finance (₹8.4L)</strong><br/>
              Certificate overdue by 22 days. Section mismatch (194C vs 194J) needs clarification before advance tax filing on 15 March.
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === 'cashflow') {
      return (
        <div style={{ alignSelf: 'flex-start', background: 'white', borderRadius: '12px 12px 12px 0', border: '1px solid var(--nova-border)', width: '90%', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--nova-surface)', borderBottom: '1px solid var(--nova-border)', fontSize: '14px', fontWeight: '600', color: 'var(--nova-navy)' }}>
            Friday Cash Flow Impact
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--nova-label)', fontWeight: '600', marginBottom: '4px' }}>Scenario A: Do Nothing</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--nova-red-text)' }}>₹29.3L Outflow</div>
              <div style={{ fontSize: '12px', color: 'var(--nova-muted)' }}>(GST: ₹12.5L + TDS: ₹16.8L)</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--nova-label)', fontWeight: '600', marginBottom: '4px' }}>Scenario C: Resolve All</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--nova-green)' }}>₹7.1L Outflow</div>
              <div style={{ fontSize: '12px', color: 'var(--nova-muted)' }}>(GST: ₹7.1L + TDS: resolved)</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="no-print" style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999 }}>
      {isOpen ? (
        <div className="nova-card animate-fade-up" style={{ width: '380px', height: '560px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          {/* Header */}
          <div style={{ padding: '16px 24px', background: 'var(--nova-navy)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 24, height: 24, background: 'var(--nova-green)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', fontFamily: 'var(--font-display)' }}>N</span>
              </div>
              <span style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Nova Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, background: 'var(--nova-bg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {renderMessageContent(msg)}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '12px 12px 12px 0', border: '1px solid var(--nova-border)', fontSize: '14px', color: 'var(--nova-muted)' }}>
                Thinking...
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>



          {/* Input Area */}
          <div style={{ padding: '16px', background: 'white', borderTop: '1px solid var(--nova-border)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Ask about compliance, TDS, or AP..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleChatSubmit();
                }}
                style={{ flex: 1, padding: '10px 16px', borderRadius: '24px', border: '1px solid var(--nova-border)', outline: 'none', fontSize: '16px', fontFamily: 'inherit', background: 'var(--nova-bg)' }}
              />
              <button 
                onClick={handleChatSubmit}
                disabled={!inputValue.trim()}
                style={{ width: 38, height: 38, borderRadius: '50%', background: inputValue.trim() ? 'var(--nova-navy)' : 'var(--nova-muted)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputValue.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <style>{`
            @keyframes nova-pulse {
              0% { box-shadow: 0 0 0 0 rgba(13, 27, 42, 0.3); }
              70% { box-shadow: 0 0 0 12px rgba(13, 27, 42, 0); }
              100% { box-shadow: 0 0 0 0 rgba(13, 27, 42, 0); }
            }
            .nova-chatbot-btn {
              animation: nova-pulse 2.5s infinite;
            }
          `}</style>
          <button 
            className="nova-chatbot-btn"
            onClick={() => setIsOpen(true)}
            style={{ 
              height: '56px', 
              padding: '0 24px',
              borderRadius: '28px', 
              background: 'var(--nova-navy)', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s',
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: '600'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '18px' }}>✨</span> Ask Nova
          </button>
        </>
      )}
    </div>
  );
}
