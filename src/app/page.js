'use client'

import { useEffect, useState } from 'react'
import { getFoodList } from './features/Food/Food_list'
import FoodlistUIatMainMenu from './features/MainMenu/MenuSection'
import OrderPreview from './features/MainMenu/OrderPreview'

export default function Home() {
  const [foodList, setFoodList] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  const clearOrder = () => {setSelectedItems([])}

  const handleSelectItem = (food) => {
    setSelectedItems((prev) => {
      const existedItem = prev.find(
        item =>
          item.productId === food.id &&
          item.selectedSize === food.selectedSize
      )

      if (existedItem) {
        return prev.map(item =>
          item.orderItemId === existedItem.orderItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...prev,
        {
          orderItemId: crypto.randomUUID(),
          productId: food.id,
          name: food.name,
          price: food.price,
          selectedSize: food.selectedSize,
          quantity: 1,
          note: '',
          options: food.options || null,
        },
      ]
    })
  }

  const handleUpdateItemNote = (orderItemId, note) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.orderItemId === orderItemId
          ? { ...item, note }
          : item
      )
    )
  }

  const handleUpdateItemQuantity = (orderItemId, newQuantity) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.orderItemId === orderItemId
          ? { ...item, quantity: Math.max(newQuantity, 1) }
          : item
      )
    )
  }

  const handleDeleteItem = (orderItemId) => {
    setSelectedItems(prev =>
      prev.filter(item => item.orderItemId !== orderItemId)
    )
  }

  useEffect(() => {
    const fetchFoodList = async () => {
      const data = await getFoodList()
      setFoodList(data || [])
    }
    fetchFoodList()
  }, [])

  return (
    // KHÓA SCROLL TOÀN TRANG
    <div className="h-screen overflow-hidden bg-zinc-50">
      <div className="flex h-full gap-8 p-6">

        {/* Left: Menu (scroll riêng) */}
        <div className="w-2/3 h-full overflow-y-auto">
          <FoodlistUIatMainMenu
            foodItems={foodList}
            onFoodSelect={handleSelectItem}
          />
        </div>

        {/* Right: Order (scroll riêng) */}
        <div className="w-1/3 h-full overflow-y-auto">
          <OrderPreview
            items={selectedItems}
            onUpdateNote={handleUpdateItemNote}
            onUpdateQuantity={handleUpdateItemQuantity}
            onDeleteItem={handleDeleteItem}
            onClearItem={clearOrder}
          />
        </div>

      </div>
    </div>
  )
}
