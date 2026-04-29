// services/menu.js
export async function getFoodList() {
    try {
        const res = await fetch('/api/menu_items/get-menu_items', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch food list');
        }

        const response = await res.json();
        // Handle new response format: { success, data, message }
        return response.data || [];

    } catch (error) {
        console.error('Error fetching food list:', error);
        return [];
    }
}
