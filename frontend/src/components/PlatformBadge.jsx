// Maps platform slugs to emoji icons for a gaming aesthetic
const PLATFORM_ICONS = {
  nes: '🎮',
  snes: '🕹️',
  n64: '🎯',
  gb: '🟩',
  gbc: '🌈',
  gba: '💜',
  nds: '📺',
  ps1: '🔵',
  ps2: '🔷',
  ps3: '⚫',
  psp: '🎵',
  genesis: '🔴',
  megadrive: '🔴',
  gamegear: '🟡',
  saturn: '🪐',
  dreamcast: '🌀',
  gamecube: '🟣',
  wii: '⬜',
  '3ds': '🔺',
  arcade: '👾',
  mame: '👾',
  atari2600: '🟤',
  atari7800: '🟤',
}

const PLATFORM_COLORS = {
  nes: 'bg-red-900/50 text-red-300 border-red-700',
  snes: 'bg-purple-900/50 text-purple-300 border-purple-700',
  n64: 'bg-blue-900/50 text-blue-300 border-blue-700',
  gb: 'bg-green-900/50 text-green-300 border-green-700',
  gbc: 'bg-green-900/50 text-green-300 border-green-700',
  gba: 'bg-violet-900/50 text-violet-300 border-violet-700',
  nds: 'bg-gray-700/50 text-gray-300 border-gray-600',
  ps1: 'bg-blue-900/50 text-blue-300 border-blue-700',
  ps2: 'bg-blue-900/50 text-blue-300 border-blue-700',
  psp: 'bg-sky-900/50 text-sky-300 border-sky-700',
  genesis: 'bg-red-900/50 text-red-300 border-red-700',
  megadrive: 'bg-red-900/50 text-red-300 border-red-700',
  saturn: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  dreamcast: 'bg-orange-900/50 text-orange-300 border-orange-700',
  gamecube: 'bg-purple-900/50 text-purple-300 border-purple-700',
  wii: 'bg-gray-700/50 text-gray-300 border-gray-600',
  arcade: 'bg-pink-900/50 text-pink-300 border-pink-700',
  mame: 'bg-pink-900/50 text-pink-300 border-pink-700',
}

export default function PlatformBadge({ platform, size = 'sm' }) {
  if (!platform) return null

  const slug = platform.slug?.toLowerCase() || ''
  const icon = PLATFORM_ICONS[slug] || '🎮'
  const colorClass = PLATFORM_COLORS[slug] || 'bg-accent-900/50 text-accent-300 border-accent-700'

  const sizeClass = size === 'xs'
    ? 'text-xs px-1.5 py-0.5'
    : 'text-xs px-2 py-1'

  return (
    <span className={`inline-flex items-center gap-1 rounded border font-medium ${colorClass} ${sizeClass}`}>
      <span>{icon}</span>
      <span className="truncate max-w-[100px]">{platform.name}</span>
    </span>
  )
}
