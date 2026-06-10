'use client'

import { useEffect, useState } from "react"
import {
  AlertCircle,
  BadgeDollarSign,
  CheckCircle2,
  ChefHat,
  FileImage,
  ListPlus,
  Save,
  Tags,
  Upload,
  X,
} from "lucide-react"
import { authFetch } from "@/utils/authFetch"
import client from "@/api/client"

// Sanitize file name before uploading.
function sanitizeFileName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "")
}

// Convert comma-separated options to an array.
function parseOptions(value) {
  return value
    .split(",")
    .map((option) => option.trim())
    .filter(Boolean)
}

export default function UpdateFoodModal({ open, onOpenChange, food, onUpdated }) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [optionsText, setOptionsText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [newFile, setNewFile] = useState(null)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("error")

  // Fill form when selected food changes.
  useEffect(() => {
    if (!food) return

    setName(food.name || "")
    setPrice(food.price || "")
    setCategory(food.category || "")
    setSubCategory(food.sub_category || "")
    setOptionsText(Array.isArray(food.options) ? food.options.join(", ") : "")
    setImageUrl(food.image_url || "")
    setNewFile(null)
    setMessage("")
    setMessageType("error")
  }, [food])

  // Close modal safely.
  const handleClose = () => {
    if (loading) return

    setMessage("")
    setNewFile(null)
    onOpenChange(false)
  }

  // Store selected file before upload.
  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) setNewFile(file)
  }

  // Update food item.
  const handleUpdate = async (event) => {
    event.preventDefault()

    if (!food?.id) {
      setMessageType("error")
      setMessage("Missing food ID")
      return
    }

    if (!name.trim() || !price || !category.trim()) {
      setMessageType("error")
      setMessage("Food name, price and category are required")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      let uploadedUrl = imageUrl

      if (newFile) {
        const sanitizedFile = new File(
          [newFile],
          `${Date.now()}-${sanitizeFileName(newFile.name)}`,
          { type: newFile.type }
        )

        const formData = new FormData()
        formData.append("file", sanitizedFile)

        const { data: sessionData } = await client.auth.getSession()
        const token = sessionData.session?.access_token

        const uploadRes = await fetch("/api/menu/upload-image", {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        })

        const uploadData = await uploadRes.json().catch(() => ({
          error: "Invalid server response",
        }))

        if (!uploadRes.ok) {
          setMessageType("error")
          setMessage(uploadData.error || "Image upload failed")
          return
        }

        uploadedUrl = uploadData.url
      }

      const res = await authFetch(`/api/menu_items?id=${food.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          category: category.trim(),
          sub_category: subCategory.trim(),
          options: parseOptions(optionsText),
          image_url: uploadedUrl,
        }),
      })

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        setMessageType("error")
        setMessage(data.message || "Update failed")
        return
      }

      setMessageType("success")
      setMessage("Update successful")
      onUpdated?.()

      setTimeout(() => {
        onOpenChange(false)
      }, 800)
    } catch (err) {
      setMessageType("error")
      setMessage(err.message || "Unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !food) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/60 px-3 pb-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/30 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-950 px-5 py-5 text-white sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/15">
                <ChefHat size={14} />
                Edit menu item
              </div>

              <h2 className="text-xl font-extrabold tracking-tight">
                Update Food Item
              </h2>

              <p className="mt-1 text-xs text-slate-300">
                Editing: <span className="font-semibold">{food.name}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close update food modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form
          id="update-food-form"
          onSubmit={handleUpdate}
          className="flex flex-1 flex-col overflow-hidden"
        >
          {/* Form content */}
          <div className="flex-1 overflow-y-auto bg-white p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Food name */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Food name *
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                  <ChefHat size={18} className="shrink-0 text-slate-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Food name"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Price (VND) *
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                  <BadgeDollarSign size={18} className="shrink-0 text-slate-400" />

                  <input
                    type="number"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="50000"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Category *
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                  <Tags size={18} className="shrink-0 text-slate-400" />

                  <input
                    type="text"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Drink, Food, Dessert..."
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Sub category */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Description / Sub category
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                  <ListPlus size={18} className="shrink-0 text-slate-400" />

                  <input
                    type="text"
                    value={subCategory}
                    onChange={(event) => setSubCategory(event.target.value)}
                    placeholder="Milk tea, coffee, main dish..."
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Options
                </label>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                  <input
                    type="text"
                    value={optionsText}
                    onChange={(event) => setOptionsText(event.target.value)}
                    placeholder="Size S, Size M, Size L"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    disabled={loading}
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Separate options with commas.
                </p>
              </div>

              {/* Image */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:bg-slate-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                    <Upload size={21} />
                  </div>

                  <p className="mt-3 text-sm font-bold text-slate-800">
                    {newFile ? newFile.name : "Click to choose new image"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Keep empty if you do not want to change the image.
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                    onChange={handleFileChange}
                  />
                </label>

                {imageUrl && !newFile && (
                  <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3">
                    <img
                      src={imageUrl}
                      alt="Food preview"
                      className="h-32 w-full rounded-2xl object-cover"
                    />
                  </div>
                )}

                {newFile && (
                  <div className="mt-3 flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                    <FileImage size={18} />
                    New image selected
                  </div>
                )}
              </div>
            </div>

            {message && (
              <div
                className={`
                  mt-4 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold
                  ${
                    messageType === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                `}
              >
                {messageType === "success" ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                <Save size={17} />
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}