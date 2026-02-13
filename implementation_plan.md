# Implementation Plan - Admin Stock Management

## Goal
Implement a robust Role-Based Access Control (RBAC) system where "Admins" manage the stock inventory (add/edit stocks with full share counts) and "Users" trade fractional shares from this inventory.

## User Review Required
> [!IMPORTANT]
> **Database Schema Changes**: Adding `totalShares` and `availableShares` to the `Stock` model.
> **Security**: Admin routes will be protected. Users attempting to access `/admin` will be redirected.

## Proposed Changes

### Database Schema
#### [MODIFY] [Stock.ts](file:///d:/Hackathone/lib/models/Stock.ts)
- Add `totalShares` (Number, required) - Total shares issued by Admin.
- Add `availableShares` (Number, required) - Shares remaining for users to buy.

### Backend API
#### [NEW] [Admin Middleware / Utils](file:///d:/Hackathone/lib/admin.ts)
- Utility to verify Admin role server-side.

#### [NEW] [Admin Stock API](file:///d:/Hackathone/app/api/admin/stocks/route.ts)
- `POST` - Create new stock (Admin only).
- `PUT` - Update stock (Admin only).
- `DELETE` - Remove stock (Admin only).

#### [MODIFY] [Trade API](file:///d:/Hackathone/app/api/trade/route.ts)
- **Buy Logic**: Check if `Stock.availableShares >= requestedShares`. Decrement `availableShares`.
- **Sell Logic**: Increment `availableShares`.

### Frontend UI
#### [NEW] [Admin Dashboard](file:///d:/Hackathone/app/admin/dashboard/page.tsx)
- Stats: Total Stocks, Total Inventory, Total Users.
- List of stocks with "Edit" actions.

#### [NEW] [Add Stock Page](file:///d:/Hackathone/app/admin/stocks/new/page.tsx)
- Form to input: Symbol, Name, Price, Shares, Description, Fundamentals.

#### [MODIFY] [Stock Detail Page](file:///d:/Hackathone/app/(app)/stocks/[id]/page.tsx)
- Display "Available Shares".
- Show "Ownership Progress" (User Shares / 1 Full Share).

## Verification Plan
### Manual Verification
1.  **Admin Flow**:
    - Login as Admin (need to manually set a user to admin in DB via API).
    - Go to `/admin/dashboard`.
    - Create a new stock "TEST" with 100 shares.
    - Verify it appears in the market.
2.  **User Flow**:
    - Login as User.
    - Go to "TEST" stock page.
    - Buy 10.5 shares.
    - Verify Admin Dashboard shows 89.5 shares remaining.
    - Sell 5 shares.
    - Verify Admin Dashboard shows 94.5 shares remaining.
3.  **Security**:
    - Try accessing `/admin/dashboard` as a normal user -> Should redirect or 403.
