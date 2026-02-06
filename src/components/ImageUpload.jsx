import React, { useRef, useState, useEffect } from 'react'
import { uploadImage } from '../api'

export default function ImageUpload({ addOptimisticImage, onUploadSuccess }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return setMessage('masukan nama image terlebih dahulu')
    if (!file) return setMessage('masukan file image terlebih dahulu')
    setLoading(true)
    setMessage(null)

    // create optimistic preview
    const tempId = addOptimisticImage(file, title)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('title', title)
      formData.append('filename', title) // help server set public_id

      const result = await uploadImage(formData)
      // replace temp item with server item
      if (onUploadSuccess) onUploadSuccess(tempId, result)
      setMessage('Upload successful')
      setFile(null)
      setTitle('')
    } catch (err) {
      setMessage(err.message || 'Upload error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const onChooseClick = () => inputRef.current && inputRef.current.click()

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0]
    if (f) setFile(f)
  }

  const removeFile = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="upload-card">
      <div className="row">
        <div className="col">
          <label className="label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title (required)"
            className="input"
          />
        </div>

        <div className="col file-col">
          <label className="label">Image</label>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file native-file"
            aria-hidden
            tabIndex={-1}
          />

          <div className="file-controls">
            <button type="button" className="file-btn" onClick={onChooseClick}>
              {file ? 'Ganti gambar' : 'Pilih Gambar'}
            </button>
            {file && (
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <button type="button" className="remove-btn" onClick={removeFile}>Remove</button>
              </div>
            )}
          </div>
          {preview && (
            <div className="thumb-preview">
              <img src={preview} alt="preview" />
            </div>
          )}
        </div>

        <div className="col action-col">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {message && <p className="message">{message}</p>}
    </form>
  )
}
