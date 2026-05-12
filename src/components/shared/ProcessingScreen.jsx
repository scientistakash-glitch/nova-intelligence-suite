import { CheckCircle, Loader } from 'lucide-react';

export default function ProcessingScreen({ title, steps, currentStep }) {
  const progressPercent = currentStep >= 0 ? (currentStep / (steps.length - 1)) * 100 : 0;
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% -20%, rgba(46, 157, 97, 0.05), var(--nova-bg) 60%)' }}>
      <div className="nova-card animate-fade-up" style={{ width: '480px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '3px', background: 'var(--nova-green)', width: `${progressPercent}%`, transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
        <h2 style={{ fontSize: '20px', marginBottom: '32px', color: 'var(--nova-navy)' }}>{title}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isActive = currentStep === index;
            const isPending = currentStep < index;
            
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: isPending ? 0.3 : 1, transition: 'opacity 0.4s', transform: isPending ? 'translateX(-10px)' : 'translateX(0)' }}>
                {isCompleted ? (
                  <CheckCircle size={22} className="text-nova-green" style={{color:'var(--nova-green)'}}/>
                ) : isActive ? (
                  <Loader size={22} className={index === steps.length - 1 ? "text-nova-green animate-spin" : "text-nova-muted animate-spin"} style={{color: index === steps.length - 1 ? 'var(--nova-green)' : 'var(--nova-muted)'}}/>
                ) : (
                  <div style={{width:22,height:22}}/>
                )}
                <span className={isActive ? "shimmer-text" : ""} style={{ fontSize: '15px', fontWeight: isActive ? '600' : '500' }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
