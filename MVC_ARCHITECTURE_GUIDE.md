# MVC Architecture Refactoring - Tài liệu Tham Khảo

## 📋 Cấu Trúc MVC đã tạo

```
src/
├── models/                 # Database operations (Tầng Model)
│   ├── staffModel.js
│   ├── menuItemModel.js
│   └── tableModel.js
│
├── controllers/            # Business logic (Tầng Controller)
│   ├── staffController.js
│   ├── menuItemController.js
│   └── tableController.js
│
├── utils/                  # Helper functions
│   └── response.js        # Response formatting utilities
│
└── app/api/               # API Routes (chỉ gọi controllers)
    ├── admin/
    │   ├── get-staff/route.js
    │   ├── create-staff/route.js
    │   ├── update-staff/route.js
    │   ├── delete-staff/route.js
    │   └── reset-password-staff/route.js
    ├── table/
    │   ├── get-table/route.js
    │   ├── create-table/route.js
    │   ├── update-table/route.js
    │   ├── delete-table/route.js
    │   └── update-table-qr-code/route.js
    └── menu_items/
        ├── get-menu_items/route.js
        ├── create-menu_items/route.js
        ├── update-menu_items/route.js
        └── delete-menu_items/route.js
```

## 🏗️ Mô hình MVC đã áp dụng

### 1. **Model** (Tầng Dữ Liệu)
Chứa tất cả logic tương tác với database:
- `staffModel.js`: Quản lý CRUD staff + password reset
- `menuItemModel.js`: Quản lý CRUD menu items
- `tableModel.js`: Quản lý CRUD tables + QR code

**Ưu điểm:**
- ✅ Tái sử dụng trong nhiều controllers
- ✅ Dễ test
- ✅ Centralized database logic

### 2. **Controller** (Tầng Logic)
Xử lý business logic và validation:
- `staffController.js`: Quản lý staff operations
- `menuItemController.js`: Quản lý menu items operations
- `tableController.js`: Quản lý table operations

**Ưu điểm:**
- ✅ Xử lý input validation
- ✅ Orchestration giữa models
- ✅ Consistent error handling

### 3. **Routes** (Tầng API)
Chỉ gọi controllers, không chứa logic:
```javascript
// Before: Tất cả logic trong route
export async function GET() {
  // ... 20+ dòng database logic
}

// After: Route gọi controller
import { getStaffController } from "@/controllers/staffController";
export async function GET() {
  return getStaffController();
}
```

### 4. **Utils** (Hỗ trợ)
- `response.js`: Standardized response format
```javascript
// Success response
successResponse(data, message, status)

// Error response
errorResponse(message, status, error)
```

## 📝 Endpoints đã Refactor

### Staff Management
| Method | Endpoint | Controller |
|--------|----------|-----------|
| GET | `/api/admin/get-staff` | getStaffController |
| POST | `/api/admin/create-staff` | createStaffController |
| PUT | `/api/admin/update-staff?id=X` | updateStaffController |
| DELETE | `/api/admin/delete-staff?id=X` | deleteStaffController |
| POST | `/api/admin/reset-password-staff?id=X` | resetPasswordController |

### Table Management
| Method | Endpoint | Controller |
|--------|----------|-----------|
| GET | `/api/table/get-table` | getAllTablesController |
| POST | `/api/table/create-table` | createTableController |
| POST | `/api/table/update-table?id=X` | updateTableController |
| DELETE | `/api/table/delete-table?id=X` | deleteTableController |
| PATCH | `/api/table/update-table-qr-code?id=X` | updateTableQRCodeController |

### Menu Items Management
| Method | Endpoint | Controller |
|--------|----------|-----------|
| GET | `/api/menu_items/get-menu_items` | getAllMenuItemsController |
| POST | `/api/menu_items/create-menu_items` | createMenuItemController |
| PUT | `/api/menu_items/update-menu_items?id=X` | updateMenuItemController |
| DELETE | `/api/menu_items/delete-menu_items?id=X` | deleteMenuItemController |

## 🔄 Quy trình Yêu Cầu

```
Client Request
    ↓
Route Handler (app/api/xxx/route.js)
    ↓
Controller (xử lý validation + logic)
    ↓
Model (database operations)
    ↓
Response Utils (format response)
    ↓
Client Response
```

## 💡 Cách Thêm Endpoint Mới

1. **Tạo Model function** trong `src/models/xxxModel.js`
2. **Tạo Controller function** trong `src/controllers/xxxController.js`
3. **Tạo Route handler** trong `src/app/api/xxx/route.js`

**Ví dụ - Thêm API lấy bill:**

```javascript
// models/billModel.js
export async function getBillById(id) {
  const { data, error } = await supabaseAdmin
    .from("bills")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// controllers/billController.js
import * as BillModel from "@/models/billModel";
import { successResponse, errorResponse } from "@/utils/response";

export async function getBillController(id) {
  try {
    const bill = await BillModel.getBillById(id);
    return successResponse(bill, "Bill retrieved successfully");
  } catch (error) {
    return errorResponse("Failed to retrieve bill", 500, error);
  }
}

// app/api/bill/get-bill/route.js
import { getBillController } from "@/controllers/billController";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return errorResponse("Bill ID required", 400);
  return getBillController(id);
}
```

## 📋 API Response Format

Tất cả responses đều follow format này:

```javascript
// Success
{
  success: true,
  data: {...},
  message: "Success message"
}

// Error
{
  success: false,
  message: "Error message",
  error: "Detailed error info"
}
```

## 🎯 Lợi Ích của MVC

✅ **Separation of Concerns**: Tách biệt rõ ràng giữa tầng  
✅ **Reusability**: Tái sử dụng models trong nhiều controllers  
✅ **Testability**: Dễ test từng tầng riêng lẻ  
✅ **Maintainability**: Dễ bảo trì và mở rộng  
✅ **Consistency**: Response format thống nhất  
✅ **Scalability**: Dễ thêm features mới
