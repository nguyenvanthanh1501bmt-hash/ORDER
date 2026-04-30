export async function getOrdersAvailable(accessToken) {
    try{
        const headers = {
            'Content-Type': 'application/json',
        }

        // Add authorization header if token is available
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`
        }

        const res = await fetch('/api/orders', {
            cache: 'no-store',
            headers,
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