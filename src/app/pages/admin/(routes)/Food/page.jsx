'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  BadgeDollarSign,
  ChefHat,
  Plus,
  RefreshCcw,
  Search,
  UtensilsCrossed,
} from "lucide-react"

import { getFoodList } from "../../../../features/Food/Food_list"

import AddFoodModal from "../../../../features/Food/AddFoodModal"
import UpdateFoodModal from "../../../../features/Food/UpdateFoodModal"
import DeleteFoodModal from "../../../../features/Food/DeleteFoodModal"

import FoodTable from "../../../../features/Food/FoodlistUI"
import Filterlist from "../../../../../components/layout/SearchBar"

export default function Foodpage() {
  const [foodList, setFoodList] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [searchName, setSearchName] = useState("")
  const [searchPrice, setSearchPrice] = useState("")

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errorText, setErrorText] = useState("")

  // Fetch food list from API.
  const fetchFoodList = useCallback(async (showLoading = true) => {
    try {
      setErrorText("")

      if (showLoading) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const data = await getFoodList()
      setFoodList(data || [])
    } catch (error) {
      console.error("Error fetching food list:", error)
      setErrorText("Cannot load food list. Please try again.")
      setFoodList([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Load foods when the page is mounted.
  useEffect(() => {
    fetchFoodList(true)
  }, [fetchFoodList])

  // Filter food items by name and maximum price.
  const filteredFoodList = useMemo(() => {
    const keyword = searchName.trim().toLowerCase()
    const maxPrice = Number(searchPrice)

    return foodList.filter((food) => {
      const foodName = food?.name?.toLowerCase() || ""
      const foodPrice = Number(food?.price || 0)

      if (keyword && !foodName.includes(keyword)) {
        return false
      }

      if (searchPrice && Number.isFinite(maxPrice) && foodPrice > maxPrice) {
        return false
      }

      return true
    })
  }, [foodList, searchName, searchPrice])

  // Calculate overview stats.
  const foodStats = useMemo(() => {
    return {
      total: foodList.length,
      showing: filteredFoodList.length,
      maxPrice: searchPrice || "None",
    }
  }, [foodList.length, filteredFoodList.length, searchPrice])

  // Refresh data after a modal is closed.
  const handleModalClose = async (state, setter, shouldClearSelected = false) => {
    setter(state)

    if (!state) {
      if (shouldClearSelected) {
        setSelectedFood(null)
      }

      await fetchFoodList(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-lg bg-slate-100" />
          </section>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-3xl bg-slate-100"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                  <ChefHat size={14} />
                  Food dashboard
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Food Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                  Manage menu items, update prices, upload food images, and keep your restaurant menu organized.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => fetchFoodList(false)}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCcw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 active:scale-[0.98]"
                >
                  <Plus size={16} />
                  Add Food
                </button>
              </div>
            </div>
          </div>

          {/* Overview stats */}
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total foods
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {foodStats.total}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <UtensilsCrossed size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Showing results
                  </p>
                  <p className="mt-2 text-3xl font-bold text-emerald-900">
                    {foodStats.showing}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                  <Search size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Max price filter
                  </p>
                  <p className="mt-2 truncate text-lg font-bold text-amber-900">
                    {foodStats.maxPrice === "None"
                      ? "None"
                      : `${Number(foodStats.maxPrice).toLocaleString("vi-VN")} ₫`}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                  <BadgeDollarSign size={22} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error message */}
        {errorText && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Food list section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Food List
              </h2>
              <p className="text-sm text-slate-500">
                Search by food name or filter items by maximum price.
              </p>
            </div>

            {/* Filter bar */}
            <div className="w-full lg:w-auto">
              <Filterlist
                className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-fit"
                showSearchName={true}
                searchName={searchName}
                setSearchName={setSearchName}
                showSearchPrice={true}
                searchPrice={searchPrice}
                setSearchPrice={setSearchPrice}
              />
            </div>
          </div>

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
        </section>
      </div>

      {/* Add food modal */}
      <AddFoodModal
        open={isAddOpen}
        onOpenChange={(state) => handleModalClose(state, setIsAddOpen)}
      />

      {/* Update food modal */}
      {selectedFood && (
        <UpdateFoodModal
          open={isUpdateOpen}
          food={selectedFood}
          onOpenChange={(state) =>
            handleModalClose(state, setIsUpdateOpen, true)
          }
        />
      )}

      {/* Delete food modal */}
      {selectedFood && (
        <DeleteFoodModal
          open={isDeleteOpen}
          food={selectedFood}
          onOpenChange={(state) =>
            handleModalClose(state, setIsDeleteOpen, true)
          }
        />
      )}
    </main>
  )
}