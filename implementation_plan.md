# Database Integration & Trading Engine Implementation Plan

## Goal
To upgrade the StakeWise platform from using mock data to a fully functional, database-driven trading application. This includes real-time portfolio tracking, transaction recording, and dynamic stock data.

## User Review Required
> [!IMPORTANT]
> **Data Migration**: Existing mock data will be replaced. Only new data created after this update will be persistent.
> **Environment Variables**: Ensure `MONGODB_URI` is set.

## Proposed Changes

### Database Schemas
We will introduce three new MongoDB schemas in addition to the existing `User` schema.

#### [NEW] [Stock.ts](file:///d:/Hackathone/lib/models/Stock.ts)
- **Fields**: `symbol`, `name`, `price`, `change`, `changePercent`, `marketCap`, `volume`, `high52w`, `low52w`, `description`, `growthScore`, `aiRecommendation`, `fundamentals` (Object), `history` (Array of objects).
- **Purpose**: Store real-time (simulated) stock data.

#### [NEW] [Transaction.ts](file:///d:/Hackathone/lib/models/Transaction.ts)
- **Fields**: `userId`, `stockId`, `type` (BUY/SELL), `shares`, `price`, `totalAmount`, `date`.
- **Purpose**: Immutable record of all trading activity.

#### [NEW] [Portfolio.ts](file:///d:/Hackathone/lib/models/Portfolio.ts)
- **Fields**: `userId`, `stockId`, `shares`, `averageBuyPrice`.
- **Purpose**: Fast lookup for current holdings to avoid aggregating transactions every time.

### API Routes

#### [NEW] [api/stocks/route.ts](file:///d:/Hackathone/app/api/stocks/route.ts)
- `GET`: Fetch all stocks (with optional filtering).
- `POST`: Create/Seed stocks (Admin only or for initial setup).

#### [NEW] [api/stocks/[id]/route.ts](file:///d:/Hackathone/app/api/stocks/[id]/route.ts)
- `GET`: Fetch a single stock's details and history.

#### [NEW] [api/trade/route.ts](file:///d:/Hackathone/app/api/trade/route.ts)
- `POST`: Execute a trade (Buy/Sell).
  - **Validation**: Check balance (for Buy) or holdings (for Sell).
  - **Atomic Updates**: Create Transaction + Update Portfolio + Update User Balance (if we add a cash balance field to User).
  > **Note**: For this iteration, we might assume infinite cash or add a `balance` field to User. *Decision: Add `balance` to User schema.*

#### [NEW] [api/portfolio/route.ts](file:///d:/Hackathone/app/api/portfolio/route.ts)
- `GET`: Fetch user's portfolio with current value calculations.

### Frontend Integration

#### [MODIFY] [StockDetailPage](file:///d:/Hackathone/app/(app)/stocks/[id]/page.tsx)
- Replace `mock-data` imports with `fetch('/api/stocks/[id]')`.
- Connect "Buy" button to `/api/trade`.
- Show dynamic "Owned Shares" count.

#### [MODIFY] [DashboardPage](file:///d:/Hackathone/app/(app)/dashboard/page.tsx)
- Fetch real portfolio data.
- Calculate Total Value dynamically.
- Display real transaction history.

#### [MODIFY] [StocksPage](file:///d:/Hackathone/app/(app)/stocks/page.tsx)
- Fetch list of stocks from API.

## Verification Plan

### Automated
- Use `curl` or Postman to test API endpoints.
- Verify MongoDB documents are created correctly.

### Manual
1.  **Seed Data**: Run a script/endpoint to populate Stocks.
2.  **Buy Stock**: Go to Stock Detail -> Buy 1 share -> Check Dashboard.
3.  **Sell Stock**: Go to Stock Detail -> Sell 0.5 share -> Check Dashboard.
4.  **Edge Cases**: Try to sell more than owned (should fail).
