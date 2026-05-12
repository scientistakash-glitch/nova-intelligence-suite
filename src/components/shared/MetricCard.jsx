export default function MetricCard({ title, value, subtext, color, delay = 0, style, children }) {
  return (
    <div className={`nova-metric-card ${color} animate-fade-up delay-${delay}`} style={style}>
      <div className="metric-label" style={{ color: color === 'navy' ? 'rgba(255,255,255,0.7)' : undefined }}>
        {title}
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color === 'navy' ? 'var(--nova-surface)' : `var(--nova-${color})` }} />
      </div>
      <div className="metric-value" style={{ color: color === 'navy' ? '#fff' : undefined }}>{value}</div>
      {children}
      <div className="metric-subtext" style={{ color: color === 'navy' ? 'rgba(255,255,255,0.6)' : undefined }}>{subtext}</div>
    </div>
  );
}
