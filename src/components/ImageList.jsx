import React from 'react'

export default function ImageList({ images = [] }) {
  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
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
      {images.map((img) => (
        <div className="card" key={img._id || img.public_id || img.url}>
          <div className="thumb">
            <img src={img.url} alt={img.title || 'uploaded'} />
            {img._temp && <span className="badge">Uploading…</span>}
          </div>
          <div className="meta">
            <div className="title">{img.title || '—'}</div>
            <div className="actions">
              <button onClick={() => handleCopy(img.url)}>Copy</button>
              <a href={img.url} target="_blank" rel="noopener noreferrer">Open</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
