import { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';
import Icon from './Icon';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes('collection'));
  }, [location]);

  // Auto-focus when bar opens
  useEffect(() => {
    if (showSearch && visible) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showSearch, visible]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setShowSearch]);

  if (!showSearch || !visible) return null;

  return (
    <div className="border-t border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
        {/* Search input */}
        <div
          className={`flex flex-1 items-center gap-3 border bg-white dark:bg-gray-950 px-4 py-2.5 transition-colors duration-200
          ${focused ? 'border-gray-500 dark:border-gray-500' : 'border-gray-200 dark:border-gray-700'}`}
        >
          {/* Search icon */}
          <Icon name="SearchIcon" className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />

          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 outline-none bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500"
          />

          {/* Live result count */}
          {search.trim() && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 tracking-wide whitespace-nowrap hidden sm:block">
              Press Enter
            </span>
          )}

          {/* Clear button */}
          {search && (
            <button
              onClick={() => {
                setSearch('');
                inputRef.current?.focus();
              }}
              className="text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
              aria-label="Clear search"
            >
              <Icon name="CloseIcon" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={() => setShowSearch(false)}
          className="w-9 h-9 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:border-gray-500 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0"
          aria-label="Close search"
        >
          <Icon name="CloseIcon" className="w-4 h-4" />
        </button>
      </div>

      {/* Hint bar */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-1.5 max-w-6xl mx-auto flex items-center gap-4">
        <span className="text-[10px] text-gray-300 dark:text-gray-500 tracking-wide">
          {search.trim()
            ? `Showing results for "${search}"`
            : 'Start typing to search across all products'}
        </span>
        <span className="text-[10px] text-gray-300 dark:text-gray-500 ml-auto hidden sm:block">
          ESC to close
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
