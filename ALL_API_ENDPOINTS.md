# Complete List of All API Endpoints

## All Frontend API Calls

Your frontend makes these API calls (all need `/api` prefix):

### Product Endpoints
1. **GET `/products`** - Get all products
   - Used in: `helpers/index.ts` → `getProducts()`
   - Full URL: `https://shopswift-backend-084u.onrender.com/api/products`

2. **GET `/products/{id}`** - Get single product
   - Used in: `helpers/index.ts` → `getSingleProduct()`
   - Used in: `app/update-product/page.tsx`
   - Full URL: `https://shopswift-backend-084u.onrender.com/api/products/{id}`

3. **POST `/product`** - Add new product (Admin only)
   - Used in: `app/add-product/page.tsx`
   - Full URL: `https://shopswift-backend-084u.onrender.com/api/product`

4. **PUT `/product/{id}`** - Update product (Admin only)
   - Used in: `app/update-product/page.tsx`
   - Full URL: `https://shopswift-backend-084u.onrender.com/api/product/{id}`

5. **DELETE `/product/{id}`** - Delete product (Admin only)
   - Used in: `components/SignleProduct.tsx`
   - Full URL: `https://shopswift-backend-084u.onrender.com/api/product/{id}`

### Order Endpoints
6. **POST `/place`** - Place an order
   - Used in: `components/PaymentForm.tsx`
   - Full URL: `https://shopswift-backend-084u.onrender.com/api/place`

7. **GET `/orders`** - Get user orders
   - Used in: `components/OrderDetails.tsx`
   - Full URL: `https://shopswift-backend-084u.onrender.com/api/orders`

### User/Auth Endpoints
8. **GET `/user/current`** - Get current user info
   - Used in: `context/AuthContext.tsx` → `checkAuth()`
   - Full URL: `https://shopswift-backend-084u.onrender.com/api/user/current`

9. **POST `/login`** - User login
   - Used in: `context/AuthContext.tsx` → `login()`
   - Full URL: `https://shopswift-backend-084u.onrender.com/api/login`

10. **POST `/admin/login`** - Admin login
    - Used in: `context/AuthContext.tsx` → `adminLogin()`
    - Full URL: `https://shopswift-backend-084u.onrender.com/api/admin/login`

11. **POST `/register`** - Register new user
    - Used in: `context/AuthContext.tsx` → `register()`
    - Full URL: `https://shopswift-backend-084u.onrender.com/api/register`

## The Fix

**All these endpoints will work correctly if you set:**

```
NEXT_PUBLIC_API_URL=https://shopswift-backend-084u.onrender.com/api
```

**In Vercel Environment Variables.**

This way:
- `API.get("/products")` → `https://shopswift-backend-084u.onrender.com/api/products` ✅
- `API.post("/login")` → `https://shopswift-backend-084u.onrender.com/api/login` ✅
- `API.get("/orders")` → `https://shopswift-backend-084u.onrender.com/api/orders` ✅
- All other endpoints will work correctly ✅

## Current vs Correct

**Current (Wrong):**
```
NEXT_PUBLIC_API_URL = https://shopswift-backend-084u.onrender.com
API.get("/products") → https://shopswift-backend-084u.onrender.com/products ❌ 404
API.post("/login") → https://shopswift-backend-084u.onrender.com/login ❌ 404
API.get("/orders") → https://shopswift-backend-084u.onrender.com/orders ❌ 404
```

**Correct:**
```
NEXT_PUBLIC_API_URL = https://shopswift-backend-084u.onrender.com/api
API.get("/products") → https://shopswift-backend-084u.onrender.com/api/products ✅
API.post("/login") → https://shopswift-backend-084u.onrender.com/api/login ✅
API.get("/orders") → https://shopswift-backend-084u.onrender.com/api/orders ✅
```

## Steps to Fix

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **Find/Add** `NEXT_PUBLIC_API_URL`
3. **Set value to:** `https://shopswift-backend-084u.onrender.com/api`
4. **Save** and **Redeploy**

This single fix will make ALL 11 endpoints work correctly!

