import { X as XIcon } from 'lucide-react';

export default function VendorNudgeModal({ 
  isOpen, 
  onClose, 
  title = "Draft Vendor Nudge", 
  draftText, 
  onDraftChange, 
  onSend 
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="no-print" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }} 
      onClick={onClose}
    >
      <div 
        className="nova-card animate-fade-up" 
        style={{ width: '540px', padding: '32px', position: 'relative' }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--nova-navy)', fontWeight: '600' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nova-muted)' }}>
            <XIcon size={20} />
          </button>
        </div>
        
        <textarea 
          value={draftText}
          onChange={(e) => onDraftChange(e.target.value)}
          style={{ width: '100%', height: '240px', padding: '16px', borderRadius: '8px', border: '1px solid var(--nova-border)', background: 'var(--nova-bg)', fontSize: '14px', lineHeight: '1.6', color: 'var(--nova-navy)', fontFamily: 'inherit', resize: 'vertical', marginBottom: '24px' }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="nova-btn-secondary" onClick={() => navigator.clipboard.writeText(draftText)}>
            Copy to Clipboard
          </button>
          <button className="nova-btn-primary" onClick={() => { if(onSend) onSend(); onClose(); }}>
            Send via Email
          </button>
        </div>
      </div>
    </div>
  );
}
