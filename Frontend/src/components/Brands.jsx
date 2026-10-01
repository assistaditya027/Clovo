import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Title from './Title';
import NewsletterBox from './NewsletterBox';

/* Detect dark mode (watches the .dark class on <html>) */
const useDarkMode = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark')),
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

/* Brand data */
const BRANDS = [
  { id: 1, name: 'Zara', category: 'Fast Fashion', link: '/collection' },
  { id: 2, name: 'H&M', category: 'Everyday Essentials', link: '/collection' },
  { id: 3, name: 'Mango', category: 'Contemporary Women', link: '/collection' },
  { id: 4, name: "Levi's", category: 'Denim & Casuals', link: '/collection' },
  { id: 5, name: 'Nike', category: 'Sportswear', link: '/collection' },
  { id: 6, name: 'Only', category: "Women's Fashion", link: '/collection' },
  { id: 7, name: 'Adidas', category: 'Sportswear', link: '/collection' },
  { id: 8, name: 'Puma', category: 'Active & Street', link: '/collection' },
  { id: 9, name: 'Uniqlo', category: 'Minimalist Basics', link: '/collection' },
  { id: 10, name: 'Gap', category: 'American Casual', link: '/collection' },
  { id: 11, name: 'Calvin Klein', category: 'Modern Luxury', link: '/collection' },
  { id: 12, name: 'Tommy Hilfiger', category: 'Preppy Classic', link: '/collection' },
];

const TRACK = [...BRANDS, ...BRANDS];

/* Single logo card */
const BrandLogo = ({ brand }) => (
  <Link
    to={brand.link}
    className="group flex-shrink-0 flex flex-col items-center justify-center gap-2
      w-28 sm:w-44 px-3 sm:px-4 py-4 sm:py-5 mx-2 sm:mx-3
      border border-gray-100 dark:border-gray-800
      bg-white dark:bg-gray-950
      hover:border-gray-300 dark:hover:border-gray-600
      hover:bg-gray-50 dark:hover:bg-gray-900
      transition-all duration-300"
  >
    <span
      className="text-xs sm:text-lg font-semibold tracking-tight leading-none whitespace-nowrap
        text-gray-800 dark:text-gray-200
        group-hover:text-gray-900 dark:group-hover:text-white
        transition-colors"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {brand.name}
    </span>
    <span
      className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase whitespace-nowrap
      text-gray-300 dark:text-gray-600
      group-hover:text-gray-500 dark:group-hover:text-gray-400
      transition-colors"
    >
      {brand.category}
    </span>
  </Link>
);

/* Marquee row */
const MarqueeRow = ({ items, direction, speed, paused, fadeColor }) => (
  <div
    className="relative overflow-hidden mb-4 last:mb-0"
    onMouseEnter={() => paused.set(true)}
    onMouseLeave={() => paused.set(false)}
  >
    {/* Left fade */}
    <div
      className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
      style={{ background: `linear-gradient(to right, ${fadeColor}, transparent)` }}
    />
    {/* Right fade */}
    <div
      className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
      style={{ background: `linear-gradient(to left, ${fadeColor}, transparent)` }}
    />

    <div
      className="flex"
      style={{
        animation: `marquee-${direction} ${speed}s linear infinite`,
        animationPlayState: paused.value ? 'paused' : 'running',
        width: 'max-content',
      }}
    >
      {items.map((brand, i) => (
        <BrandLogo key={`${direction}-${brand.id}-${i}`} brand={brand} />
      ))}
    </div>
  </div>
);

/* MAIN PAGE */
const Brands = () => {
  const [paused, setPaused] = useState(false);
  const dark = useDarkMode();

  // Fade color matches the marquee section background
  const fadeColor = dark ? '#030712' : '#ffffff'; // gray-950 in dark, white in light

  const pauseControl = { value: paused, set: setPaused };

  return (
    <div className="border-t border-gray-100 dark:border-gray-800">
      {/* Page header */}
      <div className="text-2xl text-center pt-12 mb-2">
        <Title text1={'OUR'} text2={'BRANDS'} />
      </div>
      <p className="text-center text-sm text-gray-400 dark:text-gray-500 max-w-md mx-auto px-6 pb-12">
        Carefully selected brand partners and exclusive collaborations — all in one place.
      </p>

      {/* Mobile-only: marquee animation */}
      <div
        className="sm:hidden border-y border-gray-100 dark:border-gray-800 py-6 overflow-hidden
        bg-white dark:bg-gray-950"
      >
        <p
          className="text-center text-[10px] tracking-[0.35em] uppercase
          text-gray-300 dark:text-gray-600 mb-5"
        >
          Trusted Brand Partners
        </p>

        <MarqueeRow
          items={TRACK}
          direction="ltr"
          speed={24}
          paused={pauseControl}
          fadeColor={fadeColor}
        />
        <MarqueeRow
          items={[...TRACK].reverse()}
          direction="rtl"
          speed={20}
          paused={pauseControl}
          fadeColor={fadeColor}
        />

        <p
          className="text-center text-[9px] tracking-[0.25em] uppercase
          text-gray-200 dark:text-gray-700 mt-5"
        >
          Tap a brand to explore
        </p>
      </div>

      {/* â”€â”€ Marquee section â”€â”€ */}
      <div
        className="hidden sm:block border-y border-gray-100 dark:border-gray-800 py-10 overflow-hidden
        bg-white dark:bg-gray-950"
      >
        <p
          className="text-center text-[10px] tracking-[0.35em] uppercase
          text-gray-300 dark:text-gray-600 mb-7"
        >
          Trusted Brand Partners
        </p>

        <MarqueeRow
          items={TRACK}
          direction="ltr"
          speed={28}
          paused={pauseControl}
          fadeColor={fadeColor}
        />
        <MarqueeRow
          items={[...TRACK].reverse()}
          direction="rtl"
          speed={22}
          paused={pauseControl}
          fadeColor={fadeColor}
        />

        <p
          className="text-center text-[9px] tracking-[0.25em] uppercase
          text-gray-200 dark:text-gray-700 mt-6"
        >
          Hover to pause - Click to explore
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes marquee-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-rtl {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Brands;
