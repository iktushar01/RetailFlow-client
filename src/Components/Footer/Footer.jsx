import React from 'react'
import { Store } from 'lucide-react'

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        .ftr-root {
          background: var(--background);
          border-top: 1px solid var(--border);
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          flex-shrink: 0;
        }
        .ftr-brand {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .ftr-brand-icon {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ftr-copy {
          font-size: 11.5px;
          color: var(--muted-foreground);
          opacity: 0.6;
          font-weight: 450;
        }
        .ftr-tag {
          font-size: 10.5px;
          font-weight: 600;
          color: #6366f1;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 4px;
          padding: 1px 8px;
          letter-spacing: 0.06em;
        }
      `}</style>

      <footer className="ftr-root">
        <div className="ftr-brand">
          <div className="ftr-brand-icon">
            <Store size={11} color="white" />
          </div>
          
RetailFlow
        </div>
        <span className="ftr-copy">© {year} Store-Xen. All rights reserved.</span>
        <span className="ftr-tag">PREMIUM</span>
      </footer>
    </>
  )
}