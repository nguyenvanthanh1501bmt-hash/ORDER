'use client'

import { useEffect, useState } from "react"

export default function UpdateFoodModal({ open, onOpenChange, food, onUpdated }) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [options, setOptions] = useState([])
  const [imageUrl, setImageUrl] = useState("")
  const [newFile, setNewFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!food) return

    setName(food.name || "")
    setPrice(food.price || 0)
    setCategory(food.category || "")
    setSubCategory(food.sub_category || "")
    setOptions(food.options || [])
    setImageUrl(food.image_url || "")
    setNewFile(null)
    setMessage("")
  }, [food])

  if (!open || !food) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setNewFile(file)
  }

  const handleUpdate = async () => {
    setLoading(true)
    setMessage("")

    try {
      let uploadedUrl = imageUrl

      if (newFile) {
        const formData = new FormData()
        formData.append("file", newFile)

        const uploadRes = await fetch("/api/menu/upload-image", {
          method: "POST",
          body: formData,
        })

        const uploadData = await uploadRes.json()

        if (!uploadRes.ok) {
          setMessage(uploadData.error || "Image upload failed")
          return
        }

        uploadedUrl = uploadData.url
      }

      const res = await fetch(`/api/menu_items/update-menu_items?id=${food.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          category,
          sub_category: subCategory,
          options,
          image_url: uploadedUrl,
        }),
      })

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        setMessage(data.message || "Update failed")
        return
      }

      setMessage("Update successful")
      onUpdated?.()
      setTimeout(() => onOpenChange(false), 800)
    } catch (err) {
      setMessage(err.message || "Unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Update food item</h2>
          <p className="text-sm text-gray-500">
            Editing: <span className="font-medium">{food.name}</span>
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Food name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Sub-category</label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Options <span className="text-xs text-gray-400">(comma separated)</span>
            </label>
            <input
              type="text"
              value={options.join(", ")}
              onChange={(e) =>
                setOptions(
                  e.target.value
                    .split(",")
                    .map(o => o.trim())
                    .filter(Boolean)
                )
              }
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {imageUrl && !newFile && (
              <img
                src={imageUrl}
                alt="preview"
                className="h-28 w-28 rounded border object-contain"
              />
            )}

            {newFile && (
              <p className="text-sm text-gray-500">
                New file: {newFile.name}
              </p>
            )}
          </div>

          {message && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>

          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={loading || !name.trim()}
            onClick={handleUpdate}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  )
}