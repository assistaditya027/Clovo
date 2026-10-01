import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PrivacyIcon1, PrivacyIcon2, PrivacyIcon3, PrivacyIcon4, PrivacyIcon5, PrivacyIcon6, PrivacyIcon7, PrivacyIcon8, PrivacyIcon9, PrivacyIcon10, PrivacyIcon11, PrivacyIcon12, PrivacyIcon13, PrivacyIcon14, PrivacyIcon15, PrivacyIcon16, PrivacyIcon17, PrivacyIcon18, PrivacyIcon19 } from '../assets/assets';

// Data
const SECTIONS = [
  {
    id: 'collect',
    number: '01',
    title: 'Information We Collect',
    icon: (
      <PrivacyIcon1 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ),
    bullets: [
      'Account details such as name, email, and password.',
      'Order details like items, address, and payment status.',
      'Device and usage information for analytics and security.',
    ],
  },
  {
    id: 'use',
    number: '02',
    title: 'How We Use Your Information',
    icon: (
      <PrivacyIcon2 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ),
    bullets: [
      'To process orders and deliver products.',
      'To provide customer support and account access.',
      'To improve our website and shopping experience.',
    ],
  },
  {
    id: 'sharing',
    number: '03',
    title: 'Sharing of Information',
    icon: (
      <PrivacyIcon3 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ),
    body: 'We may share information with payment gateways and shipping partners strictly for order fulfillment. We do not sell personal data.',
  },
  {
    id: 'cookies',
    number: '04',
    title: 'Cookies',
    icon: (
      <PrivacyIcon4 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ),
    body: 'We use cookies to remember your preferences and improve site performance. You can control cookies in your browser settings.',
  },
  {
    id: 'security',
    number: '05',
    title: 'Data Security',
    icon: (
      <PrivacyIcon5 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ),
    body: 'We implement standard security practices to protect your data. However, no method of transmission is 100% secure.',
  },
  {
    id: 'retention',
    number: '06',
    title: 'Data Retention',
    icon: (
      <PrivacyIcon6 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ),
    body: 'We keep account and order data as long as needed to provide services, comply with legal obligations, or resolve disputes.',
  },
  {
    id: 'choices',
    number: '07',
    title: 'Your Choices',
    icon: (
      <PrivacyIcon7 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ),
    body: 'You can update your profile information or request account deletion by contacting support.',
  },
  {
    id: 'updates',
    number: '08',
    title: 'Updates to This Policy',
    icon: (
      <PrivacyIcon8 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ),
    body: 'We may revise this policy from time to time. Changes will be posted on this page.',
  },
  {
    id: 'contact',
    number: '09',
    title: 'Contact',
    icon: (
      <PrivacyIcon9 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
    ),
    email: 'info@clovo.com',
  },
];

// Sub-components

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-gray-100 dark:bg-gray-800 print:hidden">
    <div
      className="h-full bg-gray-900 dark:bg-white transition-all duration-75 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const CopyLinkBtn = ({ id }) => {
  const [copied, setCopied] = useState(false);
  const copy = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={copy}
      title="Copy link to section"
      className="opacity-0 group-hover:opacity-100 ml-2
        text-gray-300 dark:text-gray-600
        hover:text-gray-600 dark:hover:text-gray-300
        transition-all duration-150 flex-shrink-0"
    >
      {copied ? (
        <PrivacyIcon10
          className="w-3.5 h-3.5 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
         />
      ) : (
        <PrivacyIcon11 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
      )}
    </button>
  );
};

