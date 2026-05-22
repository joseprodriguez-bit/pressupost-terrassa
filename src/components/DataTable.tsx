import type { BudgetItem } from '@/app/page'

interface Props { items: BudgetItem[]; loading: boolean }

function fmtEur(n: number) {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(2)} M€`
  return n.toLocaleString('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

export default function DataTable({ items, loading }: Props) {
  if (loading) return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-3 border-b border-slate-100">
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 w-24" />
        </div>
      ))}
    </div>
  )

  if (!items.length) return (
    <div className="rounded-2xl p-12 text-center" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
      <p className="text-slate-400">Cap resultat trobat</p>
    </div>
  )

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: '#1A1A2E' }}>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.8)' }}>Codi</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.8)' }}>Partida</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'rgba(255,255,255,0.8)' }}>Pres. inicial</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'rgba(255,255,255,0.8)' }}>Executat</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const pct = item.value_budget_modified > 0
              ? Math.round((item.value_budget_execution / item.value_budget_modified) * 100)
              : 0
            return (
              <tr key={i} className="data-row border-b border-slate-100 last:border-0">
                <td className="px-5 py-3 text-xs text-slate-400 font-mono">{item.code}</td>
                <td className="px-5 py-3" style={{ color: '#1A1A2E' }}>
                  <span className="font-medium">{item.name || '—'}</span>
                </td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums hidden sm:table-cell" style={{ color: '#C8102E' }}>
                  {fmtEur(item.value_budget_initial)}
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-slate-500">{pct}%</span>
                    <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(pct,100)}%`, background: pct >= 90 ? '#16a34a' : '#D4A017' }} />
                    </div>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="data-row border-b border-slate-100 last:border-0">
              <td className="px-5 py-3" style={{ color: '#1A1A2E' }}>
                <span className="font-medium">{item.name || '—'}</span>
                {item.code && <span className="ml-2 text-xs text-slate-400">{item.code}</span>}
              </td>
              <td className="px-5 py-3 hidden sm:table-cell text-slate-500 text-xs">
                {item.functional_area_name || item.area_name || '—'}
              </td>
              <td className="px-5 py-3 text-right font-semibold tabular-nums" style={{ color: '#C8102E' }}>
                {fmtEur(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
