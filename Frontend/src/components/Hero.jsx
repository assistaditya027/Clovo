import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    tag: 'NEW ARRIVALS',
    title: 'Elevate Your\nStyle',
    desc: 'Discover timeless fashion crafted for modern living.',
    cta: 'Shop Collection',
    mobileCta: 'SHOP NOW',
    badge: 'Up to 30% OFF',
    link: '/collection',
    img: assets.hero_image3,
    accent: '#FF3F6C',
  },
  {
    tag: 'LIMITED COLLECTION',
    title: 'Summer\nEssentials',
    desc: 'Lightweight pieces designed for effortless comfort.',
    cta: 'Explore Now',
    mobileCta: 'EXPLORE',
    badge: 'New Season',
    link: '/collection',
    img: assets.hero_img2,
    accent: '#FF3F6C',
  },
  {
    tag: 'SPECIAL OFFER',
    title: 'Up to 40%\nOff',
    desc: 'Premium quality fashion at exclusive prices.',
    cta: 'Shop Deals',
    mobileCta: 'SHOP DEALS',
    badge: 'Limited Time',
    link: '/collection',
    img: assets.hero_img1,
    accent: '#FF3F6C',
  },
];

const INTERVAL = 6000;
const SWIPE_DISTANCE_THRESHOLD = 45; // px
const SWIPE_VELOCITY_THRESHOLD = 0.5; // px/ms — catches fast short flicks

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [touchPaused, setTouchPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const paused = hoverPaused || touchPaused || focusPaused || tabHidden;

  // Refs used to drive animation via direct DOM writes instead of React
  // state — this is the difference between a "web demo" feel and a native
  // one: nothing re-renders the component tree 60x/second during a drag.
  const progRef = useRef(null);
  const startRef = useRef(Date.now());
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchStartTime = useRef(0);
  const isDraggingH = useRef(false);
  const isTransitioning = useRef(false);
  const dragRafId = useRef(null);
  const pendingDelta = useRef(0);
  const mobileSlideRefs = useRef([]);
  const mobileSegmentRefs = useRef([]);
  const desktopProgressRef = useRef(null);

  const resetDragTransform = useCallback((idx, animate = false) => {
    const el = mobileSlideRefs.current[idx];
    if (!el) return;
    if (animate) {
      el.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transform = 'translate3d(0,0,0)';
      window.setTimeout(() => {
        if (el) el.style.transition = '';
      }, 320);
    } else {
      el.style.transition = 'none';
      el.style.transform = 'translate3d(0,0,0)';
    }
  }, []);

  const goTo = useCallback((idx) => {
    setCurrent((prev) => {
      if (idx === prev) return prev;
      setAnimKey((k) => k + 1);
      startRef.current = Date.now();
      return idx;
    });
    resetDragTransform(idx, false);
  }, [resetDragTransform]);

  const goNext = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const goPrev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  // Pause autoplay while the browser tab is in the background — avoids a
  // jarring multi-slide jump when the user comes back.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(goNext, INTERVAL);
    return () => clearTimeout(t);
  }, [current, paused, goNext]);

  // Reset progress-bar widths the instant the active slide changes — before
  // paint, so there's no flash of the old value.
  useLayoutEffect(() => {
    SLIDES.forEach((_, i) => {
      const el = mobileSegmentRefs.current[i];
      if (el) {
        el.style.transition = 'none';
        el.style.width = i < current ? '100%' : '0%';
      }
    });
    if (desktopProgressRef.current) {
      desktopProgressRef.current.style.transition = 'none';
      desktopProgressRef.current.style.width = '0%';
    }
  }, [current]);

  // Drive the progress fill via rAF writing straight to the DOM — no
  // setState, so this never triggers a component re-render.
  useEffect(() => {
    if (paused) {
      cancelAnimationFrame(progRef.current);
      return;
    }
    startRef.current = Date.now();
    const mEl = mobileSegmentRefs.current[current];
    const dEl = desktopProgressRef.current;
    if (mEl) mEl.style.transition = 'width 0.1s linear';
    if (dEl) dEl.style.transition = 'width 0.1s linear';
    const tick = () => {
      const pct = Math.min(((Date.now() - startRef.current) / INTERVAL) * 100, 100);
      if (mEl) mEl.style.width = `${pct}%`;
      if (dEl) dEl.style.width = `${pct}%`;
      if (pct < 100) progRef.current = requestAnimationFrame(tick);
    };
    progRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progRef.current);
  }, [current, paused]);

  // Keyboard navigation — works whenever focus is anywhere inside the hero.
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
  };

  // ── Touch / swipe — fully imperative during the drag itself ──
  const onTouchStart = (e) => {
    if (isTransitioning.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isDraggingH.current = false;
    setTouchPaused(true);
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isDraggingH.current && Math.abs(dy) > Math.abs(dx)) return;
    isDraggingH.current = true;
    pendingDelta.current = dx;
    if (dragRafId.current === null) {
      dragRafId.current = requestAnimationFrame(() => {
        const el = mobileSlideRefs.current[current];
        if (el) {
          el.style.transition = 'none';
          el.style.willChange = 'transform';
          el.style.transform = `translate3d(${pendingDelta.current * 0.22}px,0,0)`;
        }
        dragRafId.current = null;
      });
    }
  };

  const onTouchEnd = (e) => {
    setTouchPaused(false);
    if (dragRafId.current !== null) {
      cancelAnimationFrame(dragRafId.current);
      dragRafId.current = null;
    }
    const wasDragging = isDraggingH.current;
    isDraggingH.current = false;

    if (!wasDragging || touchStartX.current === null) {
      touchStartX.current = null;
      return;
    }

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const elapsed = Date.now() - touchStartTime.current;
    const velocity = elapsed > 0 ? Math.abs(dx) / elapsed : 0;
    const el = mobileSlideRefs.current[current];

    if (Math.abs(dx) > SWIPE_DISTANCE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD) {
      // Let the slide finish leaving in the direction it was already
      // moving, instead of snapping back to center before the crossfade —
      // this is what makes a flick feel continuous rather than glitchy.
      isTransitioning.current = true;
      const exitX = dx < 0 ? '-100%' : '100%';
      if (el) {
        el.style.transition = 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.willChange = 'transform';
        el.style.transform = `translate3d(${exitX},0,0)`;
      }
      window.setTimeout(() => {
        if (dx < 0) goNext();
        else goPrev();
        isTransitioning.current = false;
      }, 200);
    } else if (el) {
      resetDragTransform(current, true);
    }

    touchStartX.current = null;
  };

  useEffect(() => () => {
    if (dragRafId.current !== null) cancelAnimationFrame(dragRafId.current);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="hero-root">
      <style>{`
        /* ── Ken Burns (desktop) ── */
        @keyframes kenBurns {
          from { transform: scale(1); }
          to   { transform: scale(1.04); }
        }
        .kb-active { animation: kenBurns 7s ease-out forwards; will-change: transform; }

        /* ── Desktop content fade-up ── */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hfu-1 { animation: heroFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .hfu-2 { animation: heroFadeUp 0.55s 0.08s cubic-bezier(0.22,1,0.36,1) both; }
        .hfu-3 { animation: heroFadeUp 0.55s 0.18s cubic-bezier(0.22,1,0.36,1) both; }
        .hfu-4 { animation: heroFadeUp 0.55s 0.28s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Mobile (Myntra) slide-up ── */
        @keyframes mSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ma-1 { animation: mSlideUp 0.34s 0.04s cubic-bezier(0.22,1,0.36,1) both; }
        .ma-2 { animation: mSlideUp 0.34s 0.12s cubic-bezier(0.22,1,0.36,1) both; }
        .ma-3 { animation: mSlideUp 0.34s 0.20s cubic-bezier(0.22,1,0.36,1) both; }
        .ma-4 { animation: mSlideUp 0.34s 0.28s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Badge pulse ── */
        @keyframes badgePulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }
        .badge-pulse { animation: badgePulse 2s ease-in-out infinite; }

        /* ── Mobile CTA ripple ── */
        .mcta { position: relative; overflow: hidden; }
        .mcta::after {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.18);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .mcta:active::after { transform: translateX(0); }

        /* ── No gray flash on tap — reads as an app, not a webpage ── */
        .hero-root button, .hero-root a { -webkit-tap-highlight-color: transparent; }

        /* ── Visible keyboard focus (mouse users never see this) ── */
        .hero-focusable:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* ── Respect OS-level reduced motion preference ── */
        @media (prefers-reduced-motion: reduce) {
          .kb-active, .hfu-1, .hfu-2, .hfu-3, .hfu-4,
          .ma-1, .ma-2, .ma-3, .ma-4, .badge-pulse {
            animation: none !important;
          }
        }
      `}</style>

      {/* 
          MOBILE LAYOUT  
      */}
      <div
        className="sm:hidden relative w-full overflow-hidden bg-gray-900 select-none"
        style={{ height: 'clamp(380px, 105vw, 560px)', touchAction: 'pan-y', overscrollBehaviorX: 'contain' }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured promotions"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onFocus={() => setFocusPaused(true)}
        onBlur={() => setFocusPaused(false)}
        onKeyDown={onKeyDown}
      >
        {/* Images */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            ref={(el) => { mobileSlideRefs.current[i] = el; }}
            className="absolute inset-0 w-full h-full"
            aria-hidden={i !== current}
            style={{
              opacity: i === current ? 1 : 0,
              transition: 'opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <img
              src={s.img}
              alt=""
              draggable={false}
              className="w-full h-full object-cover object-top"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              decoding="async"
            />
          </div>
        ))}

        {/* Bottom-heavy gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.04) 38%, rgba(0,0,0,0.75) 100%)' }}
        />

        {/* Top row: tag chip + badge */}
        <div
          key={`mtop-${animKey}`}
          className="absolute top-0 left-0 right-0 z-10 flex items-start justify-between px-4 pt-4 ma-1"
        >
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm"
            style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(6px)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: slide.accent }} />
            <span className="text-white text-[9px] font-semibold tracking-[0.22em] uppercase">{slide.tag}</span>
          </div>
          <div
            className="badge-pulse px-2.5 py-1 rounded-sm text-white text-[9px] font-bold tracking-wide"
            style={{ background: slide.accent }}
          >
            {slide.badge}
          </div>
        </div>

        {/* Bottom content */}
        <div
          key={`mbot-${animKey}`}
          className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-5"
        >
          {/* Segmented progress bar */}
          <div className="flex items-center gap-1 mb-3.5" aria-hidden="true">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[2px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.22)' }}
              >
                <div
                  ref={(el) => { mobileSegmentRefs.current[i] = el; }}
                  className="h-full rounded-full"
                  style={{ background: '#fff', width: '0%' }}
                />
              </div>
            ))}
          </div>

          {/* Title + CTA */}
          <div className="flex items-end justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2
                className="text-white font-bold leading-tight ma-2 truncate"
                style={{ fontSize: 'clamp(1.2rem, 5.5vw, 1.6rem)', letterSpacing: '-0.01em' }}
              >
                {slide.title.replace('\n', ' ')}
              </h2>
              <p className="text-white/60 ma-3 line-clamp-1 text-[11px] mt-0.5">
                {slide.desc}
              </p>
            </div>
            <Link
              to={slide.link}
              className="hero-focusable mcta ma-4 flex-shrink-0 flex items-center gap-1.5 text-white font-bold rounded-sm"
              style={{
                background: slide.accent,
                fontSize: '9px',
                letterSpacing: '0.14em',
                padding: '9px 16px',
              }}
            >
              {slide.mobileCta}
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Stretch dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1} of ${SLIDES.length}`}
                aria-current={i === current ? 'true' : undefined}
                className="hero-focusable p-2 -m-2 touch-manipulation"
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? '18px' : '6px',
                    height: '6px',
                    background: i === current ? '#fff' : 'rgba(255,255,255,0.38)',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 
          DESKTOP LAYOUT — (≥ sm)
      */}
      <div
        className="hidden sm:block relative w-full h-[80vh] overflow-hidden select-none bg-black"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured promotions"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocus={() => setFocusPaused(true)}
        onBlur={() => setFocusPaused(false)}
        onKeyDown={onKeyDown}
      >
        {/* Images with crossfade */}
        {SLIDES.map((s, i) => (
          <img
            key={i}
            src={s.img}
            alt=""
            aria-hidden={i !== current}
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover object-center ${i === current ? 'kb-active' : ''}`}
            style={{
              opacity: i === current ? 1 : 0,
              transform: i === current ? undefined : 'scale(1)',
              transition: 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            decoding="async"
          />
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Slide counter top-right */}
        <div className="absolute top-7 right-8 z-10 flex items-baseline gap-1.5 text-white" aria-hidden="true">
          <span className="text-sm font-semibold tabular-nums">{String(current + 1).padStart(2, '0')}</span>
          <span className="text-white/40 text-xs">/</span>
          <span className="text-white/40 text-xs tabular-nums">{String(SLIDES.length).padStart(2, '0')}</span>
        </div>

        {/* Screen-reader-only live announcement of slide changes */}
        <p className="sr-only" aria-live="polite">
          {`Slide ${current + 1} of ${SLIDES.length}: ${slide.tag}`}
        </p>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-14 lg:px-24">
          <div key={animKey} className="max-w-xl text-white">

            {/* Tag */}
            <div className="flex items-center gap-2.5 mb-4 hfu-1">
              <span className="w-5 h-px bg-white/60" />
              <p className="text-[11px] tracking-[0.4em] uppercase text-white/70 font-medium">{slide.tag}</p>
            </div>

            {/* Title */}
            <h1
              className="text-5xl lg:text-[3.75rem] font-semibold leading-[1.08] whitespace-pre-line hfu-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: '-0.02em' }}
            >
              {slide.title}
            </h1>

            {/* Desc */}
            <p className="text-[15px] text-white/70 mt-4 mb-8 leading-relaxed max-w-sm hfu-3">
              {slide.desc}
            </p>

            {/* CTA row */}
            <div className="flex items-center gap-5 hfu-4">
              <Link
                to={slide.link}
                className="hero-focusable group inline-flex items-center gap-2.5 bg-white text-black text-[11px]
                  font-semibold tracking-[0.15em] uppercase px-7 py-3.5
                  hover:bg-black hover:text-white border border-transparent hover:border-white/30
                  transition-all duration-300"
              >
                {slide.cta}
                <svg
                  className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/collection"
                className="hero-focusable text-[11px] text-white/55 tracking-[0.15em] uppercase
                  underline underline-offset-4 hover:text-white transition-colors duration-200"
              >
                View All
              </Link>
            </div>
          </div>
        </div>

        {/* Prev arrow */}
        <button
          type="button"
          onClick={goPrev}
          className="hero-focusable absolute left-5 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 border border-white/25 bg-white/10 backdrop-blur-sm
            flex items-center justify-center text-white
            hover:bg-white hover:text-black transition-all duration-200"
          aria-label="Previous slide"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          type="button"
          onClick={goNext}
          className="hero-focusable absolute right-5 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 border border-white/25 bg-white/10 backdrop-blur-sm
            flex items-center justify-center text-white
            hover:bg-white hover:text-black transition-all duration-200"
          aria-label="Next slide"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-14 lg:px-24 pb-8">
          <div className="flex items-center gap-4">
            {/* Dots */}
            <div className="flex items-center gap-1">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1} of ${SLIDES.length}`}
                  aria-current={i === current ? 'true' : undefined}
                  className="hero-focusable p-2 -m-2"
                >
                  <span
                    className={`block h-[2px] rounded-full transition-all duration-500
                      ${i === current ? 'w-8 bg-white' : 'w-3 bg-white/30 hover:bg-white/55'}`}
                  />
                </button>
              ))}
            </div>
            {/* Progress bar */}
            <div className="flex-1 max-w-[100px] h-px bg-white/15 overflow-hidden" aria-hidden="true">
              <div ref={desktopProgressRef} className="h-full bg-white/60" style={{ width: '0%' }} />
            </div>
            {paused && (
              <span className="text-[9px] text-white/40 tracking-[0.25em] uppercase">Paused</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;