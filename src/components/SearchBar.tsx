'use client'
import { useState } from 'react'

interface Props {
  onSearch: (q: string) => void
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('')

  return (
    <div className="relative flex gap-2 mb-6">
      <div className="relative flex-1">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={e => { setValue(e.target.value); onSearch(e.target.value) }}
          placeholder="Cerca per nom de partida, àrea, programa..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
          style={{ background: '#fff', borderColor: 'rgba(200,16,46,0.2)', color: '#1A1A2E', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          onFocus={e => (e.target.style.borderColor = '#C8102E')}
          onBlur={e => (e.target.style.borderColor = 'rgba(200,16,46,0.2)')}
        />
        {value && (
          <button type="button" onClick={() => { setValue(''); onSearch('') }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
