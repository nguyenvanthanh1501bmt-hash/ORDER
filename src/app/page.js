'use client'

import { useEffect, useState } from 'react'
import { getFoodList } from './features/Food/Food_list'
import FoodlistUIatMainMenu from './features/Food/MenuSection'
import OrderPreview from './features/MainMenu/OrderPreview'

export default function Home() {
  const [foodList, setFoodList] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  // add into order
  const handleSelectItem = (item) => {
    setSelectedItems([...selectedItems, { ...item, quantity: 1, note: '', selectedsize: item.selectedSize }])
    
  }

  // Update note
  const handleUpdateItemNote = (itemId, note) => {
    setSelectedItems(selectedItems.map(item =>
      item.id === itemId ? { ...item, note } : item
    ))
  }

  // Update quantity
  const handleUpdateItemQuantity = (itemId, newQuantity) => {
    setSelectedItems(selectedItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max(newQuantity, 1) } // atleast 1
        : item
    ))
  }

  useEffect(() => {
    // Fetch foodlist from API
    const fetchFoodList = async () => {
      try {
        const data = await getFoodList()
        setFoodList(data || [])
      } catch (error) {
        console.error('Failed to fetch food list', error)
      }
    }

    fetchFoodList()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="flex gap-8 w-full">
        {/* Left: Menu */}
        <div className="w-2/3">
          <FoodlistUIatMainMenu
            foodItems={foodList}
            onFoodSelect={handleSelectItem}
          />
        </div>

        {/* Right: Order preview */}
        <div className="w-1/3">
          <OrderPreview
            items={selectedItems}
            onUpdateNote={handleUpdateItemNote}
            onUpdateQuantity={handleUpdateItemQuantity}
          />
        </div>
      </div>
    </div>
  )
}
