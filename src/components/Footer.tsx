export default function Footer() {
  return (
    <footer className="border-t mt-12 py-8" style={{ borderColor: 'rgba(200,16,46,0.12)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <span className="font-medium" style={{ color: '#C8102E' }}>Pressupost Terrassa</span>
          {' '}· Dades de{' '}
          <a
            href="https://opendata.terrassa.cat"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-red-700 transition-colors"
          >
            opendata.terrassa.cat
          </a>
        </div>
        <div>
          Les dades són públiques i pertanyen a l'Ajuntament de Terrassa
        </div>
      </div>
    </footer>
  )
}
