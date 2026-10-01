import { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';

const NAV_LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/collection', label: 'COLLECTION' },
  { to: '/about', label: 'ABOUT' },
  { to: '/contact', label: 'CONTACT' },
];

const IconBtn = ({ onClick, label, className = '', children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center rounded-xl
      text-gray-600 dark:text-gray-400
      hover:bg-gray-100 dark:hover:bg-gray-800
      active:scale-95 transition-all duration-150 ${className}`}
  >
    {children}
  </button>
);

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, getWishlistCount } =
    useContext(ShopContext);
  const { dark, toggle } = useTheme();
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setVisible(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const logout = () => {
    setProfileOpen(false);
    setVisible(false);
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    navigate('/login');
  };

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <>
      {/* ── Navbar bar ── */}
      <header
        className={`sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md
        transition-shadow duration-200
        ${scrolled ? 'shadow-sm border-b border-gray-100 dark:border-gray-800/60' : ''}`}
      >
        {/* 
          Responsive max-width breakdowns:
          mobile  (< 640px):  px-3, h-14  — compact
          sm      (640px+):   px-4, h-15  — slight increase
          md      (768px+):   px-6, h-16  — full desktop nav appears
          lg      (1024px+):  px-8, h-16  — more breathing room
          xl      (1280px+):  px-10       — wide screens
          2xl     (1536px+):  max-w-screen-2xl, centered
        */}
        <div
          className="flex items-center justify-between
          h-14 sm:h-15 md:h-16
          px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10
          font-medium
          max-w-screen-2xl mx-auto"
        >
          {/* Logo */}
          <Link to="/" className="h-10 md:h-11 flex items-center shrink-0">
            <img
              src={assets.logo}
              className="h-7 sm:h-8 md:h-8 lg:h-9 w-auto object-contain dark:invert"
              alt="Logo"
            />
          </Link>

          {/* Desktop nav — hidden on mobile/tablet, visible from md+ */}
          <ul className="hidden md:flex gap-2 lg:gap-4 text-sm tracking-widest">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative px-3 lg:px-4 py-2 rounded-lg transition-colors duration-150
                     text-gray-600 dark:text-gray-300 text-xs lg:text-sm font-medium
                     ${
                       isActive
                         ? '!text-gray-900 dark:!text-white'
                         : 'hover:text-gray-900 dark:hover:text-white'
                     }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <span
                        className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-gray-900
                        dark:bg-white rounded-full transition-all duration-200
                        ${isActive ? 'w-4 opacity-100' : 'w-0 opacity-0'}`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Search — md+ only */}
            <IconBtn onClick={() => setShowSearch(true)} label="Search" className="hidden md:flex">
              <img
                src={assets.search_icon}
                className="w-4 h-4 lg:w-5 lg:h-5"
                alt=""
                aria-hidden="true"
              />
            </IconBtn>

            {/* Dark/light — md+ only */}
            <IconBtn
              onClick={toggle}
              label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="hidden md:flex"
            >
              {dark ? (
                <Icon name="SunIcon" className="w-4 h-4 lg:w-5 lg:h-5" />
              ) : (
                <Icon name="MoonIcon" className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </IconBtn>

            {/* Profile dropdown — md+ only */}
            <div
              ref={profileRef}
              className="relative hidden md:block"
              onMouseEnter={() => token && setProfileOpen(true)}
              onMouseLeave={() => token && setProfileOpen(false)}
            >
              <IconBtn
                onClick={() => (token ? setProfileOpen((v) => !v) : navigate('/login'))}
                label="Profile"
              >
                <img
                  src={assets.profile_icon}
                  className="w-4 h-4 lg:w-5 lg:h-5"
                  alt=""
                  aria-hidden="true"
                />
              </IconBtn>

              {token && (
                <div
                  className={`absolute right-0 top-full pt-2 z-50 transition-all duration-150
                  ${
                    profileOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-1 pointer-events-none'
                  }`}
                >
                  <div
                    className="w-44 py-1 bg-white dark:bg-gray-900
                    border border-gray-100 dark:border-gray-800
                    rounded-xl shadow-xl overflow-hidden
                    text-sm text-gray-600 dark:text-gray-400"
                  >
                    {[
                      {
                        label: 'My Profile',
                        action: () => {
                          setProfileOpen(false);
                          navigate('/profile');
                        },
                      },
                      {
                        label: 'Orders',
                        action: () => {
                          setProfileOpen(false);
                          navigate('/orders');
                        },
                      },
                      { label: 'Logout', action: logout, danger: true },
                    ].map(({ label, action, danger }) => (
                      <button
                        key={label}
                        onClick={action}
                        className={`w-full text-left px-4 py-2.5 transition-colors duration-100
                          ${
                            danger
                              ? 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                              : 'hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart — always visible on all screens */}
            <Link
              to="/cart"
              aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
              className="relative w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center rounded-xl
                text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                active:scale-95 transition-all duration-150"
            >
              <img
                src={assets.cart_icon}
                className="w-4 h-4 lg:w-5 lg:h-5"
                alt=""
                aria-hidden="true"
              />
              {cartCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] lg:min-w-[18px] lg:h-[18px] px-1
                  flex items-center justify-center
                  bg-gray-900 dark:bg-white text-white dark:text-gray-900
                  text-[9px] lg:text-[10px] font-bold rounded-full leading-none pointer-events-none"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist — md+ only */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} item${wishlistCount !== 1 ? 's' : ''}`}
              className="relative hidden md:flex w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-xl
                text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                active:scale-95 transition-all duration-150"
            >
              <Icon name="WishlistIcon" className="w-4 h-4 lg:w-5 lg:h-5" />
              {wishlistCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] lg:min-w-[18px] lg:h-[18px] px-1
                  flex items-center justify-center
                  bg-red-500 text-white
                  text-[9px] lg:text-[10px] font-bold rounded-full leading-none pointer-events-none"
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile & tablet only (hidden md+) */}
            <IconBtn onClick={() => setVisible(true)} label="Open menu" className="md:hidden">
              <img src={assets.menu_icon} className="w-5 h-5" alt="" aria-hidden="true" />
            </IconBtn>
          </div>
        </div>
      </header>

      {/* ════ Mobile / Tablet Drawer ════ */}

      {/* Backdrop */}
      <div
        onClick={() => setVisible(false)}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* Drawer panel
          mobile  : w-72  (full feel, not too wide)
          sm/tab  : w-80  (a bit more space on tablets)
          max-w   : 85vw  (never overflow on tiny screens)
      */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 sm:w-80 max-w-[85vw] flex flex-col
          bg-white dark:bg-gray-900 shadow-2xl overflow-hidden
          transition-transform duration-300 ease-in-out md:hidden
          ${visible ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!visible}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0
          border-b border-gray-100 dark:border-gray-800"
        >
          <img src={assets.logo} className="h-8 w-auto object-contain dark:invert" alt="Logo" />
          <button
            onClick={() => setVisible(false)}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl
              hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon name="CloseIcon" className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Nav links — scrollable */}
        <nav
          className="flex flex-col flex-1 px-3 py-3 gap-0.5 overflow-y-auto
          text-sm tracking-widest text-gray-600 dark:text-gray-400"
        >
          {NAV_LINKS.map(({ to, label }, i) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setVisible(false)}
              style={{ transitionDelay: visible ? `${i * 45}ms` : '0ms' }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 sm:py-4 rounded-xl transition-all duration-200
                 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}
                 ${
                   isActive
                     ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold'
                     : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                 }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-5 flex-shrink-0 border-t border-gray-100 dark:border-gray-800" />

        {/* Utility actions */}
        <div
          className="px-3 py-3 flex flex-col gap-0.5 flex-shrink-0
          text-sm tracking-widest text-gray-600 dark:text-gray-400"
        >
          {/* Search */}
          <button
            onClick={() => {
              setVisible(false);
              setShowSearch(true);
            }}
            className="flex items-center gap-3 px-4 py-3.5 sm:py-4 rounded-xl
              hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
              transition-colors text-left"
          >
            <img
              src={assets.search_icon}
              className="w-5 h-5 opacity-50"
              alt=""
              aria-hidden="true"
            />
            SEARCH
          </button>

          {/* Profile / Login */}
          <button
            onClick={() => {
              setVisible(false);
              navigate(token ? '/profile' : '/login');
            }}
            className="flex items-center gap-3 px-4 py-3.5 sm:py-4 rounded-xl
              hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
              transition-colors text-left"
          >
            <img
              src={assets.profile_icon}
              className="w-5 h-5 opacity-50"
              alt=""
              aria-hidden="true"
            />
            {token ? 'MY PROFILE' : 'LOGIN'}
          </button>

          {/* Orders */}
          {token && (
            <button
              onClick={() => {
                setVisible(false);
                navigate('/orders');
              }}
              className="flex items-center gap-3 px-4 py-3.5 sm:py-4 rounded-xl
                hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
                transition-colors text-left"
            >
              <Icon name="OrdersIcon" className="w-5 h-5 opacity-50" />
              ORDERS
            </button>
          )}

          {/* Wishlist */}
          <button
            onClick={() => {
              setVisible(false);
              navigate('/wishlist');
            }}
            className="flex items-center gap-3 px-4 py-3.5 sm:py-4 rounded-xl
              hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
              transition-colors text-left relative"
          >
            <div className="relative w-5 h-5">
              <Icon name="WishlistIcon" className="w-5 h-5 opacity-50" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white
                  text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                  {wishlistCount > 99 ? '99' : wishlistCount}
                </span>
              )}
            </div>
            WISHLIST
          </button>

          {/* Dark mode */}
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-4 py-3.5 sm:py-4 rounded-xl
              hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
              transition-colors text-left"
          >
            {dark ? (
              <>
                <Icon name="SunIcon" className="w-5 h-5 opacity-50" /> LIGHT MODE
              </>
            ) : (
              <>
                <Icon name="MoonIcon" className="w-5 h-5 opacity-50" /> DARK MODE
              </>
            )}
          </button>
        </div>

        {/* Logout */}
        {token && (
          <div className="px-3 pb-safe-6 pb-6 pt-1 flex-shrink-0">
            <div className="border-t border-gray-100 dark:border-gray-800 mb-2" />
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3.5 sm:py-4 rounded-xl text-sm tracking-widest
                text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Icon name="LogoutIcon" className="w-5 h-5" />
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
