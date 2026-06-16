import { useState } from 'react'
import toast from 'react-hot-toast'
import PlatformBadge from './PlatformBadge'
import { scrapeRom, getRomDownloadUrl } from '../api/client'

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

function RomModal({ rom, onClose, onScraped }) {
  const [scraping, setScraping] = useState(false)
  const [igdbInput, setIgdbInput] = useState('')

  async function handleScrape() {
    setScraping(true)
    try {
      const igdbId = igdbInput ? parseInt(igdbInput, 10) : undefined
      const updated = await scrapeRom(rom.id, igdbId)
      toast.success(`Scraped "${updated.name}" successfully!`)
      onScraped(updated)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Scraping failed'
      toast.error(msg)
    } finally {
      setScraping(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Cover + title header */}
        <div className="flex gap-4 p-5 border-b border-gray-800">
          <div className="flex-shrink-0">
            {rom.cover_url ? (
              <img
                src={rom.cover_url}
                alt={rom.name}
                className="w-24 h-32 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-24 h-32 bg-gray-800 rounded-lg flex items-center justify-center text-4xl">
                🎮
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white leading-tight">{rom.name}</h2>
            <div className="mt-1.5">
              <PlatformBadge platform={rom.platform} />
            </div>
            {rom.rating != null && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm text-gray-300">{rom.rating.toFixed(1)}</span>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">{rom.file_name}</p>
            <p className="text-xs text-gray-500">{formatBytes(rom.file_size)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 self-start text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Summary */}
        {rom.summary && (
          <div className="px-5 py-3 border-b border-gray-800">
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">{rom.summary}</p>
          </div>
        )}

        {/* Scrape section */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            IGDB Scraper
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="IGDB ID (optional — leave blank to auto-search)"
              value={igdbInput}
              onChange={(e) => setIgdbInput(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-500"
            />
            <button
              onClick={handleScrape}
              disabled={scraping}
              className="px-4 py-2 bg-accent-700 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {scraping ? 'Scraping…' : 'Scrape'}
            </button>
          </div>
        </div>

        {/* Download */}
        <div className="px-5 pb-5">
          <a
            href={getRomDownloadUrl(rom.id)}
            download={rom.file_name}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm font-medium text-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download ROM
          </a>
        </div>
      </div>
    </div>
  )
}

export default function RomCard({ rom: initialRom }) {
  const [rom, setRom] = useState(initialRom)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div
        className="group bg-gray-900 rounded-xl border border-gray-800 overflow-hidden cursor-pointer hover:border-accent-600 hover:shadow-lg hover:shadow-accent-900/30 transition-all duration-200"
        onClick={() => setShowModal(true)}
      >
        {/* Cover image */}
        <div className="aspect-[3/4] bg-gray-800 relative overflow-hidden">
          {rom.cover_url ? (
            <img
              src={rom.cover_url}
              alt={rom.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
              <span className="text-5xl mb-2">🎮</span>
              <span className="text-xs text-center px-2 text-gray-500 line-clamp-2">
                {rom.name}
              </span>
            </div>
          )}

          {/* Rating badge */}
          {rom.rating != null && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs text-white">{rom.rating.toFixed(0)}</span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-100 truncate leading-tight">
            {rom.name}
          </h3>
          <div className="mt-1.5 flex items-center justify-between gap-1">
            {rom.platform && <PlatformBadge platform={rom.platform} size="xs" />}
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatBytes(rom.file_size)}
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <RomModal
          rom={rom}
          onClose={() => setShowModal(false)}
          onScraped={(updated) => setRom(updated)}
        />
      )}
    </>
  )
}
