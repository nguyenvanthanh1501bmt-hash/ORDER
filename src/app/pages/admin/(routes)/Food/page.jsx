'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { Pencil, Trash2, Plus } from "lucide-react"

import { getFoodList } from "../../service/Food/Food_list"
import AddFoodModal from "../../service/Food/AddFoodModal"
import DeleteFoodModal from "../../service/Food/DeleteFoodModal"
import UpdateFoodModal from "../../service/Food/UpdateFoodModal"
import SearchByName from "../../components/SearchByName"

export default function Foodpage() {
  const [foodList, setFoodList] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)

  // Filter states
  const [searchName, setSearchName] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterPriceRange, setFilterPriceRange] = useState([0, 1000000])
  const [filterOptions, setFilterOptions] = useState([]) // array các option muốn filter

  const fetchFoodList = async () => {
    const data = await getFoodList()
    setFoodList(data || [])
  }

  useEffect(() => {
    fetchFoodList()
  }, [])

  const parseOptions = (options) => {
    if (!options) return []
    return Array.isArray(options) ? options : JSON.parse(options || "[]")
  }

  // Hàm filter tổng quát
  const getFilteredFoodList = () => {
    return foodList.filter(food => {
      // filter theo tên
      if (searchName && !food.name.toLowerCase().includes(searchName.toLowerCase()))
        return false

      // filter theo category
      if (filterCategory && food.category !== filterCategory) return false

      // filter theo giá
      if (food.price < filterPriceRange[0] || food.price > filterPriceRange[1]) return false

      // filter theo options
      if (filterOptions.length > 0) {
        const opts = parseOptions(food.options)
        const hasAll = filterOptions.every(opt => opts.includes(opt))
        if (!hasAll) return false
      }

      return true
    })
  }

  const filteredFoodList = getFilteredFoodList()

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Foods</h1>

        {/* Search */}
        <SearchByName value={searchName} onChange={setSearchName} />

        {/* Add food */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add food
        </button>
      </div>

      {/* FILTER UI ( category + price) */}
      {/* <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All categories</option>
          <option value="Beverage">Beverage</option>
          <option value="Food">Food</option>
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={filterPriceRange[0]}
          onChange={e => setFilterPriceRange([Number(e.target.value), filterPriceRange[1]])}
          className="border px-2 py-1 rounded w-24"
        />
        <input
          type="number"
          placeholder="Max price"
          value={filterPriceRange[1]}
          onChange={e => setFilterPriceRange([filterPriceRange[0], Number(e.target.value)])}
          className="border px-2 py-1 rounded w-24"
        />
      </div> */}

      {/* CONTENT */}
      {filteredFoodList.length === 0 ? (
        <p className="text-gray-500">No foods</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left font-semibold">Image</th>
                <th className="border px-4 py-3 text-left font-semibold">Name</th>
                <th className="border px-4 py-3 text-left font-semibold">Category</th>
                <th className="border px-4 py-3 text-left font-semibold">Options</th>
                <th className="border px-4 py-3 text-right font-semibold">Price</th>
                <th className="border px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredFoodList.map((food, index) => {
                const opts = parseOptions(food.options)

                return (
                  <tr
                    key={food.id}
                    className={`hover:bg-gray-50 ${index % 2 === 1 ? "bg-gray-50/50" : ""}`}
                  >
                    {/* IMAGE */}
                    <td className="border px-4 py-2">
                      <div className="relative w-14 h-14">
                        {food.image_url ? (
                          <Image
                            src={food.image_url}
                            alt={food.name}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No image
                          </div>
                        )}
                      </div>
                    </td>

                    {/* NAME */}
                    <td className="border px-4 py-2 font-medium">
                      {food.name}
                      <div className="text-xs text-gray-500">{food.sub_category || "-"}</div>
                    </td>

                    {/* CATEGORY */}
                    <td className="border px-4 py-2 text-gray-600">{food.category || "-"}</td>

                    {/* OPTIONS */}
                    <td className="border px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {opts.length > 0 ? (
                          opts.map((opt, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                              {opt}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="border px-4 py-2 text-right font-semibold text-green-600">
                      {food.price.toLocaleString()}đ
                    </td>

                    {/* ACTION */}
                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-3">
                        <button
                          title="Edit"
                          className="p-2 rounded text-blue-600 hover:bg-blue-100"
                          onClick={() => {
                            setSelectedFood(food)
                            setIsUpdateModalOpen(true)
                          }}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          title="Delete"
                          className="p-2 rounded text-red-600 hover:bg-red-100"
                          onClick={() => {
                            setSelectedFood(food)
                            setIsDeleteModalOpen(true)
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALS */}
      {isAddModalOpen && (
        <AddFoodModal
          open={isAddModalOpen}
          onOpenChange={(state) => {
            setIsAddModalOpen(state)
            if (!state) fetchFoodList()
          }}
        />
      )}

      {isUpdateModalOpen && selectedFood && (
        <UpdateFoodModal
          open={isUpdateModalOpen}
          food={selectedFood}
          onOpenChange={(state) => {
            setIsUpdateModalOpen(state)
            if (!state) setSelectedFood(null)
            if (!state) fetchFoodList()
          }}
        />
      )}

      {isDeleteModalOpen && selectedFood && (
        <DeleteFoodModal
          open={isDeleteModalOpen}
          food={selectedFood}
          onOpenChange={(state) => {
            setIsDeleteModalOpen(state)
            if (!state) setSelectedFood(null)
            if (!state) fetchFoodList()
          }}
        />
      )}
    </div>
  )
}
