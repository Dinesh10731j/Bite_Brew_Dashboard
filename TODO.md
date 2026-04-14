## Fix Login "Failed to fetch" & Dashboard Redirect

### 1. ✅ Replace fetch client with axios client 
   - Updated `lib/api/client.ts` to use axios
   - Fixed interceptors in axios.ts
   - Types compatible with existing dashboardApi

### 2. ✅ Add Next.js proxy/rewrites
   - Added API proxy in `next.config.ts`

### 3. [ ] Mock login response temporarily
   - Hardcode success in `useLogin.ts` for frontend testing
   - Test redirect to /dashboard

### 4. [ ] Fix post-login redirect
   - Ensure token extracted/set
   - Check middleware role validation
   - Invalidate/refetch currentUser query

### 5. [ ] Update Next.js & test
   - `npm install next@latest`
   - `cd Dashboard && npm run dev`
   - Test login → dashboard flow

### 6. [ ] Backend integration
   - Start backend server @ localhost:7000
   - Remove mocks
   - Full e2e test

**Current Status**: Axios migration complete, proxy added. Run `cd Dashboard && npm run dev` to test. Next: mock for frontend demo + redirect fix.


