'use client'

export default function DeleteFoodModal({ open, onOpenChange, food }) {
    const handleDelete = async () => {
        try {
            const res = await fetch('/api/menu_items/delete-menu_items', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ menuItemId: food.id, imageurl: food.image_url }),
            });

            if (!res.ok) {
                console.error('Delete failed');
            } else {
                console.log('Deleted successfully');
                onOpenChange(false);
            }
        } catch (error) {
            console.error('Error deleting food item:', error);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="flex flex-col gap-4 p-6 bg-white rounded shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold">
                    Are you sure you want to delete {food.name}
                </h2>

                <div className="flex gap-4 mt-4 justify-end">
                    {/* Hủy xóa */}
                    <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </button>

                    {/* Xác nhận xóa */}
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
