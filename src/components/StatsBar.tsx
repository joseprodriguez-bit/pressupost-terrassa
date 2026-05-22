import type { Record } from '@/app/page'

interface Props {
  total: number
  offset: number
  limit: number
  records: Record[]
  loading: boolean
}

function formatEur(n: number | string | null | undefined): string {
  if (n == null || n === '') return '—'
  const num = typeof n === 'string' ? parseFloat(n.replace(',', '.')) : n
  if (isNaN(num)) return String(n)
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(2)} M€`
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)} K€`
  return `${num.toLocaleString('ca-ES')} €`
}

export default function StatsBar({ total, offset, limit, records, loading }: Props) {
  // Try to sum numeric columns
  let totalAmount: number | null = null
  if (records.length > 0) {
    const numericKey = Object.keys(records[0]).find(k => {
      const v = records[0][k]
      return v !== null && !isNaN(Number(String(v).replace(',', '.')))
        && k !== '_id' && String(v).length > 0
    })
    if (numericKey) {
      totalAmount = records.reduce((sum, r) => {
        const v = r[numericKey]
        return sum + (v != null ? parseFloat(String(v).replace(',', '.')) || 0 : 0)
      }, 0)
    }
  }

  const from = total === 0 ? 0 : offset + 1
  const to   = Math.min(offset + limit, total)

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg"
        style={{ background: 'rgba(200,16,46,0.08)', color: '#C8102E' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        {loading ? (
          <span className="skeleton w-24 h-4 inline-block" />
        ) : (
          <span className="font-semibold">{total.toLocaleString('ca-ES')} registres</span>
        )}
      </div>

      {!loading && total > 0 && (
        <span className="text-slate-500">
          Mostrant {from}–{to}
        </span>
      )}

      {!loading && totalAmount !== null && (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg ml-auto"
          style={{ background: 'rgba(212,160,23,0.1)', color: '#8a6800' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">Pàgina: {formatEur(totalAmount)}</span>
        </div>
      )}
    </div>
  )
}
