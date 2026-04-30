export async function getEmployeeList() {
    try {
        const res = await fetch('/api/admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch employee list');
        }
        
        const response = await res.json();
        // Handle new response format: { success, data, message }
        return response.data || [];

    } catch (error) {
        console.error('Error fetching employee list:', error);
        return [];
    }
}