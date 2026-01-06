export async function getEmployeeList() {
    try {
        const res = await fetch('/api/admin/get-staff', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch employee list');
        }
        
        const data = await res.json();
        return data;

    } catch (error) {
        console.error('Error fetching employee list:', error);
        return [];
    }
}