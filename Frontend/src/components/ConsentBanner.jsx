import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const STORAGE_KEY = 'clovo_consent';

const CATEGORIES = [
  {
    id: 'necessary',
    label: 'Necessary',
    description: 'Essential for the website to function. Cannot be disabled.',
    locked: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description:
      'Helps us understand how visitors interact with our site by collecting anonymous data.',
    locked: false,
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Used to deliver personalized ads and track campaign performance across sites.',
    locked: false,
  },
  {
    id: 'personalization',
    label: 'Personalization',
    description: 'Allows us to remember your preferences and tailor your shopping experience.',
    locked: false,
  },
];

const DEFAULT_PREFS = {
  necessary: true,
  analytics: false,
  marketing: false,
  personalization: false,
};
const ALL_PREFS = { necessary: true, analytics: true, marketing: true, personalization: true };

const readStored = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};
const writeStored = (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
};

/* Toggle switch */
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent
      transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      ${checked ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'}`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-full shadow transform transition-transform duration-200
        ${checked ? 'translate-x-4' : 'translate-x-0'}
        ${checked ? 'bg-white dark:bg-gray-900' : 'bg-white dark:bg-gray-400'}`}
    />
  </button>
);

/* Preferences Modal */
const PreferencesModal = ({ onSave, onClose }) => {
  const [prefs, setPrefs] = useState(() => {
    const stored = readStored();
    return stored?.preferences ?? DEFAULT_PREFS;
  });

  const toggle = (id, val) => setPrefs((p) => ({ ...p, [id]: val }));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie Preferences"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900 dark:text-gray-100">
              Cookie Preferences
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Manage what data you allow us to collect.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <Icon name="CloseIcon" className="w-4 h-4" />
          </button>
        </div>

        {/* Categories */}
        <div className="overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-gray-800">
          {CATEGORIES.map(({ id, label, description, locked }) => (
            <div key={id} className="flex items-start justify-between gap-4 px-6 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {label}
                  </span>
                  {locked && (
                    <span className="text-[9px] font-bold tracking-widest uppercase border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 px-1.5 py-0.5">
                      Always On
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  {description}
                </p>
              </div>
              <div className="flex-shrink-0 mt-0.5">
                <Toggle checked={prefs[id]} onChange={(val) => toggle(id, val)} disabled={locked} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
          <button
            onClick={() => setPrefs(ALL_PREFS)}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors tracking-wide underline underline-offset-4"
          >
            Accept All
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold tracking-widest uppercase
                border border-gray-200 dark:border-gray-700
                text-gray-600 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-800
                transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(prefs)}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-semibold tracking-widest uppercase
                bg-gray-900 dark:bg-white
                text-white dark:text-gray-900
                hover:bg-black dark:hover:bg-gray-100
                transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* MAIN BANNER */
const ConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!readStored()) setVisible(true);
  }, []);

  const saveChoice = (preferences) => {
    writeStored({ decision: 'custom', preferences });
    setVisible(false);
    setShowModal(false);
  };

  const acceptAll = () => saveChoice(ALL_PREFS);
  const declineAll = () => saveChoice(DEFAULT_PREFS);

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4"
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent"
      >
        <div className="mx-auto max-w-5xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            {/* Text */}
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              We use cookies to improve your experience, analyze traffic, and personalize content.{' '}
              <Link
                to="/privacy"
                className="font-semibold text-gray-900 dark:text-white underline underline-offset-4"
              >
                Learn more
              </Link>
              .
            </p>

            {/* Actions */}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-shrink-0">
              <button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold uppercase tracking-widest
                  text-gray-500 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-gray-100
                  transition-colors underline underline-offset-4"
              >
                Manage
              </button>
              <button
                onClick={declineAll}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold uppercase tracking-widest
                  border border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-gray-200
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  transition-colors"
              >
                Decline
              </button>
              <button
                onClick={acceptAll}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold uppercase tracking-widest
                  bg-gray-900 dark:bg-white
                  text-white dark:text-gray-900
                  hover:bg-black dark:hover:bg-gray-100
                  transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences modal */}
      {showModal && <PreferencesModal onSave={saveChoice} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ConsentBanner;
