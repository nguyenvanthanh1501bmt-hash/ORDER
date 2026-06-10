'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { getFoodList } from './features/Food/Food_list'
import { getTableList } from './features/Table/Table_list'

import FoodlistUIatMainMenu from './features/MainMenu/MenuSection'
import OrderPreview from './features/MainMenu/OrderPreview'
import CustomAlert from '../components/CustomAlert'

function generateId() {
  return 'xxxx-xxxx-xxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
}

function extractQrToken(value) {
  if (!value) return null

  const text = String(value).trim()

  try {
    const url = new URL(text)
    return url.searchParams.get('table') || text
  } catch {
    try {
      const base =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost'

      const url = new URL(text, base)
      return url.searchParams.get('table') || text
    } catch {
      return text
    }
  }
}

export default function MainMenuClient() {
  const [foodList, setFoodList] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [showOrderPreview, setShowOrderPreview] = useState(false)
  const [alertText, setAlertText] = useState('')

  const [tableList, setTableList] = useState([])
  const [tableId, setTableId] = useState(null)

  const searchParams = useSearchParams()
  const tableQRCode = searchParams.get('table')

  useEffect(() => {
    let cancelled = false

    const fetchTableList = async () => {
      const res = await getTableList()

      if (!cancelled) {
        setTableList(res || [])
        console.log('TABLE LIST:', res)
      }
    }

    fetchTableList()

    const timer = setInterval(fetchTableList, 5000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchTableList()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!tableQRCode || tableList.length === 0) {
      console.log('QR CODE:', tableQRCode)
      setTableId(null)
      return
    }

    const scannedToken = extractQrToken(tableQRCode)

    const matchedTable = tableList.find(table => {
      const tableToken = extractQrToken(table.qr_code_id)
      return tableToken && String(tableToken) === String(scannedToken)
    })

    console.log('QR:', tableQRCode)
    console.log('MATCHED TABLE:', matchedTable)
    console.log('TABLE ID:', matchedTable?.id ?? null)

    setTableId(matchedTable?.id ?? null)
  }, [tableQRCode, tableList])

  useEffect(() => {
    const fetchFoodList = async () => {
      const data = await getFoodList()
      setFoodList(data || [])
    }

    fetchFoodList()
  }, [])

  const showAlert = text => {
    setAlertText(text)
    setTimeout(() => setAlertText(''), 1800)
  }

  const clearOrder = () => {
    setSelectedItems([])
    setShowOrderPreview(false)
    showAlert('Your order has been sent')
  }

  const handleSelectItem = food => {
    if (!tableId) {
      showAlert('Table not found. Please scan the QR again.')
      return
    }

    setSelectedItems(prev => {
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
          orderItemId: generateId(),
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

  const handleDeleteItem = orderItemId => {
    setSelectedItems(prev =>
      prev.filter(item => item.orderItemId !== orderItemId)
    )
    showAlert('Removed item from order')
  }

  return (
    <div className="h-screen overflow-hidden bg-zinc-50">
      <CustomAlert text={alertText} />

      <div className="flex h-full flex-col lg:flex-row gap-4 lg:gap-8 p-4 lg:p-6">
        <div className="w-full lg:w-2/3 h-full overflow-y-auto pb-24 lg:pb-0">
          <FoodlistUIatMainMenu
            foodItems={foodList}
            onFoodSelect={handleSelectItem}
          />
        </div>

        <div className="hidden lg:block w-1/3 h-full overflow-y-auto">
          <OrderPreview
            items={selectedItems}
            tableId={tableId}
            qrToken={tableQRCode}
            onUpdateNote={handleUpdateItemNote}
            onUpdateQuantity={handleUpdateItemQuantity}
            onDeleteItem={handleDeleteItem}
            onClearItem={clearOrder}
          />
        </div>
      </div>

      {selectedItems.length > 0 && (
        <button
          onClick={() => setShowOrderPreview(true)}
          className="fixed bottom-4 left-4 right-4 z-40 lg:hidden bg-gray-900 text-white py-3 rounded-xl font-semibold shadow-lg"
        >
          Order Preview ({selectedItems.length})
        </button>
      )}

      {showOrderPreview && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowOrderPreview(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl h-[85vh] flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Order Preview</h2>
              <button
                onClick={() => setShowOrderPreview(false)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <OrderPreview
                items={selectedItems}
                tableId={tableId}
                qrToken={tableQRCode}
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