'use client'
import { useState } from 'react'
import type { BudgetItem } from '@/app/page'

interface Props { items: BudgetItem[]; allData: BudgetItem[]; loading: boolean }

function fmtEur(n: number) {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(2)} M€`
  return n.toLocaleString('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

function PctBar({ value, modified }: { value: number; modified: number }) {
  const pct = modified > 0 ? Math.round((value / modified) * 100) : 0
  return (
    <div className="flex items-center gap-2 justify-end">
      <span className="text-xs text-slate-400">{pct}%</span>
      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct,100)}%`, background: pct >= 90 ? '#16a34a' : '#D4A017' }} />
      </div>
    </div>
  )
}

function ExternalLink({ item }: { item: BudgetItem }) {
  const code = item.parent_code || item.code
  const url = `https://pressupostos.terrassa.cat/presupuestos/partidas/${code}/${item.year}/${item.area}/${item.kind}`
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-all hover:opacity-80"
      style={{ background: 'rgba(200,16,46,0.08)', color: '#C8102E', textDecoration: 'none' }}
      title="Veure detall oficial"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      Detall oficial
    </a>
  )
}

const BG = ['#fff', 'rgba(200,16,46,0.03)', 'rgba(200,16,46,0.06)', 'rgba(200,16,46,0.09)']

function Row({
  item, allData, depth, expanded, onToggle
}: {
  item: BudgetItem
  allData: BudgetItem[]
  depth: number
  expanded: Set<string>
  onToggle: (code: string) => void
}) {
  const children = allData
    .filter(d => d.parent_code === item.code && d.kind === item.kind && d.level === item.level + 1)
    .sort((a, b) => b.value_budget_initial - a.value_budget_initial)

  const isOpen = expanded.has(item.code)
  const indent = depth * 18
  const hasName = item.name !== null && item.name !== undefined
  const hasDesc = item.description !== null && item.description !== undefined
  const isLeaf = children.length === 0

  return (
    <>
      <tr
        className="border-b border-slate-100 transition-colors"
        style={{ background: BG[Math.min(depth, 3)], cursor: children.length > 0 ? 'pointer' : 'default' }}
        onClick={() => children.length > 0 && onToggle(item.code)}
      >
        <td className="py-2" style={{ paddingLeft: `${12 + indent}px`, width: '32px' }}>
          {children.length > 0 && (
            <span className="text-slate-400 text-xs font-bold inline-block"
              style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.15s' }}>
              ▶
            </span>
          )}
        </td>
        <td className="px-2 py-2 text-xs font-mono whitespace-nowrap" style={{ color: depth === 0 ? '#94a3b8' : '#cbd5e1' }}>
          {item.code}
        </td>
        <td className="px-2 py-2" style={{ paddingLeft: `${8 + indent}px` }}>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              {depth > 0 && <span className="text-slate-300">└</span>}
              <span style={{
                fontWeight: depth === 0 ? 700 : depth === 1 ? 500 : 400,
                fontSize: depth === 0 ? '0.875rem' : '0.8rem',
                color: hasName ? (depth === 0 ? '#1A1A2E' : depth === 1 ? '#334155' : '#64748b') : '#94a3b8',
                fontStyle: hasName ? 'normal' : 'italic'
              }}>
                {hasName ? item.name : hasDesc ? item.description!.slice(0, 60) + (item.description!.length > 60 ? '…' : '') : `Partida ${item.code}`}
              </span>
              {isLeaf && <ExternalLink item={item} />}
            </div>
            {hasName && hasDesc && depth > 0 && (
              <p className="text-xs text-slate-400 leading-tight" style={{ paddingLeft: depth > 0 ? '12px' : '0' }}>
                {item.description!.slice(0, 100)}{item.description!.length > 100 ? '…' : ''}
              </p>
            )}
          </div>
        </td>
        <td className="px-2 py-2 text-right tabular-nums hidden sm:table-cell whitespace-nowrap"
          style={{ fontWeight: depth === 0 ? 700 : 500, fontSize: '0.8rem', color: '#C8102E' }}>
          {fmtEur(item.value_budget_initial)}
        </td>
        <td className="px-2 py-2 hidden md:table-cell">
          <PctBar value={item.value_budget_execution} modified={item.value_budget_modified} />
        </td>
      </tr>
      {isOpen && children.map(child => (
        <Row key={child.code} item={child} allData={allData} depth={depth + 1} expanded={expanded} onToggle={onToggle} />
      ))}
    </>
  )
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

  if (loading) return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-3 border-b border-slate-100">
          <div className="skeleton h-4 flex-1" /><div className="skeleton h-4 w-24" />
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
            <th className="w-8 py-3"></th>
            <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>Codi</th>
            <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>Partida</th>
            <th className="px-2 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'rgba(255,255,255,0.7)' }}>Pres. inicial</th>
            <th className="px-2 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'rgba(255,255,255,0.7)' }}>Execució</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <Row key={item.code} item={item} allData={allData} depth={0} expanded={expanded} onToggle={toggle} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
