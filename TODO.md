# Dashboard Overview Data Integration Plan

## Objective
Display the provided Bite Brew dashboard overview API response (`http://localhost:7000/api/v1/bite-brew/dashboard/overview`) correctly in the dashboard UI.

## Current Issues Found
1. `useDashboard` fetches analytics traffic from a **separate** `/analytics/summary` endpoint, but the traffic data is actually included directly in the overview response under `trafficSummary`.
2. `topLocations` mapping looks for `place` / `name`, but the API returns `city` + `country` fields.
3. `topSellingItems` mapping expects `orders` / `revenue` counts, but the API returns raw menu item objects without order counts.
4. `recentMessages` and `notifications` are fetched from separate endpoints, but they exist directly in the overview response.

## Implementation Steps

### ✅ Step 1: Update `Dashboard/hooks/useDashboard.ts`
- Refactored the loader to use `trafficSummary`, `recentMessages`, `notifications`, `topLocations`, and `topSellingItems` directly from the overview API response.
- Fixed `topLocations` mapping: use `city + country` as `place`.
- Fixed `topSellingItems` mapping: handle missing `orders` count, show item price as fallback.
- Removed redundant separate analytics/messages/notifications fetches.

### ✅ Step 2: Update `Dashboard/components/dashboard-blocks/overview/TopSellingItems.tsx`
- Updated type to include optional `price` field.

### ✅ Step 3: Update `Dashboard/components/dashboard-blocks/common.tsx`
- Updated `InsightList` to handle items lacking `orders` count gracefully.
- Shows item price when revenue is unavailable.
- Displays "-" badge instead of broken ``0 orders` badge when orders count is missing.

### ✅ Step 4: Update `Dashboard/lib/types.ts`
- Added `DashboardOverviewResponse`, `DashboardOverviewCards`, `TrafficDay`, `TrafficSummary`, and `TopLocationApi` interfaces.

### Step 5: Test
- [ ] Run `npm run dev` in the Dashboard directory.
- [ ] Verify the dashboard page renders all cards, charts, and lists correctly with the live endpoint data.

## Dependent Files to Edit
- `Dashboard/hooks/useDashboard.ts` ✅
- `Dashboard/components/dashboard-blocks/overview/TopSellingItems.tsx` ✅
- `Dashboard/lib/types.ts` ✅
- `Dashboard/components/dashboard-blocks/common.tsx` ✅

