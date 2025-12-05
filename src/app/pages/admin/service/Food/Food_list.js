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

        const data = await res.json();
        return data;

    } catch (error) {
        console.error('Error fetching food list:', error);
        return [];
    }
}
