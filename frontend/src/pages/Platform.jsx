import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getRoms, getPlatform } from '../api/client'
import RomCard from '../components/RomCard'

export default function Platform() {
  const { id } = useParams()
  const [platform, setPlatform] = useState(null)
  const [roms, setRoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // Fetch platform info
  useEffect(() => {
    getPlatform(id)
      .then(setPlatform)
      .catch(() => toast.error('Failed to load platform'))
  }, [id])

  // Fetch ROMs
  const fetchRoms = useCallback(async (q) => {
    setLoading(true)
    try {
      const params = { platform_id: id }
      if (q) params.search = q
      const data = await getRoms(params)
      setRoms(data)
    } catch {
      toast.error('Failed to load ROMs')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchRoms(debouncedSearch)
  }, [debouncedSearch, fetchRoms])

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-300 transition-colors">Library</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{platform?.name || 'Platform'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{platform?.name || 'Loading…'}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {roms.length} ROM{roms.length !== 1 ? 's' : ''}
            {platform?.slug && (
              <span className="ml-2 text-gray-600">· {platform.slug}</span>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
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
          <span className="text-6xl mb-4">🕹️</span>
          <p className="text-lg font-semibold text-gray-400">
            {search ? 'No ROMs match your search' : 'No ROMs for this platform'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {search ? 'Try a different search term' : 'Scan your library to find ROMs'}
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
