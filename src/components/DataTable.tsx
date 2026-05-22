import type { Record, Field } from '@/app/page'

interface Props {
  records: Record[]
  fields: Field[]
  loading: boolean
  total: number
  offset: number
  limit: number
  onPage: (dir: 1 | -1) => void
}

function formatValue(value: string | number | null, fieldId: string): React.ReactNode {
  if (value == null || value === '') return <span className="text-slate-300">—</span>

  const str = String(value)
  const num = parseFloat(str.replace(',', '.'))

  // Monetary columns (heuristic)
  const moneyKeys = ['import', 'imports', 'amount', 'pressupost', 'total', 'despesa', 'credito', 'credito_def']
  const isMonetary = moneyKeys.some(k => fieldId.toLowerCase().includes(k)) || (!isNaN(num) && Math.abs(num) > 100)

  if (!isNaN(num) && isMonetary && str.length > 0) {
    const formatted = Math.abs(num) >= 1_000_000
      ? `${(num / 1_000_000).toFixed(2)} M€`
      : Math.abs(num) >= 1_000
      ? num.toLocaleString('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
      : num.toLocaleString('ca-ES', { style: 'currency', currency: 'EUR' })
    return (
      <span className="font-semibold tabular-nums" style={{ color: '#C8102E' }}>
        {formatted}
      </span>
    )
  }

  // Long text
  if (str.length > 60) {
    return <span title={str}>{str.slice(0, 60)}…</span>
  }

  return str
}

function getLabel(field: Field): string {
  return field.info?.label || field.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const SKELETON_ROWS = 8

export default function DataTable({ records, fields, loading, total, offset, limit, onPage }: Props) {
  const hasPrev = offset > 0
  const hasNext = offset + limit < total

  return (
    <div>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#1A1A2E' }}>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <div className="skeleton h-3 w-20" />
                    </th>
                  ))
                ) : fields.length > 0 ? (
                  fields.map(f => (
                    <th
                      key={f.id}
                      className="px-4 py-3 text-left font-semibold text-xs tracking-wider uppercase whitespace-nowrap"
                      style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {getLabel(f)}
                    </th>
                  ))
                ) : null}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: SKELETON_ROWS }).map((_, ri) => (
                    <tr key={ri} className="border-b border-slate-100">
                      {Array.from({ length: 5 }).map((_, ci) => (
                        <td key={ci} className="px-4 py-3">
                          <div className={`skeleton h-3 ${ci === 0 ? 'w-48' : ci === fields.length - 1 ? 'w-24' : 'w-32'}`} />
                        </td>
                      ))}
                    </tr>
                  ))
                : records.length === 0
                ? (
                    <tr>
                      <td
                        colSpan={fields.length || 5}
                        className="px-6 py-16 text-center text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Cap resultat trobat</span>
                        </div>
                      </td>
                    </tr>
                  )
                : records.map((row, i) => (
                    <tr
                      key={i}
                      className="data-row border-b border-slate-100 last:border-0"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      {fields.map(f => (
                        <td key={f.id} className="px-4 py-3 align-top" style={{ color: '#2D3561' }}>
                          {formatValue(row[f.id], f.id)}
                        </td>
                      ))}
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && total > limit && (
        <div className="flex items-center justify-between mt-4 px-1">
          <button
            onClick={() => onPage(-1)}
            disabled={!hasPrev}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: hasPrev ? '#fff' : 'transparent', border: '1px solid #e2e8f0', color: '#1A1A2E' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>
          <span className="text-sm text-slate-500">
            Pàgina {Math.floor(offset / limit) + 1} de {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() => onPage(1)}
            disabled={!hasNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: hasNext ? '#fff' : 'transparent', border: '1px solid #e2e8f0', color: '#1A1A2E' }}
          >
            Següent
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
