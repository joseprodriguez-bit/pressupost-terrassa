interface Props {
  years: number[]
  value: number
  onChange: (y: number) => void
}

export default function YearSelector({ years, value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 outline-none cursor-pointer"
      style={{ background: '#fff', color: '#1A1A2E', fontFamily: 'DM Sans, sans-serif' }}
    >
      {years.map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  )
}
