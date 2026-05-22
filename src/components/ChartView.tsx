'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { BudgetItem } from '@/app/page'

interface Props { items: BudgetItem[]; loading: boolean; kind: 'G' | 'I' }

const COLORS = ['#C8102E','#D4A017','#2D3561','#16213E','#8B0019','#A07D10','#1a3a6e','#5c1017','#6b5200','#0d2240']

function fmtM(v: number) {
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(1)}M€`
  if (v >= 1_000) return `${(v/1_000).toFixed(0)}K€`
  return `${v}€`
}

export default function ChartView({ items, loading, kind }: Props) {
  const top20 = items.slice(0, 20)

  if (loading) return (
    <div className="rounded-2xl p-8" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
      <div className="skeleton h-6 w-48 mb-6" />
      <div className="skeleton h-80 w-full" />
    </div>
  )

  if (!top20.length) return (
    <div className="rounded-2xl p-12 text-center" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
      <p className="text-slate-400">Cap partida trobada</p>
    </div>
  )

  return (
    <div className="rounded-2xl p-6" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Visualització</p>
      <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A2E' }}>
        Top {top20.length} partides de {kind === 'G' ? 'despesa' : 'ingressos'}
      </h2>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={top20} margin={{ top: 10, right: 20, left: 20, bottom: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
          <XAxis dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'DM Sans, sans-serif' }}
            angle={-40} textAnchor="end" interval={0} />
          <YAxis tickFormatter={fmtM}
            tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'DM Sans, sans-serif' }}
            width={75} />
          <Tooltip
            formatter={(v: number) => [fmtM(v), 'Import']}
            labelStyle={{ fontFamily: 'DM Sans, sans-serif', color: '#1A1A2E', fontWeight: 600 }}
            contentStyle={{ borderRadius: 8, border: '1px solid rgba(200,16,46,0.2)', fontFamily: 'DM Sans, sans-serif' }} />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {top20.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
