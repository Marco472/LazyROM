import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getPlatforms } from '../api/client'

function PlatformEntry({ platform }) {
  return (
    <NavLink
      to={`/platform/${platform.id}`}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-accent-700 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
        }`
      }
    >
      <span className="truncate">{platform.name}</span>
      <span className="ml-2 flex-shrink-0 text-xs bg-gray-700 text-gray-300 rounded-full px-2 py-0.5">
        {platform.rom_count}
      </span>
    </NavLink>
  )
}

export default function Sidebar() {
  const [platforms, setPlatforms] = useState([])

  useEffect(() => {
    getPlatforms()
      .then(setPlatforms)
      .catch(() => {})
  }, [])

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          <span className="text-xl font-bold bg-gradient-to-r from-accent-400 to-violet-300 bg-clip-text text-transparent">
            LazyROM
          </span>
        </Link>
        <p className="text-xs text-gray-500 mt-1">ROM Library Manager</p>
      </div>

      {/* Main nav */}
      <nav className="px-3 pt-4 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent-700 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
            }`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Library
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent-700 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
            }`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </NavLink>
      </nav>

      {/* Platforms list */}
      <div className="flex-1 overflow-y-auto px-3 mt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
          Platforms
        </p>
        {platforms.length === 0 ? (
          <p className="text-xs text-gray-600 px-3">No platforms yet. Scan your library!</p>
        ) : (
          <div className="space-y-0.5">
            {platforms.map((p) => (
              <PlatformEntry key={p.id} platform={p} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-800">
        <p className="text-xs text-gray-600">LazyROM v0.1.0</p>
      </div>
    </aside>
  )
}
