import { useState, useRef } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const PERKS = [
  'Early access to new drops',
  'Members-only sale previews',
  '20% off your first order',
];

const validate = (val) => {
  if (!val.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Enter a valid email.';
  return '';
};

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate(email);
    if (err) {
      setError(err);
      inputRef.current?.focus();
      return;
    }

    setStatus('loading');
    setError('');
    try {
      const { data } = await axios.post(`${backendUrl}/api/newsletter/subscribe`, {
        email: email.trim(),
      });
      if (data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setError(data.message || 'Something went wrong.');
        setStatus('idle');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
      setStatus('idle');
    }
  };

  // Success
  if (status === 'success') {
    return (
      <div className="w-full bg-gray-50 dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800 py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-11 h-11 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg
              className="w-4.5 h-4.5 text-gray-700 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 dark:text-gray-500 mb-2">
            Confirmed
          </p>
          <h3
            className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            You're in.
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs mx-auto">
            Your 20% off code is heading to your inbox right now.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-6 text-[11px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500
              hover:text-gray-800 dark:hover:text-gray-200 transition-colors border-b border-gray-300 dark:border-gray-700 hover:border-gray-700 dark:hover:border-gray-300 pb-px"
          >
            Subscribe another email
          </button>
        </div>
      </div>
    );
  }

  // Main
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">

      {/* Mobile-only: compact card */}
      <div className="sm:hidden px-4 py-10">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 dark:text-gray-500 mb-2">
            Newsletter
          </p>
          <h2
            className="text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-2"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}
          >
            Get 20% off
            <span className="block text-gray-400 dark:text-gray-500">your first order.</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Early access to new collections, previews, and exclusive deals.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {PERKS.map((text) => (
              <span
                key={text}
                className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400
                  border border-gray-200 dark:border-gray-800 px-2.5 py-1 rounded-full"
              >
                {text}
              </span>
            ))}
          </div>

          <form onSubmit={onSubmit} noValidate className="mt-5">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500 mb-2">
              Email Address
            </label>
            <div
              className={`flex border transition-colors duration-200 rounded-xl overflow-hidden
                ${error ? 'border-red-300' : focused ? 'border-gray-500 dark:border-gray-500' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <input
                ref={inputRef}
                type="email"
                value={email}
                disabled={status === 'loading'}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(validate(e.target.value));
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  if (email) setError(validate(email));
                }}
                placeholder="your@email.com"
                className="flex-1 bg-gray-50 dark:bg-gray-950 px-4 py-3 text-sm text-gray-800 dark:text-gray-100
                  placeholder-gray-300 dark:placeholder-gray-500 outline-none disabled:opacity-50"
              />
              {email && status !== 'loading' && (
                <button
                  type="button"
                  onClick={() => {
                    setEmail('');
                    setError('');
                    inputRef.current?.focus();
                  }}
                  className="px-3 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {error && (
              <p className="mt-2 text-[11px] text-red-400 flex items-center gap-1.5">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-[11px] font-semibold tracking-[0.2em]
                uppercase py-3.5 hover:bg-black dark:hover:bg-gray-100 active:scale-[0.99]
                disabled:opacity-60 transition-all duration-150
                flex items-center justify-center gap-2 mt-4 rounded-xl"
            >
              {status === 'loading' ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Subscribing
                </>
              ) : (
                <>
                  Get 20% Off
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-[10px] text-gray-300 dark:text-gray-500 text-center mt-3 tracking-wide">
              <span>{String.fromCodePoint(0x1f49a)}</span> No spam - Unsubscribe anytime - GDPR compliant
            </p>
          </form>
        </div>
      </div>

      <div className="hidden sm:block max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Copy */}
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 dark:text-gray-500 mb-4">
              Newsletter
            </p>

            <h2
              className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100 leading-[1.1] mb-4"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}
            >
              Get 20% off
              <br />
              <span className="text-gray-400 dark:text-gray-500">your first order.</span>
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-7 max-w-sm">
              Join thousands of members who get early access to new collections and exclusive deals.
            </p>

            {/* Perks */}
            <ul className="flex flex-col gap-2.5">
              {PERKS.map((text) => (
                <li
                  key={text}
                  className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-gray-400"
                >
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-8 pt-7 border-t border-gray-200 dark:border-gray-800">
              <div className="flex -space-x-1.5">
                {['bg-stone-200', 'bg-stone-300', 'bg-stone-400', 'bg-stone-500'].map((c, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 ${c} border-2 border-gray-50 dark:border-gray-900`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                <span className="text-gray-600 dark:text-gray-200 font-medium">12400+</span>{' '}
                subscribers
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-7 sm:p-9 shadow-sm">
            <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 dark:text-gray-500 mb-1">
              Limited Offer
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Subscribe & unlock your discount
            </p>

            <form onSubmit={onSubmit} noValidate>
              {/* Email */}
              <div className="mb-3">
                <label className="block text-[10px] tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500 mb-1.5">
                  Email Address
                </label>
                <div
                  className={`flex border transition-colors duration-200
                  ${error ? 'border-red-300' : focused ? 'border-gray-500 dark:border-gray-500' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    disabled={status === 'loading'}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(validate(e.target.value));
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      setFocused(false);
                      if (email) setError(validate(email));
                    }}
                    placeholder="your@email.com"
                    className="flex-1 bg-gray-50 dark:bg-gray-950 px-4 py-3 text-sm text-gray-800 dark:text-gray-100
                      placeholder-gray-300 dark:placeholder-gray-500 outline-none disabled:opacity-50"
                  />
                  {email && status !== 'loading' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('');
                        setError('');
                        inputRef.current?.focus();
                      }}
                      className="px-3 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {error && (
                  <p className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1.5">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-[11px] font-semibold tracking-[0.2em]
                  uppercase py-3.5 hover:bg-black dark:hover:bg-gray-100 active:scale-[0.99]
                  disabled:opacity-60 transition-all duration-150
                  flex items-center justify-center gap-2 mt-1"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Subscribing
                  </>
                ) : (
                  <>
                    Get 20% Off
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-300 dark:text-gray-500 text-center mt-3 tracking-wide">
                <span>{String.fromCodePoint(0x1f49a)}</span> No spam - Unsubscribe anytime - GDPR compliant
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBox;
