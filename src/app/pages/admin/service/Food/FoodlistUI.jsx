import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"

export default function FoodTable({ foods = [], onEdit, onDelete }) {
  if (foods.length === 0) {
    return <p className="text-gray-500">No foods</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-sm bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-3 text-left">ID</th>
            <th className="border px-4 py-3 text-left">Image</th>
            <th className="border px-4 py-3 text-left">Food name</th>
            <th className="border px-4 py-3 text-left">Price</th>
            <th className="border px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {foods.map((food, index) => (
            <tr
              key={food.id}
              className={`hover:bg-gray-50 ${
                index % 2 === 1 ? "bg-gray-50/50" : ""
              }`}
            >
              <td className="border px-4 py-2">{food.id}</td>

              <td className="border px-4 py-2">
                {food.image_url ? (
                  <Image
                    src={food.image_url}
                    alt={food.name}
                    width={48}
                    height={48}
                    className="rounded object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </td>

              <td className="border px-4 py-2 font-medium">
                {food.name}
              </td>

              <td className="border px-4 py-2">
                {food.price?.toLocaleString()} ₫
              </td>

              <td className="border px-4 py-2">
                <div className="flex justify-center gap-3">
                  <button
                    className="p-2 rounded text-blue-600 hover:bg-blue-100"
                    onClick={() => onEdit(food)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="p-2 rounded text-red-600 hover:bg-red-100"
                    onClick={() => onDelete(food)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
