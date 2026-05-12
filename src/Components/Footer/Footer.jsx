import React from 'react'
import { Store } from 'lucide-react'

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        .footer-root {
          background: #fff;
          border-top: 1px solid #f1f5f9;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-family: 'DM Sans', 'Inter', sans-serif;
          flex-shrink: 0;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: -0.01em;
        }
        .footer-brand-icon {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .footer-copy {
          font-size: 11.5px;
          color: #cbd5e1;
          font-weight: 450;
        }
        .footer-tag {
          font-size: 10.5px;
          font-weight: 600;
          color: #6366f1;
          background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 4px;
          padding: 1px 7px;
          letter-spacing: 0.04em;
        }
      `}</style>
      <footer className="footer-root">
        <div className="footer-brand">
          <div className="footer-brand-icon">
            <Store size={11} color="white" />
          </div>
          Store-Xen POS
        </div>
        <span className="footer-copy">© {year} Store-Xen. All rights reserved.</span>
        <span className="footer-tag">PREMIUM</span>
      </footer>
    </>
  )
}