'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import DataTable from '@/components/DataTable'
import ChartView from '@/components/ChartView'
import StatsPanel from '@/components/StatsPanel'
import YearSelector from '@/components/YearSelector'

export type BudgetItem = {
  name: string
  amount: number
  amount_per_inhabitant?: number
  kind: 'I' | 'G'  // Ingressos / Despeses
  area_name?: string
  functional_area_name?: string
  economic_area?: string
  year: number
  level?: number
  code?: string
}

const BASE_URL = 'https://gobierto-populate-production.s3.eu-west-1.amazonaws.com/gobierto_budgets/8279/data/annual'
const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019]

export default function Home() {
  const [data, setData]         = useState<BudgetItem[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [year, setYear]         = useState(2025)
  const [kind, setKind]         = useState<'G' | 'I'>('G')
  const [query, setQuery]       = useState('')
  const [view, setView]         = useState<'table' | 'chart'>('chart')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`${BASE_URL}/${year}.json`)
      .then(r => {
        if (!r.ok) throw new Error('No s\'han pogut carregar les dades')
        return r.json()
      })
      .then((json: BudgetItem[]) => {
        setData(json)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [year])

  const filtered = data
    .filter(d => d.kind === kind)
    .filter(d => d.level === 2 || (!d.level && d.amount > 0))
    .filter(d => {
      if (!query) return true
      const q = query.toLowerCase()
      return (
        d.name?.toLowerCase().includes(q) ||
        d.area_name?.toLowerCase().includes(q) ||
        d.functional_area_name?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => b.amount - a.amount)

  const total = filtered.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero */}
        <section className="pt-12 pb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: '#C8102E' }}>
            Dades obertes · Ajuntament de Terrassa
          </p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-3"
            style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A2E' }}>
            On van els<span style={{ color: '#C8102E' }}> teus </span>impostos?
          </h1>
          <p className="text-slate-600 max-w-xl text-base leading-relaxed">
            Consulta el pressupost municipal de Terrassa amb total transparència.
            Explora cada partida de despesa i ingrés públic.
          </p>
        </section>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <YearSelector years={YEARS} value={year} onChange={setYear} />

          <div className="flex rounded-xl overflow-hidden border border-slate-200">
            <button onClick={() => setKind('G')}
              className="px-4 py-2 text-sm font-medium transition-all"
              style={{ background: kind === 'G' ? '#C8102E' : '#fff', color: kind === 'G' ? '#fff' : '#64748b' }}>
              Despeses
            </button>
            <button onClick={() => setKind('I')}
              className="px-4 py-2 text-sm font-medium transition-all"
              style={{ background: kind === 'I' ? '#C8102E' : '#fff', color: kind === 'I' ? '#fff' : '#64748b' }}>
              Ingressos
            </button>
          </div>

          <div className="flex rounded-xl overflow-hidden border border-slate-200 ml-auto">
            <button onClick={() => setView('chart')}
              className="px-4 py-2 text-sm font-medium transition-all"
              style={{ background: view === 'chart' ? '#1A1A2E' : '#fff', color: view === 'chart' ? '#fff' : '#64748b' }}>
              Gràfic
            </button>
            <button onClick={() => setView('table')}
              className="px-4 py-2 text-sm font-medium transition-all"
              style={{ background: view === 'table' ? '#1A1A2E' : '#fff', color: view === 'table' ? '#fff' : '#64748b' }}>
              Taula
            </button>
          </div>
        </div>

        <SearchBar onSearch={setQuery} loading={loading} />

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(200,16,46,0.08)', color: '#C8102E' }}>
            ⚠️ {error}
          </div>
        )}

        <StatsPanel total={total} count={filtered.length} kind={kind} year={year} loading={loading} />

        {view === 'chart'
          ? <ChartView items={filtered} loading={loading} kind={kind} />
          : <DataTable items={filtered} loading={loading} />
        }
      </main>

      <Footer />
    </div>
  )
}
