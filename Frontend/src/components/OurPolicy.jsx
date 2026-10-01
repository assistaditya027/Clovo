import { useRef, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import Icon from './Icon';

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

const POLICIES = [
  {
    img: assets.exchange_icon,
    title: 'Easy Exchange',
    desc: 'Hassle-free exchanges on all orders.',
    badge: 'Free',
    detail:
      "Initiate an exchange within 30 days of delivery. We'll pick up the item and deliver a replacement at no extra cost.",
  },
  {
    img: assets.quality_icon,
    title: '7-Day Returns',
    desc: 'Changed your mind? Return within 7 days.',
    badge: 'No Fees',
    detail:
      'Items must be unused and in original packaging. Refunds are processed within 3-5 business days after inspection.',
  },
  {
    img: assets.support_img,
    title: '24/7 Support',
    desc: 'Our team is always ready to help.',
    badge: 'Always On',
    detail:
      'Contact us anytime via live chat, email, or phone. Our average response time is under 2 minutes.',
  },
];

const OurPolicy = () => {
  const [sectionRef, visible] = useInView(0.1);
  const [expanded, setExpanded] = useState(null);

  return (
    <div
      ref={sectionRef}
      className="py-14 sm:py-20 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300"
    >
      {/* Mobile-only: compact accordion list */}
      <div className="sm:hidden max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-3">
          {POLICIES.map(({ img, title, desc, badge, detail }, i) => (
            <button
              key={title}
              type="button"
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`text-left border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 p-4 transition-all duration-500
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition
                  ${expanded === i ? 'bg-black dark:bg-white' : 'bg-gray-50 dark:bg-gray-800'}`}
                >
                  <img
                    src={img}
                    alt={title}
                    className={`w-5 transition ${expanded === i ? 'brightness-0 invert dark:invert-0' : ''}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {title}
                    </h3>
                    <span className="text-[10px] tracking-widest uppercase bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{desc}</p>
                </div>
                <Icon
                  name="ChevronDownIcon"
                  className={`w-4 h-4 text-gray-400 transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                />
              </div>
              <div
                className={`transition-all overflow-hidden duration-300
                ${expanded === i ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
                  {detail}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop/Tablet: existing cards */}
      <div className="hidden sm:grid max-w-6xl mx-auto px-4 sm:px-6 grid-cols-3 gap-6 sm:gap-8">
        {POLICIES.map(({ img, title, desc, badge, detail }, i) => (
          <div
            key={title}
            style={{ transitionDelay: `${i * 120}ms` }}
            className={`cursor-pointer transition-all duration-500
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div
              className={`border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center transition-all duration-300
              hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600
              ${expanded === i ? 'border-gray-900 dark:border-gray-200 shadow-lg' : ''}`}
            >
              {/* Badge */}
              <span className="text-[10px] tracking-widest uppercase bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 mb-5 inline-block">
                {badge}
              </span>

              {/* Icon */}
              <div
                className={`w-16 h-16 mx-auto flex items-center justify-center mb-6 transition
                ${expanded === i ? 'bg-black dark:bg-white' : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <img
                  src={img}
                  alt={title}
                  className={`w-8 transition
                  ${expanded === i ? 'brightness-0 invert dark:invert-0' : ''}`}
                />
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>

              {/* Expand Button */}
              <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mt-4 flex items-center gap-1 mx-auto">
                {expanded === i ? 'Show less' : 'Learn more'}
                <Icon
                  name="ChevronDownIcon"
                  className={`w-3 h-3 transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Expanded Content */}
              <div
                className={`transition-all overflow-hidden duration-300
                ${expanded === i ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-4">
                  {detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Strip */}
      <div
        className={`mt-12 sm:mt-16 border-t border-b border-gray-200 dark:border-gray-800 py-6 transition-all duration-700
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-4 sm:gap-10 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {[
            {
              icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04',
              text: 'Secure Payments',
            },
            {
              icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
              text: 'Razorpay & Stripe',
            },
            {
              icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
              text: 'Free Shipping \u20B9499+',
            },
            {
              icon: 'M9 17a2 2 0 104 0m5-10h-3l-2-3H6a2 2 0 00-2 2v7h2m10 0h2v-3l-2-3z',
              text: 'Fast Delivery',
            },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
              </svg>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;



