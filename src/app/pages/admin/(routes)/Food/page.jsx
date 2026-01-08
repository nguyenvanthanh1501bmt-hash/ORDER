'use client'

import { useEffect, useState } from "react"
import { getFoodList } from "../../../../features/Food/Food_list"

import AddFoodModal from "../../../../features/Food/AddFoodModal"
import UpdateFoodModal from "../../../../features/Food/UpdateFoodModal"
import DeleteFoodModal from "../../../../features/Food/DeleteFoodModal"

import FoodTable from "../../../../features/Food/FoodlistUI"
import Filterlist from "../../../../components/layout/SearchBar"

export default function Foodpage() {
  const [foodList, setFoodList] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  /* ================= FILTER STATE ================= */
  const [searchName, setSearchName] = useState("")
  const [searchPrice, setSearchPrice] = useState("")

  const fetchFoodList = async () => {
    const data = await getFoodList()
    setFoodList(data || [])
  }

  useEffect(() => {
    fetchFoodList()
  }, [])

  /* ================= FILTER LOGIC ================= */
  const filteredFoodList = foodList.filter(food => {
    if (
      searchName &&
      !food.name.toLowerCase().includes(searchName.toLowerCase())
    ) return false

    if (searchPrice && food.price > parseFloat(searchPrice))
      return false

    return true
  })

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Foods</h1>

        <button
          onClick={() => setIsAddOpen(true)}
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
          Add Food
        </button>

      </div>

      <Filterlist
        className="flex items-center gap-4 mb-4 w-fit"
        showSearchName={true}
        searchName={searchName}
        setSearchName={setSearchName}

        showSearchPrice={true}
        searchPrice={searchPrice}
        setSearchPrice={setSearchPrice}/>

        

      {/* TABLE */}
      <FoodTable
        foods={filteredFoodList}
        onEdit={(food) => {
          setSelectedFood(food)
          setIsUpdateOpen(true)
        }}
        onDelete={(food) => {
          setSelectedFood(food)
          setIsDeleteOpen(true)
        }}
      />

      {/* ADD */}
      <AddFoodModal
        open={isAddOpen}
        onOpenChange={(state) => {
          setIsAddOpen(state)
          if (!state) fetchFoodList()
        }}
      />

      {/* UPDATE */}
      {selectedFood && (
        <UpdateFoodModal
          open={isUpdateOpen}
          food={selectedFood}
          onOpenChange={(state) => {
            setIsUpdateOpen(state)
            if (!state) {
              setSelectedFood(null)
              fetchFoodList()
            }
          }}
        />
      )}

      {/* DELETE */}
      {selectedFood && (
        <DeleteFoodModal
          open={isDeleteOpen}
          food={selectedFood}
          onOpenChange={(state) => {
            setIsDeleteOpen(state)
            if (!state) {
              setSelectedFood(null)
              fetchFoodList()
            }
          }}
        />
      )}
    </div>
  )
}
