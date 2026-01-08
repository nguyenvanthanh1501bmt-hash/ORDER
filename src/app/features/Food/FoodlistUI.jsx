import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"

export default function FoodTable({ foods = [], onEdit, onDelete }) {
  if (foods.length === 0) {
    return (
      <div className="py-14 text-center text-gray-400 italic">
        No food items
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {foods.map((food) => (
        <div
          key={food.id}
          className="
            group
            grid grid-cols-[auto_1fr_auto]
            items-center gap-6
            bg-white rounded-2xl
            border border-gray-100
            px-5 py-4
            shadow-sm
            hover:shadow-lg hover:border-gray-200
            transition-all
          "
        >
          {/* Left: Image + Name */}
          <div className="flex items-center gap-4 min-w-[220px]">
            {food.image_url ? (
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={food.image_url}
                  alt={food.name}
                  fill
                  sizes="56px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}

            <div>
              <p className="font-medium text-gray-900 text-sm leading-tight">
                {food.name}
              </p>
              <p className="text-xs text-gray-400">
                #{food.id}
              </p>
            </div>
          </div>

          {/* Middle: Price */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">
              {food.price?.toLocaleString()} ₫
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Base price
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition">
            <button
              onClick={() => onEdit(food)}
              className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 cursor-pointer"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() => onDelete(food)}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>

        </div>
      ))}
    </div>
  )
}
