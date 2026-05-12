'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--nova-bg)', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1, maxWidth: '900px', margin: '0 auto', padding: '80px 32px', width: '100%' }}>
        
        {/* Section 2 - Hero */}
        <div className="animate-fade-up" style={{ marginBottom: '80px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: '700', color: 'var(--nova-navy)', lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Three intelligence modules Nova requires today.
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--nova-muted)', lineHeight: '1.6', marginBottom: '40px' }}>
            Bridging the gap between accounting domain expertise and AI-native product execution.
          </p>

        </div>

        {/* Section 3 - About Akash */}
        <div className="animate-fade-up delay-100" style={{ marginBottom: '80px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '600', color: 'var(--nova-navy)', marginBottom: '24px' }}>
            About Me
          </h2>
          <div style={{ fontSize: '16px', color: 'var(--nova-navy-light)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px' }}>
            <p>
              <strong>Hi, I'm Akash Vishwakarma.</strong> I am a product and growth PM with 8 years across EdTech, PropTech, Media, and consumer apps.
            </p>
            <p>
              I co-founded Kirana Friends - scaled to 250K users organically, recognised by Google and MeitY as one of India's fastest-growing startups in 2023.
            </p>
            <p>
              Currently at Turbostart, I work with portfolio companies to build AI products for enterprise clients including Manipal Group, KIIT, Lodha, Godrej, and Hiranandani.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', border: '1px solid var(--nova-border)', borderRadius: '8px', padding: '8px 16px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--nova-label)', fontWeight: '600', letterSpacing: '0.5px' }}>Scale</span>
              <span style={{ fontSize: '14px', fontFamily: 'var(--font-display)', fontWeight: '600', color: 'var(--nova-navy)' }}>250K users · Kirana Friends</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--nova-border)', borderRadius: '8px', padding: '8px 16px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--nova-label)', fontWeight: '600', letterSpacing: '0.5px' }}>Revenue</span>
              <span style={{ fontSize: '14px', fontFamily: 'var(--font-display)', fontWeight: '600', color: 'var(--nova-navy)' }}>₹1Cr MRR · Streambox</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--nova-border)', borderRadius: '8px', padding: '8px 16px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--nova-label)', fontWeight: '600', letterSpacing: '0.5px' }}>B2B Expertise</span>
              <span style={{ fontSize: '14px', fontFamily: 'var(--font-display)', fontWeight: '600', color: 'var(--nova-navy)' }}>8 enterprise clients · Turbostart</span>
            </div>
          </div>
        </div>

        {/* Section 4 - The Tools */}
        <div className="animate-fade-up delay-200" style={{ marginBottom: '40px', maxWidth: '720px' }}>
          <p style={{ fontSize: '16px', color: 'var(--nova-navy)', lineHeight: '1.6' }}>
            I am no expert, but I have tried to do something in the domain of finance with the help of AI. These four tools were built to show what happens when someone who understands both the product and the domain sits down with Claude and decides to ship something real.
          </p>
        </div>
        <div className="animate-fade-up delay-200" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '80px' }}>
          
          {/* Card 1 */}
          <Link href="/filing-readiness" className="nova-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '600', color: 'var(--nova-navy)', marginBottom: '16px' }}>
              Filing Readiness
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--nova-muted)', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
              Accounts Payable exceptions and GSTR-2B discrepancies resolved at the vendor level. Filing readiness score. Cash flow impact. Vendor nudge engine.<br/><br/>
              <strong>The join layer Nova doesn't have today.</strong>
            </p>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--nova-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open tool →
            </span>
          </Link>

          {/* Card 2 */}
          <Link href="/tds-tracker" className="nova-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '600', color: 'var(--nova-navy)', marginBottom: '16px' }}>
              TDS Tracker
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--nova-muted)', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
              Upload Form 16A certificates. See TDS credit claimed vs books vs missing. Chase clients automatically.<br/><br/>
              <strong>The receivables blind spot Nova hasn't touched yet.</strong>
            </p>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--nova-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open tool →
            </span>
          </Link>

          {/* Card 3 */}
          <Link href="/weekly-digest" className="nova-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '600', color: 'var(--nova-navy)', marginBottom: '16px' }}>
              Weekly Digest + CFO Pack
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--nova-muted)', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
              One upload. Two outputs. A finance team brief for Monday morning and a CFO narrative for Friday's board pack.<br/><br/>
              <strong>The synthesis layer that bridges operational execution and strategic planning.</strong>
            </p>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--nova-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open tool →
            </span>
          </Link>

          {/* Card 4 - Chatbot */}
          <div 
            className="nova-card" 
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new Event('open-nova-chat'));
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '600', color: 'var(--nova-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>✨</span> Nova Assistant
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--nova-muted)', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
              A unified insights layer that lets you query your entire finance stack instantly. Get automated answers on AP risks, GST mismatches, and cash flow.<br/><br/>
              <strong>The conversational AI interface that ties everything together.</strong>
            </p>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--nova-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open tool →
            </span>
          </div>

        </div>

        {/* Section 5 - Footer */}
        <div className="animate-fade-up delay-300" style={{ borderTop: '1px solid var(--nova-border)', paddingTop: '40px', paddingBottom: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--nova-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
            Built with Claude, Next.js, and an understanding of what a finance team's Monday morning actually looks like.
          </p>
          <div style={{ fontSize: '14px', color: 'var(--nova-navy)', fontWeight: '500' }}>
            Akash Vishwakarma · vish.akash101@gmail.com · <a href="https://linkedin.com/in/akash-vishwakarma-2179831a" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nova-green)', textDecoration: 'none' }}>LinkedIn</a>
          </div>
        </div>

      </div>
    </div>
  );
}
