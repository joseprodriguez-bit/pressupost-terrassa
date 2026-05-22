'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import StatsBar from '@/components/StatsBar'
import DataTable from '@/components/DataTable'
import ChartView from '@/components/ChartView'
import Footer from '@/components/Footer'

export type Record = { [key: string]: string | number | null }
export type Field = { id: string; type: string; info?: { label?: string } }

export default function Home() {
  const [records, setRecords]   = useState<Record[]>([])
  const [fields, setFields]     = useState<Field[]>([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [query, setQuery]       = useState('')
  const [offset, setOffset]     = useState(0)
  const [view, setView]         = useState<'table' | 'chart'>('table')
  const LIMIT = 50

  const fetchData = useCallback(async (q: string, off: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: String(LIMIT), offset: String(off) })
      if (q) params.set('q', q)
      const res  = await fetch(`/api/pressupost?${params}`)
      const json = await res.json()
      if (json.success) {
        setRecords(json.result.records)
        setFields(json.result.fields.filter((f: Field) => f.id !== '_id'))
        setTotal(json.result.total)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData(query, offset) }, [fetchData, query, offset])

  const handleSearch = (q: string) => { setQuery(q); setOffset(0) }
  const handlePage   = (dir: 1 | -1) => setOffset(o => Math.max(0, o + dir * LIMIT))

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero */}
        <section className="pt-12 pb-8 fade-up">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-red-700 mb-2">
                Dades obertes · Ajuntament de Terrassa
              </p>
              <h1
                className="text-4xl sm:text-5xl font-black leading-tight"
                style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A2E' }}
              >
                On van els
                <span style={{ color: '#C8102E' }}> teus </span>
                impostos?
              </h1>
              <p className="mt-3 text-slate-600 max-w-xl text-base leading-relaxed">
                Consulta el pressupost municipal de Terrassa amb total transparència.
                Cerca, filtra i explora cada partida de despesa pública.
              </p>
            </div>
            <div className="flex gap-2 self-end">
              <button
                onClick={() => setView('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'table'
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-red-300'
                }`}
              >
                Taula
              </button>
              <button
                onClick={() => setView('chart')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'chart'
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-red-300'
                }`}
              >
                Gràfic
              </button>
            </div>
          </div>
        </section>

        <SearchBar onSearch={handleSearch} loading={loading} />
        <StatsBar total={total} offset={offset} limit={LIMIT} records={records} loading={loading} />

        {view === 'table' ? (
          <DataTable
            records={records}
            fields={fields}
            loading={loading}
            total={total}
            offset={offset}
            limit={LIMIT}
            onPage={handlePage}
          />
        ) : (
          <ChartView records={records} fields={fields} loading={loading} />
        )}
      </main>

      <Footer />
    </div>
  )
}
