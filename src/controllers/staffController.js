import * as StaffModel from "@/models/staffModel";
import { successResponse, errorResponse } from "@/utils/response";

// Get all staff
export async function getStaffController() {
  try {
    const staff = await StaffModel.getAllStaff();
    return successResponse(staff, "Staff retrieved successfully");
  } catch (error) {
    return errorResponse("Failed to retrieve staff", 500, error);
  }
}

// Create staff
export async function createStaffController(req) {
  try {
    const { email, password, name, role } = await req.json();

    // Validation
    if (!email || !password || !name || !role) {
      return errorResponse("Missing required fields: email, password, name, role", 400);
    }

    const newStaff = await StaffModel.createStaff({ email, password, name, role });
    return successResponse(newStaff, "Staff created successfully", 201);
  } catch (error) {
    return errorResponse("Failed to create staff", 400, error);
  }
}

// Update staff
export async function updateStaffController(req, id) {
  try {
    const updates = await req.json();
    const updatedStaff = await StaffModel.updateStaff(id, updates);
    return successResponse(updatedStaff, "Staff updated successfully");
  } catch (error) {
    return errorResponse("Failed to update staff", 400, error);
  }
}

// Delete staff
export async function deleteStaffController(id) {
  try {
    const result = await StaffModel.deleteStaff(id);
    return successResponse(result, "Staff deleted successfully");
  } catch (error) {
    return errorResponse("Failed to delete staff", 400, error);
  }
}

// Reset staff password
export async function resetPasswordController(req, id) {
  try {
    const { password } = await req.json();

    if (!password) {
      return errorResponse("Missing required field: password", 400);
    }

    const result = await StaffModel.resetStaffPassword(id, password);
    return successResponse(result, "Password reset successfully");
  } catch (error) {
    return errorResponse("Failed to reset password", 400, error);
  }
}
