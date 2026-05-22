'use client'
import { useState } from 'react'

interface Props {
  onSearch: (q: string) => void
  loading: boolean
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Cerca per concepte, departament, àrea..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border text-sm outline-none transition-all"
            style={{
              background: '#fff',
              borderColor: 'rgba(200,16,46,0.2)',
              color: '#1A1A2E',
              fontFamily: 'DM Sans, sans-serif',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            onFocus={e => (e.target.style.borderColor = '#C8102E')}
            onBlur={e => (e.target.style.borderColor = 'rgba(200,16,46,0.2)')}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
          style={{ background: '#C8102E', fontFamily: 'DM Sans, sans-serif' }}
        >
          {loading ? 'Cercant…' : 'Cercar'}
        </button>
      </div>
    </form>
  )
}
