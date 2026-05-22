export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(245,240,232,0.92)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(200,16,46,0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Escut */}
          <div
            className="w-7 h-7 rounded flex items-center justify-center font-black text-white text-xs"
            style={{ background: '#C8102E' }}
          >
            T
          </div>
          <span
            className="font-semibold text-sm tracking-tight"
            style={{ color: '#1A1A2E', fontFamily: 'DM Sans, sans-serif' }}
          >
            Pressupost Terrassa
          </span>
        </div>
        <a
          href="https://opendata.terrassa.cat"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-red-700 transition-colors flex items-center gap-1"
        >
          Dades oficials
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </header>
  )
}
