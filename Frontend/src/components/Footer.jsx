import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* Ripple helper */
function Ripple({ style }) {
  return <span className="ripple-dot" style={style} />;
}

function useRipple(ref) {
  const [ripples, setRipples] = React.useState([]);
  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((rr) => rr.id !== id)), 600);
  };
  return { ripples, handleClick };
}

/* Accordion section (mobile) */
function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  const { ripples, handleClick } = useRipple(ref);

  return (
    <div className="border-b border-gray-100 dark:border-gray-800">
      <button
        ref={ref}
        onClick={(e) => { handleClick(e); setOpen((o) => !o); }}
        className="relative overflow-hidden w-full flex items-center justify-between px-5 py-4 text-left active:bg-gray-50 dark:active:bg-white/5 transition-colors"
        aria-expanded={open}
      >
        {ripples.map((r) => <Ripple key={r.id} style={{ left: r.x, top: r.y }} />)}
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-900 dark:text-gray-100">
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '300px' : '0px' }}
      >
        <div className="px-5 pb-5 space-y-3.5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* Tappable link (Android ripple) */
function TapLink({ to, children, className = '' }) {
  const ref = React.useRef(null);
  const { ripples, handleClick } = useRipple(ref);
  return (
    <Link
      ref={ref}
      to={to}
      onClick={handleClick}
      className={`relative overflow-hidden inline-flex items-center gap-1.5 ${className}`}
    >
      {ripples.map((r) => <Ripple key={r.id} style={{ left: r.x, top: r.y }} />)}
      {children}
    </Link>
  );
}

