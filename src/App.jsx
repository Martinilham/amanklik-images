import React, { useEffect, useState, useCallback } from 'react'
import ImageUpload from './components/ImageUpload'
import ImageList from './components/ImageList'
import { fetchImages, searchImages, deleteImage } from './api'

const CACHE_KEY = 'images_cache_v1'

export default function App() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load cached images quickly on startup
  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]')
      if (Array.isArray(cached) && cached.length) setImages(cached)
    } catch (e) {
      console.warn('Failed to read cache', e)
    }
  }, [])

  // Save non-temp images to cache
  useEffect(() => {
    try {
      const toCache = images.filter((i) => !i._temp)
      localStorage.setItem(CACHE_KEY, JSON.stringify(toCache))
    } catch (e) {
      console.warn('Failed to write cache', e)
    }
  }, [images])

  const loadImages = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchImages()
      // preserve any optimistic temp items at the top, then show server data
      setImages((prev) => {
        const temps = (prev || []).filter((i) => i._temp)
        return [...temps, ...(data || [])]
      })
    } catch (err) {
      setError(err.message || 'Failed to fetch images')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  const handleSearch = async (q) => {
    if (!q) return loadImages()
    setLoading(true)
    try {
      const data = await searchImages(q)
      setImages(data)
    } catch (err) {
      setError(err.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteImage(id)
      setImages((prev) => (prev || []).filter((i) => i._id !== id))
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  // Add an optimistic image item immediately and return its temp id
  const addOptimisticImage = (file, title) => {
    const previewUrl = URL.createObjectURL(file)
    const tempId = `temp-${Date.now()}`
    const tempItem = {
      _temp: true,
      _id: tempId,
      title,
      url: previewUrl,
      createdAt: new Date().toISOString()
    }
    setImages((prev) => [tempItem, ...(prev || [])])
    return tempId
  }

  // Replace a temp item with the server-provided image
  const replaceTempWithServer = (tempId, serverImage) => {
    setImages((prev) => {
      // revoke preview URL for the temp item to avoid leaks
      const temp = (prev || []).find((p) => p._id === tempId && p._temp)
      if (temp && temp.url && temp.url.startsWith('blob:')) URL.revokeObjectURL(temp.url)
      return (prev || []).map((i) => (i._id === tempId ? serverImage : i))
    })
  }

  return (
    <div className="container">
      <h1>Upload Image</h1>

      <ImageUpload
        addOptimisticImage={addOptimisticImage}
        onUploadSuccess={replaceTempWithServer}
      />

      <div style={{ marginTop: 12 }}>
        <input
          placeholder="Search by title or name"
          onChange={(e) => handleSearch(e.target.value)}
          className="input"
        />
      </div>

      <hr />

      <h2>Images</h2>
      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ImageList images={images} onDelete={handleDelete} />
    </div>
  )
}
