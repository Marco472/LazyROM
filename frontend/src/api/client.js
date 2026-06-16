import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---- Platforms ----
export function getPlatforms() {
  return api.get('/api/platforms').then((r) => r.data)
}

export function getPlatform(id) {
  return api.get(`/api/platforms/${id}`).then((r) => r.data)
}

export function createPlatform(data) {
  return api.post('/api/platforms', data).then((r) => r.data)
}

export function updatePlatform(id, data) {
  return api.put(`/api/platforms/${id}`, data).then((r) => r.data)
}

export function deletePlatform(id) {
  return api.delete(`/api/platforms/${id}`)
}

// ---- ROMs ----
export function getRoms(params = {}) {
  return api.get('/api/roms', { params }).then((r) => r.data)
}

export function getRom(id) {
  return api.get(`/api/roms/${id}`).then((r) => r.data)
}

export function updateRom(id, data) {
  return api.put(`/api/roms/${id}`, data).then((r) => r.data)
}

export function deleteRom(id) {
  return api.delete(`/api/roms/${id}`)
}

export function getRomDownloadUrl(id) {
  return `${BASE_URL}/api/roms/${id}/download`
}

// ---- Scraper ----
export function scanLibrary() {
  return api.post('/api/scraper/scan').then((r) => r.data)
}

export function scrapeRom(id, igdbId) {
  const body = igdbId ? { igdb_id: igdbId } : {}
  return api.post(`/api/scraper/scrape/${id}`, body).then((r) => r.data)
}

export function scrapeAll() {
  return api.post('/api/scraper/scrape-all').then((r) => r.data)
}

// ---- Settings ----
export function getSettings() {
  return api.get('/api/settings').then((r) => r.data)
}

export function saveSettings(data) {
  return api.put('/api/settings', data).then((r) => r.data)
}

export default api
