export default function Footer({ onNavigate }) {
  return (
    <footer>
      <div className="wrap">
        <div>
          <img
            className="flogo"
            src="/logo-footer.png"
            alt="Fixovia – On-Demand Home Repairs, Your Trusted Home Repair Partner"
            style={{ height: '74px', width: 'auto', display: 'block', marginBottom: '12px' }}
          />
          <p style={{ color: 'var(--slate)', maxWidth: '320px', lineHeight: 1.6, fontSize: '0.92rem' }}>
            On-demand, background-verified home repair services across Punjab.
          </p>
        </div>

        <div>
          <b style={{ display: 'block', marginBottom: '10px', color: 'var(--ink)' }}>Service Areas (Punjab)</b>
          <div style={{ color: 'var(--slate)', lineHeight: 1.8, fontSize: '0.92rem' }}>
            Ludhiana • Amritsar • Jalandhar • Patiala • Mohali (SAS Nagar) • Bathinda • Pathankot • Hoshiarpur • Zirakpur • Khanna • Phagwara
          </div>
        </div>

        <div>
          <b style={{ display: 'block', marginBottom: '10px', color: 'var(--ink)' }}>Quick Links</b>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem' }}>
            <button
              onClick={() => onNavigate('services')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--slate)', cursor: 'pointer' }}
            >
              All Repair Services
            </button>
            <button
              onClick={() => onNavigate('how')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--slate)', cursor: 'pointer' }}
            >
              How Fixovia Works
            </button>
            <button
              onClick={() => onNavigate('safety')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--slate)', cursor: 'pointer' }}
            >
              Doorstep Safety PIN Guarantee
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--slate)', cursor: 'pointer' }}
            >
              Transparent Price Cards
            </button>
            <button
              onClick={() => onNavigate('find')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--coral2)', cursor: 'pointer', fontWeight: 600 }}
            >
              Browse Verified Pros ➔
            </button>
            <button
              onClick={() => onNavigate('auth')}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--mute)', cursor: 'pointer', fontSize: '0.84rem' }}
            >
              Join as a Service Partner
            </button>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          style={{
            width: '100%',
            marginTop: '32px',
            paddingTop: '18px',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.86rem',
            color: 'var(--slate)',
          }}
        >
          <div>© 2026 Fixovia Technologies India Pvt. Ltd. All rights reserved.</div>
          <div>
            Designed with ❤️ by{' '}
            <a
              href="https://pocketsitestudio.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--coral2)', fontWeight: 600, textDecoration: 'underline' }}
            >
              PocketSite Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
