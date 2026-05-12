'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LeftNav() {
  const pathname = usePathname();

  const navItems = [
    { id: '/', label: 'Home' },
    { id: '/filing-readiness', label: 'Filing Readiness' },
    { id: '/tds-tracker', label: 'TDS Tracker' },
    { id: '/weekly-digest', label: 'Weekly Digest' }
  ];

  return (
    <div className="no-print" style={{ width: '240px', background: 'var(--nova-surface)', borderRight: '1px solid var(--nova-border)', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '2px 0 12px rgba(0,0,0,0.02)' }}>
      <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--nova-border)' }}>
        <div style={{ width: 24, height: 24, background: 'var(--nova-navy)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', fontFamily: 'var(--font-display)' }}>N</span>
        </div>
        <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--nova-navy)', fontFamily: 'var(--font-display)' }}>Nova</span>
      </div>
      
      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map(item => {
          const isActive = pathname === item.id;
          return (
            <Link 
              key={item.id} 
              href={item.id}
              style={{ 
                padding: '10px 16px', 
                borderRadius: '8px', 
                background: isActive ? 'var(--nova-bg)' : 'transparent',
                color: isActive ? 'var(--nova-navy)' : 'var(--nova-muted)', 
                fontWeight: isActive ? '600' : '400', 
                textDecoration: 'none',
                transition: 'background 0.2s'
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
