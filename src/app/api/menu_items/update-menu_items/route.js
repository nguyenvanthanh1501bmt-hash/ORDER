import { supabaseAdmin } from "@/api/adminClient";

export async function PUT(req) {
  try {
    const { id, name, price, category, sub_category, options, image_url } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Không tìm thấy món ăn cần cập nhật" }),
        { status: 400 }
      );
    }

    // Lấy record hiện tại để biết image_url cũ
    const { data: existingData, error: fetchError } = await supabaseAdmin
      .from('menu_items')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Nếu có image_url cũ và đang cập nhật image mới, xóa ảnh cũ
    if (existingData?.image_url && image_url && existingData.image_url !== image_url) {
      const parts = existingData.image_url.split('/');
      const fileName = parts.slice(-1)[0]; // lấy tên file
      const { error: storageError } = await supabaseAdmin
        .storage
        .from('food-images') // bucket của bạn
        .remove([`foods/${fileName}`]); // nhớ thêm path folder nếu có

      if (storageError) {
        console.warn("Xóa file hình cũ thất bại:", storageError.message);
      }
    }

    // Kiểm tra có ít nhất 1 trường để update
    if (
      name == null &&
      price == null &&
      category == null &&
      sub_category == null &&
      options == null &&
      image_url == null
    ) {
      return new Response(
        JSON.stringify({ message: "Không có trường nào để cập nhật" }),
        { status: 400 }
      );
    }

    // Update DB
    const { data: menuItem, error } = await supabaseAdmin
      .from('menu_items')
      .update({
        ...(name != null && { name }),
        ...(price != null && { price }),
        ...(category != null && { category }),
        ...(sub_category != null && { sub_category }),
        ...(options != null && { options }),
        ...(image_url != null && { image_url }),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Cập nhật thành công", menuItem }), { status: 200 });

  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
