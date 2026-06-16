import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getSettings, saveSettings, scrapeAll } from '../api/client'

function Field({ label, hint, id, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-colors"
      />
    </div>
  )
}

export default function Settings() {
  const [form, setForm] = useState({
    LIBRARY_PATH: '',
    IGDB_CLIENT_ID: '',
    IGDB_CLIENT_SECRET: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [scraping, setScraping] = useState(false)

  useEffect(() => {
    getSettings()
      .then((data) => setForm((prev) => ({ ...prev, ...data })))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  function handleChange(key) {
    return (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSettings(form)
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  async function handleScrapeAll() {
    setScraping(true)
    try {
      const res = await scrapeAll()
      toast.success(res.message || 'Scraping started in the background!')
    } catch {
      toast.error('Failed to start scraping')
    } finally {
      setScraping(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-2xl animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-48" />
          <div className="h-4 bg-gray-800 rounded w-64" />
          <div className="h-32 bg-gray-800 rounded mt-6" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-gray-400 mb-8">Configure your library path and IGDB credentials.</p>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Library */}
          <section className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Library</h2>
            </div>

            <Field
              id="library-path"
              label="Library Path"
              hint="Root directory where your ROMs are stored. Each subdirectory is treated as a platform."
              value={form.LIBRARY_PATH}
              onChange={handleChange('LIBRARY_PATH')}
              placeholder="/roms"
            />
          </section>

          {/* IGDB */}
          <section className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">IGDB Credentials</h2>
            </div>

            <p className="text-xs text-gray-500">
              Required for scraping game metadata and cover art. Get your credentials from{' '}
              <a
                href="https://api-docs.igdb.com/#account-creation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-400 hover:underline"
              >
                Twitch Developer Console
              </a>
              .
            </p>

            <Field
              id="igdb-client-id"
              label="Client ID"
              value={form.IGDB_CLIENT_ID}
              onChange={handleChange('IGDB_CLIENT_ID')}
              placeholder="your-twitch-client-id"
            />

            <Field
              id="igdb-client-secret"
              label="Client Secret"
              type="password"
              value={form.IGDB_CLIENT_SECRET}
              onChange={handleChange('IGDB_CLIENT_SECRET')}
              placeholder="your-twitch-client-secret"
            />
          </section>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-accent-700 hover:bg-accent-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* Scrape all section */}
        <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Bulk Scraping</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Automatically scrape metadata for all ROMs that haven't been scraped yet. This runs as a background task and may take several minutes for large libraries.
          </p>
          <button
            onClick={handleScrapeAll}
            disabled={scraping}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-800 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className={`w-4 h-4 ${scraping ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {scraping ? 'Starting…' : 'Scrape All Unscraped ROMs'}
          </button>
        </div>
      </div>
    </div>
  )
}
