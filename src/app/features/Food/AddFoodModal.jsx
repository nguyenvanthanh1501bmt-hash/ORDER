'use client'

import { useState } from "react"
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

export default function AddFoodModal({ open, onOpenChange }) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [optionsText, setOptionsText] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  // Reset form fields.
  const resetForm = () => {
    setName("")
    setPrice("")
    setCategory("")
    setSubCategory("")
    setOptionsText("")
    setImageUrl("")
    setError("")
  }

  // Close modal safely.
  const handleClose = () => {
    if (loading || uploading) return

    resetForm()
    onOpenChange(false)
  }

  // Upload selected image to server.
  const handleImageUpload = async (file) => {
    if (!file) return

    try {
      setUploading(true)
      setError("")

      const sanitizedFile = new File(
        [file],
        `${Date.now()}-${sanitizeFileName(file.name)}`,
        { type: file.type }
      )

      const formData = new FormData()
      formData.append("file", sanitizedFile)

      const { data: sessionData } = await client.auth.getSession()
      const token = sessionData.session?.access_token

      const res = await fetch("/api/menu/upload-image", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      const data = await res.json().catch(() => ({
        error: "Invalid server response",
      }))

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setImageUrl(data.url)
    } catch (err) {
      setError(err.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  // Submit new food item.
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!name.trim() || !price || !category.trim()) {
      setError("Food name, price and category are required")
      return
    }

    try {
      setLoading(true)

      const res = await authFetch("/api/menu_items", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          category: category.trim(),
          sub_category: subCategory.trim(),
          options: parseOptions(optionsText),
          image_url: imageUrl,
        }),
      })

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        setError(data.message || "Something went wrong")
        return
      }

      resetForm()
      onOpenChange(false)
    } catch {
      setError("Cannot connect to server")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

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
                New menu item
              </div>

              <h2 className="text-xl font-extrabold tracking-tight">
                Add New Food
              </h2>

              <p className="mt-1 text-xs text-slate-300">
                Create a new food item for the restaurant menu.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading || uploading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close add food modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form
          id="add-food-form"
          onSubmit={handleSubmit}
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
                    disabled={loading || uploading}
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
                    disabled={loading || uploading}
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
                    disabled={loading || uploading}
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
                    disabled={loading || uploading}
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
                    disabled={loading || uploading}
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Separate options with commas.
                </p>
              </div>

              {/* Image upload */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Food image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:bg-slate-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                    <Upload size={21} />
                  </div>

                  <p className="mt-3 text-sm font-bold text-slate-800">
                    {uploading ? "Uploading image..." : "Click to upload image"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG, WEBP supported
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={loading || uploading}
                    onChange={(event) =>
                      event.target.files && handleImageUpload(event.target.files[0])
                    }
                  />
                </label>

                {imageUrl && (
                  <div className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={18} />
                    Image uploaded successfully
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading || uploading}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || uploading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                <Save size={17} />
                {loading ? "Saving..." : uploading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}