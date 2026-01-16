'use client'

import { useEffect, useState } from 'react'
import { getFoodList } from './features/Food/Food_list'
import FoodlistUIatMainMenu from './features/MainMenu/MenuSection'
import OrderPreview from './features/MainMenu/OrderPreview'
import CustomAlert from './components/CustomAlert'

export default function Home() {
  const [foodList, setFoodList] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [showOrderPreview, setShowOrderPreview] = useState(false)

  const [alertText, setAlertText] = useState('')

  const showAlert = (text) => {
    setAlertText(text)
    setTimeout(() => setAlertText(''), 1800)
  }

  const clearOrder = () => {
    setSelectedItems([])
    setShowOrderPreview(false)
    showAlert('Your order has been sent')
  }

  const handleSelectItem = (food) => {
    setSelectedItems((prev) => {
      const existedItem = prev.find(
        item =>
          item.productId === food.id &&
          item.selectedSize === food.selectedSize
      )

      if (existedItem) {
        showAlert(`Added ${food.name}`)
        return prev.map(item =>
          item.orderItemId === existedItem.orderItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      showAlert(`Added ${food.name}`)

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
    showAlert('Đã xoá món khỏi đơn')
  }

  useEffect(() => {
    const fetchFoodList = async () => {
      const data = await getFoodList()
      setFoodList(data || [])
    }
    fetchFoodList()
  }, [])

  return (
    <div className="h-screen overflow-hidden bg-zinc-50">

      {/* ALERT */}
      <CustomAlert text={alertText} />

      {/* MAIN LAYOUT */}
      <div className="flex h-full flex-col lg:flex-row gap-4 lg:gap-8 p-4 lg:p-6">

        {/* MENU — FIX 1: chừa chỗ cho nút */}
        <div className="w-full lg:w-2/3 h-full overflow-y-auto pb-24 lg:pb-0">
          <FoodlistUIatMainMenu
            foodItems={foodList}
            onFoodSelect={handleSelectItem}
          />
        </div>

        {/* DESKTOP ORDER PREVIEW */}
        <div className="hidden lg:block w-1/3 h-full overflow-y-auto">
          <OrderPreview
            items={selectedItems}
            onUpdateNote={handleUpdateItemNote}
            onUpdateQuantity={handleUpdateItemQuantity}
            onDeleteItem={handleDeleteItem}
            onClearItem={clearOrder}
          />
        </div>

      </div>

      {/* MOBILE ORDER BUTTON */}
      {selectedItems.length > 0 && (
        <button
          onClick={() => setShowOrderPreview(true)}
          className="
            fixed bottom-4 left-4 right-4 z-40
            lg:hidden
            bg-gray-900 text-white
            py-3 rounded-xl
            font-semibold
            shadow-lg
          "
        >
          Order Preview ({selectedItems.length})
        </button>
      )}

      {/* MOBILE ORDER DRAWER */}
      {showOrderPreview && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowOrderPreview(false)}
          />

          <div className="
            absolute bottom-0 left-0 right-0
            bg-white rounded-t-2xl
            h-[85vh] flex flex-col
          ">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Order Preview</h2>
              <button
                onClick={() => setShowOrderPreview(false)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>

            {/* FIX 2: chừa đáy trong drawer */}
            <div className="flex-1 overflow-y-auto p-3">
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
      )}

    </div>
  )
}
