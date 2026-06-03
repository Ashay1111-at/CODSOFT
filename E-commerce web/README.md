# 🛒 ShopHub - E-Commerce Platform

A full-stack e-commerce web application built with the **MERN stack** featuring user authentication, product management, shopping cart, order processing, Razorpay payment integration, and an admin dashboard.

---

## ✨ Features

### 👤 User Features
- User registration & login with JWT authentication 🔐
- Browse products with search, filter, and pagination 🔍
- Product detail page with image gallery and reviews ⭐
- Add to cart with quantity management 🛍️
- Checkout with shipping address form 📦
- Razorpay payment integration (real & test mode) 💳
- Order history with status tracking 📋
- Password reset via email 📧
- Profile management (name, phone, address, avatar) 👤

### 🛠️ Admin Features
- Admin dashboard with stats (products, orders, users, revenue) 📊
- Product CRUD with Cloudinary image upload 📸
- Order management with status updates 📑
- User management (block/unblock, role toggle, delete) 👥

---

## 🧰 Tech Stack

### Backend
| Technology | Version |
|---|---|
| Node.js | ^24 |
| Express | ^5.2.1 |
| MongoDB Atlas (Mongoose) | ^9.6.3 |
| JSON Web Token (JWT) | ^9.0.3 |
| Bcryptjs | ^3.0.3 |
| Cloudinary | ^2.10.0 |
| Razorpay | ^2.9.6 |
| Nodemailer | ^8.0.9 |
| Multer | ^2.1.1 |

### Frontend
| Technology | Version |
|---|---|
| React | ^19.2.6 |
| Vite | ^8.0.12 |
| Redux Toolkit | ^2.12.0 |
| React Router | ^7.15.1 |
| Axios | ^1.16.1 |
| Tailwind CSS | ^4.3.0 |

---

## 📁 Project Structure

```
E-commerce web/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Auth (register, login, profile, password)
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + admin guard
│   │   └── error.js            # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── cloudinary.js
│   │   └── razorpay.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── Orders.jsx
│   │   │       └── Users.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── cartSlice.js
│   │   │       ├── productSlice.js
│   │   │       └── orderSlice.js
│   │   └── services/
│   │       └── api.js
│   ├── .env
│   ├── vite.config.js
│   └── package.json
└── imegs/                      # Sample product images
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ 
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Razorpay account (for payments)
- Gmail account (for password reset emails)

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone <repo-url>
cd "E-commerce web"

# Install all dependencies (backend + frontend)
npm run install-all
```

### 2️⃣ Environment Variables

**Backend** — Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Frontend** — Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Run the App

```bash
# Run both backend & frontend simultaneously
npm run dev

# Or run them separately:
npm run dev:backend   # Backend on http://localhost:5000
npm run dev:frontend  # Frontend on http://localhost:5173
```

### 4️⃣ Run Tests

```bash
cd backend
npm test
```

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create account |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | User | Get current profile |
| PUT | `/profile` | User | Update profile |
| POST | `/forgot-password` | Public | Send reset email |
| POST | `/reset-password/:token` | Public | Reset password |
| GET | `/` | Admin | List all users |
| PUT | `/:id` | Admin | Update user role/status |
| DELETE | `/:id` | Admin | Delete user |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List (filter, sort, paginate) |
| GET | `/categories` | Public | Get categories |
| GET | `/featured` | Public | Featured products |
| GET | `/trending` | Public | Trending products |
| GET | `/:id` | Public | Product detail |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | User | Place order |
| GET | `/myorders` | User | My orders |
| GET | `/all` | Admin | All orders |
| GET | `/:id` | User | Order detail |
| PUT | `/:id/status` | Admin | Update status |
| PUT | `/:id/cancel` | User | Cancel order |

### Payment (`/api/payment`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create` | User | Create Razorpay order |
| POST | `/verify` | User | Verify payment |
| POST | `/test` | User | Test payment (bypass) |
| GET | `/key` | User | Get Razorpay key |

### Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/product/:productId` | Public | Product reviews |
| POST | `/product/:productId` | User | Create review |
| DELETE | `/:id` | User/Admin | Delete review |

### Upload (`/api/upload`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin | Upload image to Cloudinary |
| DELETE | `/` | Admin | Delete image from Cloudinary |

---

## 🧪 Key Features Explained

- **🛡️ Authentication** — JWT with 30-day expiry, bcrypt password hashing (12 salt rounds), user blocking support
- **📦 Cart** — Persisted to localStorage, survives page refreshes
- **🚚 Shipping** — Free shipping on orders over ₹500, otherwise ₹40 flat
- **💳 Payments** — Real Razorpay integration with signature verification; test mode available for development
- **📸 Images** — Uploaded to Cloudinary via multer (memory storage) with base64 encoding
- **⭐ Reviews** — One review per user per product, auto-updates product rating
- **📊 Admin Dashboard** — Aggregated stats (total products, orders, users, revenue)
- **🔄 Stock Management** — Stock decrements on order, restores on cancellation

---

## 📜 Scripts

| Script | Description |
|---|---|
| `npm run install-all` | Install deps for both backend & frontend |
| `npm run dev` | Run both servers concurrently |
| `npm run dev:backend` | Backend with auto-restart (`--watch`) |
| `npm run dev:frontend` | Vite dev server with HMR |
| `npm run build` | Build frontend for production |
| `npm run start` | Start backend in production |

---

## 🚢 Deployment

### 🌐 Frontend on Vercel

1. **Push your code to GitHub**

2. **Create a Vercel account** at [vercel.com](https://vercel.com) (log in with GitHub)

3. **Import repository**
   - Click **Add New → Project**
   - Select your GitHub repo
   - Set **Root Directory** to `frontend`
   - **Framework Preset** → `Vite` (auto-detected)
   - **Build Command** → `npm run build`
   - **Output Directory** → `dist`

4. **Set environment variable** in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. **Deploy** — Vercel auto-deploys on every `git push`

> 💡 Alternatively, set `vite.config.js` to proxy `/api` and deploy the root directory with Vercel's `vercel.json` rewrite rules.

---

### 🖥️ Backend on Render

1. **Push your code to GitHub**

2. **Create a Render account** at [render.com](https://render.com) (log in with GitHub)

3. **Create a Web Service**
   - Click **New + → Web Service**
   - Connect your GitHub repo
   - **Name** → `shophub-api` (or any)
   - **Root Directory** → `backend`
   - **Runtime** → `Node`
   - **Build Command** → `npm install`
   - **Start Command** → `npm start`
   - **Instance Type** → Free (or paid)

4. **Add Environment Variables** in Render dashboard:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGO_URI` | Your MongoDB Atlas URI |
   | `JWT_SECRET` | A strong random string |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary name |
   | `CLOUDINARY_API_KEY` | Your Cloudinary key |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary secret |
   | `RAZORPAY_KEY_ID` | Your Razorpay key |
   | `RAZORPAY_KEY_SECRET` | Your Razorpay secret |
   | `EMAIL_USER` | Your Gmail address |
   | `EMAIL_PASS` | Your Gmail app password |

5. **Deploy** — Render auto-deploys on every `git push`

> ⚠️ Free tier spins down after 15 min of inactivity. First request after idle may take 30-60 sec to wake up.

---

### 🔗 Post-Deployment

1. Update the frontend `.env` `VITE_API_URL` to point to your Render backend URL
2. Update the backend `FRONTEND_URL` to point to your Vercel frontend URL
3. Update Razorpay/Razorpay test mode webhook URLs if needed
4. On MongoDB Atlas, whitelist Render's IP (`0.0.0.0/0` for all IPs) in Network Access

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is for educational/demonstration purposes.
