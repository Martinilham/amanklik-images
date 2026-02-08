import React from 'react'

export default function ImageList({ images = [], onDelete }) {
  const handleCopy = async (url) => {
    try {
      // If short relative path (starts with '/'), convert to absolute using
      // VITE_FRONTEND_ORIGIN (if set) or window.location.origin
      let toCopy = url
      if (toCopy && toCopy.startsWith('/')) {
        const origin = import.meta.env.VITE_FRONTEND_ORIGIN || window.location.origin
        toCopy = origin.replace(/\/$/, '') + toCopy
      }
      await navigator.clipboard.writeText(toCopy)
      // unobtrusive feedback
      const el = document.createElement('div')
      el.className = 'toast'
      el.textContent = 'Copied!'
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 1400)
    } catch (err) {
      alert('Copy failed')
    }
  }

  if (!images.length) return <p className="muted">No images yet.</p>

  return (
    <div className="grid">
      {images.map((img) => {
        const short = img.short_url || null
        const openUrl = short ? short : img.url
        return (
          <div className="card" key={img._id || img.public_id || img.url}>
            <div className="thumb">
              <img src={img.url} alt={img.title || 'uploaded'} />
              {img._temp && <span className="badge">Uploading…</span>}
            </div>
            <div className="meta">
              <div className="title">{img.title || '—'}</div>
              <div className="actions">
                <button onClick={() => handleCopy(short || img.url)}>Copy</button>
                <a href={openUrl} target="_blank" rel="noopener noreferrer">Open</a>
                {onDelete && (
                  <button onClick={() => onDelete(img._id)} className="delete-btn">Delete</button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
