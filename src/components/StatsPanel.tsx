interface Props {
  total: number
  count: number
  kind: 'G' | 'I'
  year: number
  loading: boolean
}

function fmtM(n: number) {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(2)} M€`
  if (n >= 1_000) return `${(n/1_000).toFixed(0)} K€`
  return `${n.toLocaleString('ca-ES')} €`
}

export default function StatsPanel({ total, count, kind, year, loading }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
      <div className="rounded-xl px-5 py-4" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Any</p>
        {loading
          ? <div className="skeleton h-7 w-16" />
          : <p className="text-2xl font-black" style={{ color: '#C8102E', fontFamily: 'Playfair Display, serif' }}>{year}</p>
        }
      </div>
      <div className="rounded-xl px-5 py-4" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total {kind === 'G' ? 'despeses' : 'ingressos'}</p>
        {loading
          ? <div className="skeleton h-7 w-32" />
          : <p className="text-2xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Playfair Display, serif' }}>{fmtM(total)}</p>
        }
      </div>
      <div className="rounded-xl px-5 py-4 col-span-2 sm:col-span-1" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Partides</p>
        {loading
          ? <div className="skeleton h-7 w-12" />
          : <p className="text-2xl font-black" style={{ color: '#D4A017', fontFamily: 'Playfair Display, serif' }}>{count}</p>
        }
      </div>
    </div>
  )
}
