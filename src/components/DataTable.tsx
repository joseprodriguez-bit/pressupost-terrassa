'use client'
import { useState } from 'react'
import type { BudgetItem } from '@/app/page'

interface Props { items: BudgetItem[]; allData: BudgetItem[]; loading: boolean }

function fmtEur(n: number) {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(2)} M€`
  return n.toLocaleString('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

export default function DataTable({ items, allData, loading }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (code: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(code) ? next.delete(code) : next.add(code)
      return next
    })
  }

  const getChildren = (code: string, kind: 'G' | 'I') =>
    allData.filter(d => d.parent_code === code && d.kind === kind && d.level === 3 && d.name !== null)
      .sort((a, b) => b.value_budget_initial - a.value_budget_initial)

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
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider w-8" style={{ color: 'rgba(255,255,255,0.8)' }}></th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.8)' }}>Codi</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.8)' }}>Partida</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'rgba(255,255,255,0.8)' }}>Pres. inicial</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'rgba(255,255,255,0.8)' }}>Executat</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const children = getChildren(item.code, item.kind)
            const isOpen = expanded.has(item.code)
            const pct = item.value_budget_modified > 0
              ? Math.round((item.value_budget_execution / item.value_budget_modified) * 100) : 0

            return (
              <>
                <tr
                  key={item.code}
                  className="data-row border-b border-slate-100 cursor-pointer"
                  onClick={() => children.length > 0 && toggle(item.code)}
                >
                  <td className="pl-4 py-3 text-center">
                    {children.length > 0 && (
                      <span className="text-slate-400 text-xs font-bold transition-transform inline-block"
                        style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                        ▶
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-400 font-mono">{item.code}</td>
                  <td className="px-3 py-3 font-semibold" style={{ color: '#1A1A2E' }}>{item.name}</td>
                  <td className="px-3 py-3 text-right font-bold tabular-nums hidden sm:table-cell" style={{ color: '#C8102E' }}>
                    {fmtEur(item.value_budget_initial)}
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs text-slate-500">{pct}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(pct,100)}%`, background: pct >= 90 ? '#16a34a' : '#D4A017' }} />
                      </div>
                    </div>
                  </td>
                </tr>

                {isOpen && children.map(child => {
                  const cpct = child.value_budget_modified > 0
                    ? Math.round((child.value_budget_execution / child.value_budget_modified) * 100) : 0
                  return (
                    <tr key={child.code} className="border-b border-slate-50"
                      style={{ background: 'rgba(200,16,46,0.03)' }}>
                      <td className="pl-4 py-2"></td>
                      <td className="px-3 py-2 text-xs text-slate-300 font-mono">{child.code}</td>
                      <td className="px-3 py-2 text-sm text-slate-600 pl-6">
                        <span className="mr-2 text-slate-300">└</span>{child.name}
                      </td>
                      <td className="px-3 py-2 text-right text-sm tabular-nums hidden sm:table-cell" style={{ color: '#C8102E' }}>
                        {fmtEur(child.value_budget_initial)}
                      </td>
                      <td className="px-3 py-2 hidden md:table-cell">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs text-slate-400">{cpct}%</span>
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(cpct,100)}%`, background: cpct >= 90 ? '#16a34a' : '#D4A017' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
