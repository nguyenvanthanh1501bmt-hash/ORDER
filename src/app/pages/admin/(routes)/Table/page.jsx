'use client'

import { useEffect, useState } from "react"
import { getTableList } from "../../service/Table/Table_list"
import AddTableModal from "../../service/Table/AddTableModal"
import UpdateTableModal from "../../service/Table/UpdateTableModal"
import DeleteTableModal from "../../service/Table/DeleteTableModal"
import { Pencil, Trash2 } from "lucide-react"

export default function Tablepage() {
  const [tableList, setTableList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const fetchTableList = async () => {
    const data = await getTableList()
    setTableList(data || [])
  }

  useEffect(() => {
    fetchTableList()
  }, [])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tables</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add table
        </button>
      </div>

      {/* Content */}
      {tableList.length === 0 ? (
        <p className="text-gray-500">No tables</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">ID</th>
                <th className="border px-4 py-3 text-left">Table name</th>
                <th className="border px-4 py-3 text-left">QR code</th>
                <th className="border px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {tableList.map((t, index) => (
                <tr
                  key={t.id}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 1 ? "bg-gray-50/50" : ""
                  }`}
                >
                  <td className="border px-4 py-2">{t.id}</td>
                  <td className="border px-4 py-2 font-medium">{t.name}</td>
                  <td className="border px-4 py-2 text-gray-500">
                    {t.qr_code_id || "-"}
                  </td>

                  <td className="border px-4 py-2">
                    <div className="flex justify-center gap-3">
                      <button
                        className="p-2 rounded text-blue-600 hover:bg-blue-100"
                        onClick={() => {
                          setSelectedTable(t)
                          setIsUpdateOpen(true)
                        }}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="p-2 rounded text-red-600 hover:bg-red-100"
                        onClick={() => {
                          setSelectedTable(t)
                          setIsDeleteOpen(true)
                        }}
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
      )}

      <AddTableModal
        open={isModalOpen}
        onOpenChange={(state) => {
          setIsModalOpen(state)
          if (!state) fetchTableList()
        }}
      />

        <DeleteTableModal
            open={isDeleteOpen}
            table={selectedTable}
            onOpenChange={(state) => {
                setIsDeleteOpen(state)
                if (!state) {
                    setSelectedTable(null)
                    fetchTableList()
                }
            }}
        />

        <UpdateTableModal
            open={isUpdateOpen}
            table={selectedTable}
            onOpenChange={(state) => {
                setIsUpdateOpen(state)
                if (!state) {
                    setSelectedTable(null)
                    fetchTableList()
                }
            }}
        />
    </div>
  )
}
