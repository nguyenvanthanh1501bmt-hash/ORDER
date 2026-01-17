export  async function getOrdersAvailable() {
    try{
        const res = await fetch('/api/orders/get-order', {
            cache: 'no-store',
        })

        if (!res.ok) {
            throw new Error('Failed to load orders')
        }

        const data = await res.json()
        return data || []
    }
    catch(err){
        throw err;
    }
}