# MVC Architecture Guide

## Project Architecture Overview

This project uses a simplified MVC-like structure inside a Next.js application.

```
src/
├── app/
│   └── api/                  # API routes
│       ├── admin/
│       │   ├── route.js
│       │   └── stats/route.js
│       ├── bill/route.js
│       ├── dashboard/route.js
│       ├── menu_items/route.js
│       ├── orders/route.js
│       ├── order_items/route.js
│       └── table/route.js
│
├── controllers/              # Business logic and validation
│   ├── billController.js
│   ├── orderController.js
│   ├── orderItemController.js
│   ├── menuItemController.js
│   ├── staffController.js
│   ├── tableController.js
│   └── billController.js
│
├── models/                   # Database access and queries
│   ├── billModel.js
│   ├── menuItemModel.js
│   ├── orderModel.js
│   ├── orderItemModel.js
│   ├── staffModel.js
│   └── tableModel.js
│
├── lib/                      # Auth helpers
│   └── auth.js
│
├── utils/                    # Shared utilities
│   ├── authFetch.js
│   └── response.js
└── api/                      # Supabase clients
    ├── adminClient.js
    └── client.js
```

## MVC Layers in This Project

### 1. Model

Models encapsulate database queries and data transformations.

Examples:
- `src/models/billModel.js` handles bill retrieval, totals, and closing logic.
- `src/models/menuItemModel.js` handles menu CRUD operations.
- `src/models/tableModel.js` handles table CRUD and QR code updates.

### 2. Controller

Controllers contain business logic, validation, and error handling.
They call model functions and return structured responses.

Examples:
- `src/controllers/staffController.js`
- `src/controllers/orderController.js`
- `src/controllers/tableController.js`

### 3. Route

Routes are the API entry point. They:
- parse request parameters
- enforce authorization via `requireRole`
- call corresponding controller functions
- return the controller response

Routes should not contain direct database logic.

### 4. Utils

Utilities support common behaviors such as:
- authenticated fetch client (`src/utils/authFetch.js`)
- standardized response formatting (`src/utils/response.js`)

## Current API Routes

### Admin / Staff
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin` | Get all staff users |
| POST | `/api/admin` | Create a staff user |
| PUT | `/api/admin?id={id}` | Update staff user |
| DELETE | `/api/admin?id={id}` | Delete staff user |
| PATCH | `/api/admin?id={id}` | Reset staff password |

### Admin Stats
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/stats` | Get admin dashboard stats |

### Bills
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/bill` | Get open bills |
| GET | `/api/bill?scope=all` | Get all bills with stats |
| POST | `/api/bill` | Get bill detail by ID |
| PATCH | `/api/bill?action=close` | Close bill by bill ID |
| PATCH | `/api/bill?action=status` | Close bill by table ID |

### Dashboard
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/dashboard` | Get dashboard metrics and recent orders |

### Menu Items
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/menu_items` | Get all menu items |
| POST | `/api/menu_items` | Create menu item |
| PUT | `/api/menu_items?id={id}` | Update menu item |
| DELETE | `/api/menu_items?id={id}` | Delete menu item |

### Orders
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/orders` | Get pending orders |
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders?id={id}` | Update order status |
| DELETE | `/api/orders?id={id}` | Delete order |

### Order Items
| Method | Endpoint | Purpose |
|--------|----------|---------|
| PUT | `/api/order_items?id={id}` | Update order item |
| DELETE | `/api/order_items?id={id}` | Delete order item |

### Tables
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/table` | Get all tables |
| POST | `/api/table` | Create table |
| PUT | `/api/table?id={id}` | Update table |
| DELETE | `/api/table?id={id}` | Delete table |
| PATCH | `/api/table?id={id}` | Update table or QR code |

## Authorization Pattern

Most API routes use `requireRole(req, allowedRoles)` from `src/lib/auth.js`.

- `admin` only: admin creation, update, delete actions
- `admin|staff`: bill actions, order actions, order item actions
- public: menu listing and table listing

## Request Flow

```
Client request
  ↓
Route handler (src/app/api/.../route.js)
  ↓
Controller (validation + business logic)
  ↓
Model (database queries)
  ↓
Response utils / direct response
  ↓
Client response
```

## Adding a New API Endpoint

1. Add a model function in `src/models/yourModel.js`
2. Add a controller function in `src/controllers/yourController.js`
3. Add or update the route handler in `src/app/api/yourRoute/route.js`
4. Protect the route with `requireRole` if needed

Example:

```javascript
// src/models/billModel.js
export async function getBillById(id) {
  const { data, error } = await supabaseAdmin
    .from("bills")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// src/controllers/billController.js
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

// src/app/api/bill/route.js
import { getBillController } from "@/controllers/billController";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return errorResponse("Bill ID required", 400);
  return getBillController(id);
}
```

## API Response Standard

Responses follow a shared format:

```json
// Success
{
  "success": true,
  "data": {...},
  "message": "Success message"
}

// Error
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error info"
}
```

## Benefits of This Architecture

- **Separation of concerns**: each layer has one responsibility
- **Reusability**: models are reusable across controllers
- **Testability**: easier to test individual layers
- **Maintainability**: easier to update and extend
- **Consistency**: centralized response and auth patterns
- **Scalability**: easy to add new resources and routes
