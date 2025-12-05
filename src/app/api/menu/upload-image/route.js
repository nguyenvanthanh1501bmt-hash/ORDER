import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `foods/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabaseAdmin.storage
      .from("food-images")
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    // Lấy public URL
    const { data } = supabaseAdmin.storage
      .from("food-images")
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ url: data.publicUrl }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