/* Social icon button (mobile — circular) */
function SocialBtn({ href, label, path }) {
  const ref = React.useRef(null);
  const { ripples, handleClick } = useRipple(ref);
  return (
    <a
      ref={ref}
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="relative overflow-hidden w-9 h-9 rounded-full bg-gray-100 dark:bg-white/[0.07] flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-white/[0.14] active:bg-gray-300 dark:active:bg-white/20 transition-colors"
    >
      {ripples.map((r) => <Ripple key={r.id} style={{ left: r.x, top: r.y }} />)}
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

// MAIN FOOTER
const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const socials = [
    {
      href: 'https://www.instagram.com/___aditya027',
      label: 'Instagram',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    },
    {
      href: 'https://x.com/KumarAdity11996',
      label: 'X (Twitter)',
      path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    },
    {
      href: 'https://www.linkedin.com/in/aditya-kumar-94b65b315',
      label: 'LinkedIn',
      path: 'M20.447 20.452H16.89v-5.569c0-1.329-.025-3.039-1.851-3.039-1.851 0-2.135 1.445-2.135 2.939v5.669H9.347V9h3.414v1.561h.048c.476-.9 1.637-1.85 3.368-1.85 3.6 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433c-1.098 0-1.986-.89-1.986-1.986S4.239 3.46 5.337 3.46s1.986.89 1.986 1.987-.888 1.986-1.986 1.986zM7.119 20.452H3.555V9h3.564v11.452z',
    },
    {
      href: 'https://github.com/assistaditya027',
      label: 'GitHub',
      path: 'M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.79 10.77.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.53-.29-5.19-1.27-5.19-5.64 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.15 1.17a10.9 10.9 0 012.87-.39c.97 0 1.95.13 2.87.39 2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.38-2.66 5.35-5.2 5.63.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.21.65.79.54A11.26 11.26 0 0023.25 11.75C23.25 5.48 18.27.5 12 .5z',
    },
  ];

  const companyLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/terms', label: 'Terms' },
  ];

  const shopLinks = [
    { to: '/collection', label: 'Collection' },
    { to: '/brands', label: 'Brands' },
    { to: '/cart', label: 'Cart' },
    { to: '/profile', label: 'Account' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <>
      <style>{`
        .clovo-footer * { box-sizing: border-box; }

        /* Ripple — dark on light bg, light on dark bg */
        .ripple-dot {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(0,0,0,0.1);
          transform: translate(-50%, -50%) scale(0);
          animation: ripple-go 0.6s ease-out forwards;
          pointer-events: none;
        }
        .dark .ripple-dot { background: rgba(255,255,255,0.15); }
        @keyframes ripple-go {
          to { transform: translate(-50%,-50%) scale(30); opacity: 0; }
        }

        /* Material underline input */
        .android-input:focus {
          outline: none;
          border-bottom-color: #111827 !important;
        }
        .dark .android-input:focus { border-bottom-color: #e5e7eb !important; }
        .android-input:focus ~ .focus-bar { transform: scaleX(1); }
        .focus-bar {
          transform: scaleX(0);
          transition: transform 0.25s ease;
          transform-origin: left;
        }

        /* Pill hover */
        .nav-pill { transition: background 0.18s, color 0.18s, border-color 0.18s; }
        .nav-pill:active { background: rgba(0,0,0,0.05) !important; }
        .dark .nav-pill:active { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      <footer className="clovo-footer bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">

        {/* MOBILE LAYOUT  (< sm) */}
        <div className="sm:hidden">

          {/* Brand header */}
          <div className="px-5 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <Link
              to="/"
              className="inline-block text-2xl font-light tracking-[0.22em] uppercase text-gray-900 dark:text-gray-100 mb-3"
            >
              Clovo
            </Link>
            <p className="text-[13px] leading-[1.7] text-gray-400 dark:text-gray-500 mt-1 max-w-[280px]">
              Modern fashion, crafted for confidence. Premium quality, everyday comfort.
            </p>
            <div className="flex items-center gap-2.5 mt-5">
              {socials.map((s) => <SocialBtn key={s.label} {...s} />)}
            </div>
          </div>

          {/* Newsletter – Material underline input */}
          <div className="px-5 py-6 border-b border-gray-100 dark:border-gray-800">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-1">
              Newsletter
            </p>
            <p className="text-[14px] text-gray-700 dark:text-gray-300 mb-4 font-light">
              Exclusive drops, straight to you.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-500 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="android-input w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 pb-2 pr-10 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 transition-colors"
                  />
                  <div className="focus-bar absolute bottom-0 left-0 right-0 h-px bg-gray-900 dark:bg-gray-100" />
                  <button
                    type="submit"
                    className="absolute right-0 bottom-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    aria-label="Subscribe"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Accordion nav */}
          <AccordionSection title="Company">
            {companyLinks.map(({ to, label }) => (
              <div key={to}>
                <TapLink to={to} className="text-[14px] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 py-0.5">
                  {label}
                </TapLink>
              </div>
            ))}
          </AccordionSection>

          <AccordionSection title="Shop">
            {shopLinks.map(({ to, label }) => (
              <div key={to}>
                <TapLink to={to} className="text-[14px] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 py-0.5">
                  {label}
                </TapLink>
              </div>
            ))}
          </AccordionSection>

          <AccordionSection title="Get In Touch">
            <a href="tel:+92124567089" className="flex items-center gap-3 text-[14px] text-gray-400 dark:text-gray-500">
              <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/[0.07] flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 stroke-gray-500 dark:stroke-gray-400" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              +9-212-456-7089
            </a>
            <a href="mailto:info@clovo.com" className="flex items-center gap-3 text-[14px] text-gray-400 dark:text-gray-500">
              <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/[0.07] flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 stroke-gray-500 dark:stroke-gray-400" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              info@clovo.com
            </a>
          </AccordionSection>

          {/* Bottom bar – mobile */}
          <div className="px-5 py-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {[{ to: '/privacy', label: 'Privacy' }, { to: '/terms', label: 'Terms' }].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="nav-pill px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {label}
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-gray-300 dark:text-gray-600 tracking-wide text-center">
              © {year} Clovo — All Rights Reserved
            </p>
          </div>
        </div>

        {/* DESKTOP LAYOUT  (≥ sm) */}
        <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Newsletter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 border-b border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-1">
                Stay in the Loop
              </p>
              <p className="text-base sm:text-lg font-light text-gray-800 dark:text-gray-200">
                New arrivals &amp; exclusive offers — straight to your inbox.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-500 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto sm:min-w-[320px]">
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 border-r-0 px-3 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium tracking-widest uppercase px-4 py-2.5 border border-gray-900 dark:border-white hover:bg-white hover:text-gray-900 dark:hover:bg-gray-200 dark:hover:border-gray-200 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-10">
            <div className="lg:col-span-1 border-b border-gray-100 dark:border-gray-800 pb-8 lg:border-none lg:pb-0">
              <Link
                to="/"
                className="inline-block text-2xl font-light tracking-[0.2em] uppercase text-gray-900 dark:text-gray-100 mb-4"
              >
                Clovo
              </Link>
              <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-500 mb-5 max-w-sm lg:max-w-none">
                At Clovo, we believe fashion should be simple, modern, and accessible. Our collections
                are crafted to help you express your style with confidence while enjoying premium
                quality and everyday comfort.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {socials.map(({ href, label, path }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:border-gray-900 dark:hover:border-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-3 gap-4">
              {/* Company */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-900 dark:text-gray-100 mb-4">
                  Company
                </p>
                <ul className="space-y-2.5">
                  {companyLinks.map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Shop */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-900 dark:text-gray-100 mb-4">
                  Shop
                </p>
                <ul className="space-y-2.5">
                  {shopLinks.map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Contact */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-900 dark:text-gray-100 mb-4">
                  Get In Touch
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-7 h-7 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 stroke-gray-600 dark:stroke-gray-400" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <a href="tel:+919876543210" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      +91 98765 43210
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-7 h-7 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 stroke-gray-600 dark:stroke-gray-400" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <a href="mailto:info@clovo.com" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors break-all">
                      info@clovo.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-100 dark:border-gray-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-300 dark:text-gray-600 tracking-wide">
              Copyright {year} © clovo.com — All Rights Reserved.
            </p>
            <ul className="flex items-center gap-5">
              {[{ to: '/privacy', label: 'Privacy' }, { to: '/terms', label: 'Terms' }].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-xs text-gray-300 dark:text-gray-600 hover:text-gray-800 dark:hover:text-gray-300 transition-colors tracking-wide">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;