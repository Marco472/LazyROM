import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getRoms, scanLibrary } from '../api/client'
import RomCard from '../components/RomCard'

export default function Library() {
  const [roms, setRoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [scanning, setScanning] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchRoms = useCallback(async (q) => {
    setLoading(true)
    try {
      const params = q ? { search: q } : {}
      const data = await getRoms(params)
      setRoms(data)
    } catch {
      toast.error('Failed to load ROMs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoms(debouncedSearch)
  }, [debouncedSearch, fetchRoms])

  async function handleScan() {
    setScanning(true)
    try {
      const result = await scanLibrary()
      toast.success(`Scan complete — ${result.platforms} new platform(s), ${result.roms} new ROM(s)`)
      fetchRoms(debouncedSearch)
    } catch {
      toast.error('Library scan failed')
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Library</h1>
          <p className="text-sm text-gray-400 mt-0.5">{roms.length} ROM{roms.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none sm:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search ROMs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-500"
            />
          </div>

          {/* Scan button */}
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 bg-accent-700 hover:bg-accent-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
          >
            <svg className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {scanning ? 'Scanning…' : 'Scan Library'}
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl animate-pulse">
              <div className="aspect-[3/4]" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : roms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4">🎮</span>
          <p className="text-lg font-semibold text-gray-400">
            {search ? 'No ROMs match your search' : 'Your library is empty'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {search ? 'Try a different search term' : 'Click "Scan Library" to discover your ROMs'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {roms.map((rom) => (
            <RomCard key={rom.id} rom={rom} />
          ))}
        </div>
      )}
    </div>
  )
}
