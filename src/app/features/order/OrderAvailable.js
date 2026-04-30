export  async function getOrdersAvailable() {
    try{
        const res = await fetch('/api/orders', {
            cache: 'no-store',
        })

        if (!res.ok) {
            throw new Error('Failed to load orders')
        }

        const response = await res.json()
        // Handle new response format: { success, data, message }
        return response.data || []
    }
    catch(err){
        throw err;
    }
}