import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Library from './pages/Library'
import Platform from './pages/Platform'
import Settings from './pages/Settings'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto ml-64">
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/platform/:id" element={<Platform />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}
