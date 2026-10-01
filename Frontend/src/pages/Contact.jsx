import { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import Title from '../components/Title';
import { ContactIcon1, ContactIcon2, ContactIcon3, ContactIcon4, ContactIcon5, ContactIcon6 } from '../assets/assets';

/* inview hook */
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

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
    {children}
  </span>
);

const Shimmer = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl ${className}`}
  />
);

// CONTACT FORM with validation + loading
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const validators = {
    name: (v) => (!v.trim() ? 'Name is required.' : ''),
    email: (v) =>
      !v
        ? 'Email is required.'
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? 'Enter a valid email.'
          : '',
    subject: (v) => (!v.trim() ? 'Subject is required.' : ''),
    message: (v) =>
      !v.trim()
        ? 'Message is required.'
        : v.trim().length < 20
          ? 'Message must be at least 20 characters.'
          : '',
  };

  const validate = (field, value) => validators[field]?.(value) ?? '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, validate(k, v)]));

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 2000));
    setStatus('success');
  };

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all
    ${
      errors[field]
        ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
        : 'border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/5'
    }`;

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <ContactIcon1 className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" />
        {errors[field]}
      </p>
    ) : null;

  if (status === 'success')
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-center">
          <ContactIcon2
            className="w-7 h-7 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
           />
        </div>

        <h4 className="text-base font-semibold text-gray-900 dark:text-white">Message sent!</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          {' '}
          Thanks for reaching out. We'll get back to you within 24 hours.{' '}
        </p>
        <button
          onClick={() => {
            setForm({ name: '', email: '', subject: '', message: '' });
            setStatus('idle');
          }}
          className="mt-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 transition-colors"
        >
          Send another message
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
            Full Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            className={inputClass('name')}
          />
          <ErrorMsg field="name" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="your@email.com"
            className={inputClass('email')}
          />
          <ErrorMsg field="email" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
          Subject
        </label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="How can we help?"
          className={inputClass('subject')}
        />
        <ErrorMsg field="subject" />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
          Message
          <span
            className={`ml-2 font-normal transition-colors ${form.message.length < 20 && form.message.length > 0 ? 'text-red-400' : 'text-gray-400'}`}
          >
            ({form.message.length}/20 min)
          </span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          placeholder="Tell us what's on your mind…"
          className={`${inputClass('message')} resize-none`}
        />
        <ErrorMsg field="message" />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100
          active:scale-[0.98] disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-xl
          transition-all duration-150 shadow-sm shadow-gray-900/20 mt-1"
      >
        {status === 'loading' ? (
          <>
            <ContactIcon3 className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" />
            Sending…
          </>
        ) : (
          <>
            <ContactIcon4 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
};

// MAIN CONTACT PAGE
const Contact = () => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [heroRef, heroVisible] = useInView(0.1);
  const [infoRef, infoVisible] = useInView(0.1);
  const [formRef, formVisible] = useInView(0.1);

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* HEADER */}
      <div className="text-center text-xl font-medium pt-14">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* HERO: image + store info */}
      <div
        ref={heroRef}
        className={`max-w-6xl mx-auto px-6 my-16 flex flex-col md:flex-row items-center gap-16
          transition-all duration-700 ease-out
          ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Image with skeleton */}
        <div className="w-full md:w-1/2 rounded-2xl overflow-hidden relative aspect-[4/3]">
          {!imgLoaded && <Shimmer className="absolute inset-0" />}
          <img
            src={assets.contact_img}
            alt="Our store"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover rounded-2xl shadow-sm transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {/* Store info */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <Badge>Get in Touch</Badge>

          {/* Store details */}
          <div
            ref={infoRef}
            className={`bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 space-y-4
              transition-all duration-500 delay-100
              ${infoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Our Store</h3>

            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                ),
                text: '123 Fashion Street, New York',
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                ),
                text: '(419) 555-1234',
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                ),
                text: 'info@clovo.com',
              },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ContactIcon5
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    icon={icon}
                   />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
              </div>
            ))}
          </div>

          {/* Careers */}
          <div
            className={`bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6
              transition-all duration-500 delay-200
              ${infoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Careers at Forever
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Learn more about our teams and job openings.
            </p>
            <button
              className="flex items-center gap-2 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100
              active:scale-[0.98] text-white text-xs font-medium px-4 py-2 rounded-lg transition-all duration-150 shadow-sm shadow-gray-900/20"
            >
              <ContactIcon6 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div
        ref={formRef}
        className={`max-w-3xl mx-auto px-6 pb-20
          transition-all duration-700 ease-out
          ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              Send us a message
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              We typically reply within 24 hours.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="max-w-6xl mx-auto px-6 pb-20 text-white">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Contact;
