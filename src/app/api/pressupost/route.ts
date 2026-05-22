import { NextRequest, NextResponse } from 'next/server'

const RESOURCE_ID = '12aa497c-475e-4321-a471-ecc06510a779'
const BASE_URL = 'https://opendata.terrassa.cat/api/action/datastore_search'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const limit = searchParams.get('limit') || '50'
  const offset = searchParams.get('offset') || '0'

  const params = new URLSearchParams({
    resource_id: RESOURCE_ID,
    limit,
    offset,
  })
  if (q) params.set('q', q)

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Error en la consulta' }, { status: 500 })
  }
}
