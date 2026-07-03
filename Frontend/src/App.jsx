import { lazy, Suspense, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConsentBanner from './components/ConsentBanner';
import SearchBar from './components/SearchBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import { ShopContext } from './context/ShopContext';

const Home = lazy(() => import('./pages/Home'));
const Collection = lazy(() => import('./pages/Collection'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Product = lazy(() => import('./pages/Product'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Login = lazy(() => import('./pages/Login'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Brands = lazy(() => import('./components/Brands'));
const Verify = lazy(() => import('./pages/verify'));

const PageFallback = () => <div className="min-h-[60vh]" aria-hidden="true" />;

const RequireAuth = ({ children }) => {
  const { token } = useContext(ShopContext);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <ToastContainer theme="colored" position="top-right" />
          <Navbar />
          <SearchBar />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route
                path="/orders"
                element={
                  <RequireAuth>
                    <Orders />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/verify" element={<Verify />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
        <ConsentBanner />
      </div>
    </ThemeProvider>
  );
};

export default App;
