import { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import { AboutIcon1, AboutIcon2, AboutIcon3, AboutIcon4 } from '../assets/assets';

/* tiny hook: fires once when element enters viewport */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* skeleton shimmer block */
const Shimmer = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl ${className}`}
  />
);

/* pill badge */
const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
    {children}
  </span>
);

const pillars = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    title: 'Quality Assurance',
    desc: 'Every product is carefully reviewed and selected to meet our high standards of quality and reliability.',
    stat: '99.8%',
    statLabel: 'Satisfaction rate',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    title: 'Convenience',
    desc: 'Our seamless ordering experience ensures shopping is simple, smooth, and stress-free.',
    stat: '2 min',
    statLabel: 'Avg. checkout time',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
      />
    ),
    title: 'Exceptional Service',
    desc: 'Our support team is always available to assist you, ensuring complete satisfaction at every step.',
    stat: '24/7',
    statLabel: 'Live support',
  },
];

// NEWSLETTER with validation + loading
const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const validate = (val) => {
    if (!val) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.';
    return '';
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(validate(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(email);
    if (err) {
      setError(err);
      return;
    }
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1800)); // simulate API
    setStatus('success');
  };

  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      className={`bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl px-8 py-12 text-center
        transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <Badge>Newsletter</Badge>
      <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white tracking-tight">
        Stay in the loop
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        Get the latest drops, exclusive offers, and style tips delivered straight to your inbox.
      </p>

      {status === 'success' ? (
        <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm animate-bounce-once">
          <AboutIcon1 className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          You're subscribed! Talk soon.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={handleChange}
              onBlur={() => setError(validate(email))}
              placeholder="your@email.com"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all
                ${
                  error
                    ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                    : 'border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/5'
                }`}
            />
            {error && (
              <p className="mt-1.5 text-left text-xs text-red-500 flex items-center gap-1">
                <AboutIcon2 className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-150 shadow-sm shadow-gray-900/20 whitespace-nowrap"
          >
            {status === 'loading' ? (
              <>
                <AboutIcon3 className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" />
                Subscribing…
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

// MAIN ABOUT PAGE
const About = () => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [heroRef, heroVisible] = useInView(0.1);
  const [pillarsRef, pillarsVisible] = useInView(0.1);

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* HEADER */}
      <div className="text-2xl text-center pt-12">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* STORY SECTION */}
      <div
        ref={heroRef}
        className={`max-w-6xl mx-auto px-6 my-16 flex flex-col md:flex-row gap-16 items-center
          transition-all duration-700 ease-out
          ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Image with skeleton */}
        <div className="w-full md:w-1/2 rounded-2xl overflow-hidden relative aspect-[4/3]">
          {!imgLoaded && <Shimmer className="absolute inset-0 rounded-2xl" />}
          <img
            src={assets.about_img}
            alt="About Forever"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover rounded-2xl shadow-sm transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center gap-5 md:w-1/2">
          <Badge>Our Story</Badge>

          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Clovo was founded from a deep passion for innovation and a vision to transform the
            online shopping experience. Our journey started with a simple goal: to create a platform
            where customers can effortlessly discover, browse, and purchase a wide variety of
            products from the comfort of their homes.
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            From the very beginning, we have dedicated ourselves to building a diverse collection of
            premium-quality products that cater to different tastes and preferences. Whether it's
            fashion, beauty, or everyday essentials, we provide an extensive range sourced from
            reliable and trusted brands and suppliers.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Our Mission
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              At Clovo, our mission is to empower customers with choice, convenience, and confidence
              — from browsing and ordering to delivery and beyond.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              ['12K+', 'Customers'],
              ['4.9★', 'Rating'],
              ['50+', 'Brands'],
            ].map(([val, lbl]) => (
              <div
                key={lbl}
                className="text-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl py-3"
              >
                <p className="text-base font-bold text-gray-900 dark:text-white">{val}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="text-lg font-medium text-center mt-20 mb-10">
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div ref={pillarsRef} className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Our Commitment</h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We are dedicated to delivering quality, convenience, and exceptional service — creating
            a seamless and trustworthy shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon, title, desc, stat, statLabel }, i) => (
            <div
              key={title}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm
                hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center space-y-3
                ${pillarsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center mx-auto">
                <AboutIcon4
                  className="w-5 h-5 text-white dark:text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  icon={icon}
                 />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stat}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="max-w-6xl mx-auto px-6 pb-20  ">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;
