# Clovo Frontend

A modern, responsive React + Vite e-commerce application providing a seamless shopping experience with product browsing, user authentication, cart management, and order tracking.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Authentication](#-authentication-guide)
- [Progressive Web App (PWA)](#-progressive-web-app-pwa)
- [API Integration](#-api-integration)
- [Troubleshooting](#-troubleshooting)
- [Development Tips](#-development-tips)

## ✨ Features

### Core Functionality
- 🛍️ **Product Browsing** – Browse products by collections and categories
- 🔍 **Search Functionality** – Find products quickly with search bar
- 🛒 **Shopping Cart** – Add/remove products, manage quantities
- ❤️ **Wishlist** – Save favorite products for later
- 💳 **Checkout Flow** – Secure order placement and payment
- 👤 **User Authentication** – Email/password and OAuth (Google, GitHub)
- 📦 **Order History** – View past orders and track status
- 👨‍💼 **User Profile** – Manage account information and preferences
- 🌙 **Dark Mode** – Theme switcher for comfortable viewing
- 📱 **PWA Support** – Install as app, offline capability
- 📧 **Newsletter** – Subscribe to updates and promotions

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend Framework** | React 18+ |
| **Build Tool** | Vite |
| **Routing** | React Router |
| **HTTP Client** | Axios |
| **Styling** | Tailwind CSS |
| **State Management** | React Context API |
| **Package Manager** | npm |

## 📦 Prerequisites

- **Node.js** 18.0 or higher (check with `node --version`)
- **npm** 9.0 or higher (check with `npm --version`)
- **Backend server** running (see `Backend/README.md`)
- Modern web browser with JavaScript enabled

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `Frontend` directory:

```env
# Backend API Configuration
VITE_BACKEND_URL=http://localhost:8000

# Cart Configuration
VITE_DELIVERY_FEE=10

# Optional: API Timeout (in milliseconds)
VITE_API_TIMEOUT=10000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 📁 Project Structure

```
src/
├── pages/                  # Page components (screens)
│   ├── Home.jsx           # Landing page
│   ├── Collection.jsx     # Product collection view
│   ├── Product.jsx        # Product detail page
│   ├── Cart.jsx           # Shopping cart
│   ├── PlaceOrder.jsx     # Checkout page
│   ├── Orders.jsx         # Order history
│   ├── Profile.jsx        # User profile
│   ├── Login.jsx          # Authentication page
│   ├── About.jsx          # About page
│   ├── Contact.jsx        # Contact page
│   └── ...other pages
│
├── components/            # Reusable UI components
│   ├── Navbar.jsx        # Navigation bar
│   ├── ProductItem.jsx   # Product card
│   ├── CartTotal.jsx     # Cart summary
│   ├── Footer.jsx        # Footer
│   └── ...other components
│
├── context/               # State management
│   ├── ShopContext.jsx   # Global shop state (products, cart, user)
│   └── ThemeContext.jsx  # Theme state (light/dark mode)
│
├── assets/                # Static assets
│   ├── assets.js         # Asset imports/exports
│   └── icons/            # SVG icons
│
├── App.jsx               # Root component
├── main.jsx              # Entry point
├── index.css             # Global styles
└── pwa.js                # PWA configuration

public/
├── manifest.webmanifest  # PWA manifest
└── offline.html          # Offline fallback page
```

## 🔐 Authentication Guide

### Email/Password Authentication

1. Users register via `/pages/Login.jsx`
2. Credentials validated against backend `/api/user` endpoints
3. Backend returns JWT token stored in localStorage
4. Token automatically included in API requests via Axios interceptor

### OAuth (Google & GitHub)

1. User clicks OAuth provider button
2. Redirected to backend OAuth endpoint
3. Backend redirects back to `/oauth/callback` with token
4. Frontend processes callback, stores token, redirects to original location

**Required Backend Configuration:**
```env
# Backend .env
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 📱 Progressive Web App (PWA)

The app is PWA-enabled for offline support and installability.

### Features
- ✅ Works offline with cached assets
- ✅ Install as standalone app (Android, iOS, Desktop)
- ✅ Push notification ready
- ✅ Offline fallback page

### Installation
- **Android**: Open in Chrome → Menu → "Install app"
- **iOS**: Open in Safari → Share → "Add to Home Screen"
- **Desktop**: Open in Chrome/Edge → URL bar → "Install" icon

## 🔗 API Integration

### Key Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Fetch all products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/user/register` | User registration |
| POST | `/api/user/login` | User login |
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add to cart |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | Get user orders |
| GET | `/api/wishlist` | Get wishlist items |

All API calls use Axios with automatic JWT token attachment via interceptors.

## 🐛 Troubleshooting

### Common Issues

#### "Backend URL is not configured"
- Ensure `.env` file exists in `Frontend/` directory
- Verify `VITE_BACKEND_URL=http://localhost:8000` is set correctly
- Confirm backend server is running

#### OAuth fails with "Did not return email"
- **GitHub**: Make your GitHub email public in Settings → Emails → Public email
- **Google**: Use a Google account with verified email

#### CORS errors
- Backend should have `FRONTEND_URL` configured for CORS headers
- Check backend `.env` has correct frontend URL

#### Build fails with "Module not found"
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json  # Windows: rmdir /s node_modules
npm install
```

#### PWA not installing
- Ensure HTTPS is used in production (PWA requires HTTPS)
- Check `public/manifest.webmanifest` is valid JSON
- Try clearing browser cache and service workers

#### Port 5173 already in use
```bash
npm run dev -- --port 3000  # Use different port
```

## 💡 Development Tips

### Hot Module Reload (HMR)
- Changes to React components automatically reload without losing state
- CSS changes are applied instantly

### Context API Usage
- Access global state via `useContext(ShopContext)`
- Theme switching uses `ThemeContext`
- Avoid prop drilling with context

### Code Quality
- Run `npm run lint` before committing
- Follow ESLint rules defined in `eslint.config.js`

### Performance Optimization
- Images are optimized by Vite
- Use React.lazy() for code splitting
- Monitor bundle size with build analysis tools

## 📄 License

See [LICENSE](../LICENSE) for details.

## 🤝 Contributing

For backend integration details, see [Backend README](../Backend/README.md)
For admin panel, see [Admin README](../admin/README.md)