const Section = ({ section, isOpen, onToggle, isActive }) => {
  const { id, number, title, icon, body, bullets, email } = section;

  return (
    <section id={id} className="scroll-mt-6 group">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 text-left py-5
          focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-900
          dark:focus-visible:ring-white"
      >
        <span
          className={`text-[10px] font-bold tracking-[0.2em] uppercase
          flex-shrink-0 w-6 text-right transition-colors duration-200
          ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}
        >
          {number}
        </span>

        <span
          className={`w-8 h-8 rounded flex items-center justify-center
          flex-shrink-0 transition-all duration-200
          ${
            isActive
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
          }`}
        >
          {icon}
        </span>

        <h2
          className={`flex-1 text-sm sm:text-[15px] font-semibold tracking-[-0.01em]
          transition-colors duration-200
          ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
        >
          {title}
        </h2>

        <CopyLinkBtn id={id} />

        <PrivacyIcon12
          className={`w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500
            transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
         />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div
          className="ml-[68px] pb-6 pr-4 text-sm sm:text-[14px]
          text-gray-500 dark:text-gray-400 leading-relaxed"
        >
          {bullets && (
            <ul className="space-y-2.5">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-[9px] w-1 h-1 rounded-full bg-gray-300
                    dark:bg-gray-600 flex-shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {body && <p>{body}</p>}

          {email && (
            <p>
              For privacy questions, contact us at{' '}
              <a
                href={`mailto:${email}`}
                className="font-medium text-gray-800 dark:text-gray-200
                  underline underline-offset-2
                  hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {email}
              </a>
              .
            </p>
          )}
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-gray-800" />
    </section>
  );
};

// Main page
const Privacy = () => {
  const updatedAt = 'March 23, 2026';

  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [progress, setProgress] = useState(0);
  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(SECTIONS.map((s) => [s.id, true])),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min((el.scrollTop / total) * 100, 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-30% 0px -60% 0px' },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const toggleSection = useCallback((id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const allOpen = Object.values(openSections).every(Boolean);
  const toggleAll = () => {
    const next = !allOpen;
    setOpenSections(Object.fromEntries(SECTIONS.map((s) => [s.id, next])));
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? SECTIONS.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.body && s.body.toLowerCase().includes(q)) ||
          (s.bullets && s.bullets.some((b) => b.toLowerCase().includes(q))),
      )
    : SECTIONS;

  return (
    <>
      <ProgressBar progress={progress} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-14 pb-24 px-4 sm:px-6 lg:px-10 print:pt-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Wide header strip */}
          <div
            className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-10
            flex flex-col sm:flex-row sm:items-end justify-between gap-5"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold
                  tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500"
                >
                  <span className="w-4 h-px bg-gray-300 dark:bg-gray-700 inline-block" />
                  Legal
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]
                text-gray-900 dark:text-white mb-2"
              >
                Privacy Policy
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 tracking-wide">
                Last updated: {updatedAt}
              </p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={copyPageLink}
                className="flex items-center gap-2 text-xs font-medium
                  text-gray-500 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-white
                  border border-gray-200 dark:border-gray-700
                  hover:border-gray-400 dark:hover:border-gray-500
                  px-4 py-2.5 rounded transition-all duration-150"
              >
                {copied ? (
                  <PrivacyIcon13
                    className="w-3.5 h-3.5 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                   />
                ) : (
                  <PrivacyIcon14
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                   />
                )}
                {copied ? 'Copied' : 'Copy link'}
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 text-xs font-medium
                  text-gray-500 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-white
                  border border-gray-200 dark:border-gray-700
                  hover:border-gray-400 dark:hover:border-gray-500
                  px-4 py-2.5 rounded transition-all duration-150"
              >
                <PrivacyIcon15 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                Print
              </button>
            </div>
          </div>

          {/* Two-column layout */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]
            gap-8 xl:gap-14 items-start"
          >
            {/* Sticky TOC sidebar */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-20 print:hidden">
              <div className="relative">
                <PrivacyIcon16
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                  text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                 />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sections..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs rounded
                    bg-white dark:bg-gray-900
                    border border-gray-200 dark:border-gray-800
                    text-gray-700 dark:text-gray-300
                    placeholder:text-gray-400 dark:placeholder:text-gray-600
                    outline-none focus:ring-2 focus:ring-gray-900
                    dark:focus:ring-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                      text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <PrivacyIcon17 className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase font-bold
                  text-gray-400 dark:text-gray-500"
                >
                  Contents
                </p>
                <button
                  onClick={toggleAll}
                  className="text-[10px] font-medium text-gray-400 dark:text-gray-500
                    hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {allOpen ? 'Collapse all' : 'Expand all'}
                </button>
              </div>

              <nav className="flex flex-col">
                {SECTIONS.map(({ id, number, title }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`flex items-center gap-2.5 text-xs py-2 px-3
                      rounded transition-all duration-150 border-l-2
                      ${
                        activeId === id
                          ? 'border-gray-900 dark:border-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold shadow-sm'
                          : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-900'
                      }`}
                  >
                    <span
                      className={`text-[9px] font-bold tracking-widest flex-shrink-0 tabular-nums
                      ${activeId === id ? 'opacity-50' : 'opacity-30'}`}
                    >
                      {number}
                    </span>
                    <span className="truncate leading-snug">{title}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-gray-900 dark:bg-white transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-600 tabular-nums w-8 text-right">
                  {Math.round(progress)}%
                </span>
              </div>
            </aside>

            {/* Main content card */}
            <div
              ref={contentRef}
              className="bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                rounded shadow-sm overflow-hidden"
            >
              {/* Mobile search */}
              <div className="lg:hidden px-5 pt-5">
                <div className="relative">
                  <PrivacyIcon18
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                    text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                   />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sections..."
                    className="w-full pl-9 pr-8 py-2.5 text-xs rounded
                      bg-gray-50 dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700
                      text-gray-700 dark:text-gray-300
                      placeholder:text-gray-400 outline-none
                      focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      <PrivacyIcon19
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                       />
                    </button>
                  )}
                </div>
              </div>

              {q && (
                <div className="px-6 pt-5 pb-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {filtered.length} section{filtered.length !== 1 ? 's' : ''} matching{' '}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      "{searchQuery}"
                    </span>
                  </p>
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    No sections match your search.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs underline underline-offset-2
                      text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="px-5 sm:px-8">
                  {filtered.map((section) => (
                    <Section
                      key={section.id}
                      section={section}
                      isOpen={openSections[section.id] ?? true}
                      onToggle={() => toggleSection(section.id)}
                      isActive={activeId === section.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
