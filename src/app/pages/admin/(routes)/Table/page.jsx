'use client'

import { useEffect, useState } from "react"
import { getTableList } from "../../../../features/Table/Table_list"
import AddTableModal from "../../../../features/Table/AddTableModal"
import UpdateTableModal from "../../../../features/Table/UpdateTableModal"
import DeleteTableModal from "../../../../features/Table/DeleteTableModal"
import TablelistUI from "../../../../features/Table/TablelistUI"
import Filterlist from "../../../../components/layout/SearchBar"
import { formatDate } from "../../../../features/helper"


export default function Tablepage() {
  const [tableList, setTableList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  //filter state
  const [searchName, setSearchName] = useState("")
  const [searchCreate, setSearchCreate] = useState("")

  const fetchTableList = async () => {
    const data = await getTableList()
    setTableList(data || [])
  }

  useEffect(() => {
    fetchTableList()
  }, [])

const filteredTableList = tableList.filter((table) => {
  // Filter theo name
  if (searchName && !table.name.toLowerCase().includes(searchName.toLowerCase())) {
    return false;
  }

  // Filter theo ngày tạo
  if (searchCreate && table.created_at) {
    // Chỉ cắt lấy 10 ký tự đầu của created_at: "YYYY-MM-DD"
    // Nếu API trả về "2025-12-24 09:29:11.106575+00" thì
    // table.created_at.slice(0,10) => "2025-12-24"
    const tableDateStr = table.created_at.slice(0, 10);

    if (tableDateStr !== searchCreate) return false;
  }

  return true;
});



  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tables</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="
            inline-flex items-center gap-2
            px-4 py-2.5
            bg-blue-600 text-white text-sm font-medium
            rounded-lg
            shadow-sm
            transition
            hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer
            active:scale-[0.98]
          "
        >
          <span className="text-lg leading-none">+</span>
          Add Table
        </button>
      </div>

      {/* filter bar */}
      <Filterlist
        className="flex items-center gap-4 mb-4 w-fit"
        showSearchName={true}
        searchName={searchName}
        setSearchName={setSearchName}

        showSearchCreate={true}
        searchCreate={searchCreate}
        setSearchCreate={setSearchCreate}
      />
      {/* Content */}
      <TablelistUI
        tables={filteredTableList}
        onEdit={(table) => {
          setSelectedTable(table)
          setIsUpdateOpen(true)
        }}

        onDelete={(table) => {
          setSelectedTable(table)
          setIsDeleteOpen(true)
        }}
      />

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
