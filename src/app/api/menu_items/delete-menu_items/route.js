import { supabaseAdmin } from "@/api/adminClient";

export async function DELETE(req) {
  try {
    const { menuItemId, imageurl } = await req.json();

    if (!menuItemId) {
      return new Response(
        JSON.stringify({ message: "Không tìm thấy món ăn cần xóa" }),
        { status: 400 }
      );
    }

    // Xóa ảnh trong bucket nếu có
    if (imageurl) {
      // Lấy đường dẫn relative trong bucket
      const bucketPath = imageurl.split('/storage/v1/object/public/food-images/')[1];

      if (bucketPath) {
        const { error: storageError } = await supabaseAdmin
          .storage
          .from('food-images') // bucket đúng
          .remove([bucketPath]);

        if (storageError) {
          console.warn("Xóa file hình thất bại:", storageError.message);
        }
      }
    }

    // Xóa record trong DB
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .delete()
      .eq('id', menuItemId)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ message: "Món ăn không tồn tại" }),
        { status: 404 }
      );
    }

    // Trả về kết quả
    return new Response(
      JSON.stringify({ message: "Món ăn và ảnh đã xóa thành công", deleted: data }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
