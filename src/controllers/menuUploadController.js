import * as MenuUploadModel from "@/models/menuUploadModel";

export async function uploadMenuImageController(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.type?.startsWith("image/")) {
      return Response.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const imageUrl = await MenuUploadModel.uploadMenuImage(file);

    return Response.json(
      { url: imageUrl },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}