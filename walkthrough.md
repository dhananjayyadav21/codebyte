# Database & Trading Engine Upgrade Walkthrough

## Overview
The platform has been upgraded from a static mock-data prototype to a fully dynamic, database-driven application. All stocks, transactions, and portfolio data are now persistent in MongoDB.

## Features Implemented

### 1. Real-Time Database
- **MongoDB** is used to store `Users`, `Stocks`, `Transactions`, and `Portfolios`.
- **Seeding**: The database has been populated with ~12 initial stocks (Apple, Microsoft, NVIDIA, etc.) with realistic market data.

### 2. Trading Engine
- **Buy Stocks**: Users can buy fractional shares. The system validates their cash balance and updates their portfolio instantly.
- **Sell Stocks**: Users can sell holdings. The system ensures they own enough shares before executing.
- **Transaction History**: Every trade is logged immutably in the `transactions` collection.

### 3. Dynamic Dashboard
- **Portfolio Value**: Calculated in real-time based on current stock prices and user holdings.
- **Activity Feed**: Shows the latest buy/sell operations fetched from the database.

## How to Test

1.  **Login**: Log in with your demo account.
2.  **Explore Market**: Go to the **Market** page. You will see a list of stocks fetched from the DB.
3.  **Buy a Stock**:
    *   Click on **NVIDIA (NVDA)** (or any stock).
    *   Enter an amount (e.g., **$1000**).
    *   Click **Buy**.
    *   *Verification*: You should see a success toast.
4.  **Check Dashboard**:
    *   Go to **Dashboard**.
    *   You should see NVDA in your **Assets**.
    *   Your **Cash Balance** should decrease by $1000.
    *   The transaction should appear in **Recent Activity**.
5.  **Sell a Stock**:
    *   Go back to NVDA.
    *   Switch to the **Sell** tab.
    *   Enter shares to sell.
    *   Click **Sell**.
    *   *Verification*: Your holdings should decrease, and cash balance increase.

6.  **Deposit Funds**:
    *   Go to **Dashboard**.
    *   Click **Deposit** (top right).
    *   Enter amount (e.g., $500).
    *   Click **Deposit**.
    *   *Verification*: Balance increases instantly.

## API Endpoints Created
- `GET /api/stocks`: List all stocks.
- `GET /api/stocks/:id`: Get stock details + user position.
- `POST /api/trade`: Execute Buy/Sell.
- `GET /api/portfolio`: Get user portfolio.
- `POST /api/wallet`: Execute type="DEPOSIT".
