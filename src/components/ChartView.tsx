'use client'
import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import type { Record, Field } from '@/app/page'

interface Props {
  records: Record[]
  fields: Field[]
  loading: boolean
}

const COLORS = ['#C8102E', '#D4A017', '#2D3561', '#16213E', '#E8C547', '#8B0019', '#A07D10']

function getLabel(field: Field): string {
  return field.info?.label || field.id.replace(/_/g, ' ')
}

function formatEur(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M€`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}K€`
  return `${value.toLocaleString('ca-ES')}€`
}

export default function ChartView({ records, fields, loading }: Props) {
  // Find a text column (label) and a numeric column (value)
  const { labelField, valueField } = useMemo(() => {
    if (!records.length || !fields.length) return { labelField: null, valueField: null }

    const numericFields = fields.filter(f => {
      const v = records[0][f.id]
      return v != null && !isNaN(parseFloat(String(v).replace(',', '.')))
    })
    const textFields = fields.filter(f => !numericFields.includes(f))

    return {
      labelField: textFields[0] || null,
      valueField: numericFields[0] || null,
    }
  }, [records, fields])

  const chartData = useMemo(() => {
    if (!labelField || !valueField) return []
    return records
      .slice(0, 20)
      .map(r => ({
        name: String(r[labelField.id] ?? '').slice(0, 40),
        value: parseFloat(String(r[valueField.id] ?? '0').replace(',', '.')) || 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [records, labelField, valueField])

  if (loading) {
    return (
      <div className="rounded-2xl p-8" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
        <div className="skeleton h-6 w-48 mb-6" />
        <div className="skeleton h-64 w-full" />
      </div>
    )
  }

  if (!labelField || !valueField || chartData.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
      >
        <p className="text-slate-400">No es pot generar el gràfic amb les dades actuals.</p>
        <p className="text-slate-300 text-sm mt-1">Prova a canviar la cerca.</p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
    >
      <div className="mb-4">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Visualització</p>
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A2E' }}
        >
          {getLabel(valueField)} per {getLabel(labelField)}
        </h2>
        <p className="text-xs text-slate-400 mt-1">Top {chartData.length} resultats</p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'DM Sans, sans-serif' }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tickFormatter={formatEur}
            tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'DM Sans, sans-serif' }}
            width={80}
          />
          <Tooltip
            formatter={(v: number) => [formatEur(v), getLabel(valueField)]}
            labelStyle={{ fontFamily: 'DM Sans, sans-serif', color: '#1A1A2E', fontWeight: 600 }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid rgba(200,16,46,0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              fontFamily: 'DM Sans, sans-serif',
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
