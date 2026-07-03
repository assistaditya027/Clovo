import { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { CollectionIcon1, CollectionIcon2, CollectionIcon3, CollectionIcon4, CollectionIcon5, CollectionIcon6, CollectionIcon7, CollectionIcon8, CollectionIcon9, CollectionIcon10, CollectionIcon11, CollectionIcon12, CollectionIcon13, CollectionIcon14, CollectionIcon15, CollectionIcon16, CollectionIcon17, CollectionIcon18, CollectionIcon19 } from '../assets/assets';
import { buildCloudinarySrcSet, transformCloudinaryUrl } from '../utils/cloudinary';

const CATEGORIES = ['Men', 'Women', 'Kids'];
const SUB_CATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear'];
const RATINGS = [4, 3, 2];

// ── Collapsible filter section ──
const FilterSection = ({ title, defaultOpen = true, children, activeCount = 0 }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-widest uppercase">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="text-[10px] bg-black text-white dark:bg-white dark:text-gray-900 px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <CollectionIcon1
          className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
         />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <div className="px-4 sm:px-5">{children}</div>
      </div>
    </div>
  );
};

// ── Custom checkbox ──
const CheckItem = ({ label, checked, onChange, count }) => (
  <label className="flex items-center justify-between cursor-pointer group py-0.5">
    <div className="flex items-center gap-2.5">
      <div
        onClick={onChange}
        className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-all duration-150
          ${checked ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-500 dark:group-hover:border-gray-400'}`}
      >
        {checked && (
          <CollectionIcon2 className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
        )}
      </div>
      <span className={`text-sm transition-colors ${checked ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}`}>
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>
    )}
  </label>
);

// ── Star rating row ──
const StarRow = ({ rating, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer group py-0.5">
    <div className="flex items-center gap-2.5">
      <div
        onClick={onChange}
        className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-all duration-150
          ${checked ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-500 dark:group-hover:border-gray-400'}`}
      >
        {checked && (
          <CollectionIcon3 className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
        )}
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <CollectionIcon4 key={i} className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20" />
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">& up</span>
    </div>
  </label>
);

// ── View toggle ──
const ViewToggle = ({ view, setView }) => (
  <div className="flex border border-gray-200 dark:border-gray-800 overflow-hidden">
    {[
      { key: 'grid4', icon: (<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>) },
      { key: 'grid3', icon: (<><rect x="3" y="3" width="5" height="5" /><rect x="9.5" y="3" width="5" height="5" /><rect x="16" y="3" width="5" height="5" /><rect x="3" y="9.5" width="5" height="5" /><rect x="9.5" y="9.5" width="5" height="5" /><rect x="16" y="9.5" width="5" height="5" /></>) },
      { key: 'list', icon: (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>) },
    ].map(({ key, icon }) => (
      <button
        key={key}
        onClick={() => setView(key)}
        className={`p-2 transition-colors ${view === key ? 'bg-black text-white dark:bg-white dark:text-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400'}`}
      >
        <CollectionIcon5 className="w-4 h-4" fill={key === 'list' ? 'none' : 'currentColor'} stroke="currentColor" strokeWidth={key === 'list' ? 2 : 0} viewBox="0 0 24 24" icon={icon} />
      </button>
    ))}
  </div>
);

// ══════════════════════════════════════════
//  MOBILE BOTTOM SHEET FILTER (Android-style)
// ══════════════════════════════════════════
const MobileFilterSheet = ({
  open, onClose,
  currency,
  category, setCategory,
  subCategory, setSubCategory,
  priceRange, setPriceRange, maxPrice,
  minRating, setMinRating,
  inStockOnly, setInStockOnly,
  clearFilters, activeFilterCount,
  toggle,
}) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 sm:hidden
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 rounded-t-2xl shadow-2xl sm:hidden
          transition-transform duration-300 ease-out
          ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-white dark:bg-gray-950 z-10">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 sticky top-6 bg-white dark:bg-gray-950 z-10">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900 dark:text-white">Filters</span>
            {activeFilterCount > 0 && (
              <span className="text-[11px] bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-full font-medium">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Clear all
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-6 pb-32">

          {/* In Stock */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">In Stock Only</span>
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${inStockOnly ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${inStockOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Category chips */}
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggle(setCategory, cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all active:scale-95
                    ${category.includes(cat)
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Type chips */}
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Type</p>
            <div className="flex flex-wrap gap-2">
              {SUB_CATEGORIES.map((sub) => (
                <button
                  key={sub}
                  onClick={() => toggle(setSubCategory, sub)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all active:scale-95
                    ${subCategory.includes(sub)
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Price Range</p>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                {currency}{priceRange[0]} - {currency}{priceRange[1]}
              </span>
            </div>
            <input
              type="range" min={0} max={maxPrice} value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-indigo-600"
            />
            <div className="flex gap-2 mt-3">
              <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} placeholder="Min"
                className="w-1/2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} placeholder="Max"
                className="w-1/2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          {/* Rating */}
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Min Rating</p>
            <div className="flex flex-col gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r}
                  onClick={() => toggle(setMinRating, r)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all active:scale-95
                    ${minRating.includes(r)
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <CollectionIcon6 key={i} className={`w-3.5 h-3.5 ${i < r ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20" />
                    ))}
                  </div>
                  {r}★ & above
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Apply button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-5 py-4 sm:hidden z-20">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl text-sm font-bold tracking-wide active:scale-95 transition-transform"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
};

// ── Mobile product card ──
// ── Mobile product card (receives wishlist state from parent) ──
const MobileProductCard = ({ item, wishlisted, onToggleWishlist, currency }) => {
  const price = Number(item.price) || 0;
  const comparePrice = Number(item.comparePrice) || 0;
  const hasDiscount = comparePrice > price;
  const discountPct = hasDiscount ? Math.round((1 - price / comparePrice) * 100) : 0;

  return (
    <Link
      to={`/product/${item._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 active:scale-95 transition-transform duration-150"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800">
        <img
          src={Array.isArray(item.image) ? item.image[0] : item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded shadow-md">
            -{discountPct}%
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(item._id);
          }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full shadow flex items-center justify-center active:scale-90 transition-all duration-200 ${wishlisted ? 'bg-red-50 dark:bg-red-900/30' : 'bg-white dark:bg-gray-900'}`}
        >
          <CollectionIcon7
            className={`w-3.5 h-3.5 transition-colors duration-200 ${wishlisted ? 'text-red-500' : 'text-gray-400'}`}
            fill={wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
           />
        </button>
      </div>
      <div className="px-2.5 pt-2 pb-3">
        <p className="text-xs text-gray-800 dark:text-gray-100 font-medium leading-tight line-clamp-2">{item.name}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{currency}{item.price}</p>
      </div>
    </Link>
  );
};


// ══════════════════════════════════════════
//  MAIN COLLECTION PAGE
// ══════════════════════════════════════════
const Collection = () => {
  const { products, search, showSearch, wishlist, toggleWishlist, currency } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [view, setView] = useState('grid4');
  const [page, setPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const ITEMS_PER_PAGE = 12;

  const getCatCount = (cat) => products.filter((p) => p.category === cat).length;
  const getSubCatCount = (sub) => products.filter((p) => p.subCategory === sub).length;

  useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map((p) => p.price));
      setMaxPrice(max);
      setPriceRange([0, max]);
    }
  }, [products]);

  const toggle = (setter, val) =>
    setter((prev) => (prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]));

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange([0, maxPrice]);
    setSortType('relevant');
    setMinRating([]);
    setInStockOnly(false);
    setPage(1);
  };

  const activeFilterCount =
    category.length + subCategory.length + minRating.length +
    (inStockOnly ? 1 : 0) +
    (priceRange[1] < maxPrice || priceRange[0] > 0 ? 1 : 0);

  const applyFilter = useCallback(() => {
    setIsFiltering(true);
    setTimeout(() => {
      let copy = products.slice();
      if (showSearch && search)
        copy = copy.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
      if (category.length > 0) copy = copy.filter((i) => category.includes(i.category));
      if (subCategory.length > 0) copy = copy.filter((i) => subCategory.includes(i.subCategory));
      copy = copy.filter((i) => i.price >= priceRange[0] && i.price <= priceRange[1]);
      if (minRating.length > 0) copy = copy.filter((i) => minRating.some((r) => (i.rating || 0) >= r));
      if (inStockOnly) copy = copy.filter((i) => i.inStock !== false);
      setFilterProducts(copy);
      setPage(1);
      setIsFiltering(false);
    }, 150);
  }, [products, showSearch, search, category, subCategory, priceRange, minRating, inStockOnly]);

  const sortProduct = useCallback(() => {
    const copy = filterProducts.slice();
    switch (sortType) {
      case 'low-high': setFilterProducts([...copy.sort((a, b) => a.price - b.price)]); break;
      case 'high-low': setFilterProducts([...copy.sort((a, b) => b.price - a.price)]); break;
      case 'newest': setFilterProducts([...copy.sort((a, b) => (b.date || 0) - (a.date || 0))]); break;
      case 'popular': setFilterProducts([...copy.sort((a, b) => (b.rating || 0) - (a.rating || 0))]); break;
      default: break;
    }
  }, [filterProducts, sortType]);

  useEffect(() => { applyFilter(); }, [applyFilter]);
  useEffect(() => { sortProduct(); }, [sortProduct]);
  useEffect(() => { if (sortType === 'relevant') applyFilter(); }, [sortType, applyFilter]);

  const totalPages = Math.ceil(filterProducts.length / ITEMS_PER_PAGE);
  const pagedProducts = filterProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const gridClass = {
    grid4: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6',
    grid3: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-6',
    list: 'flex flex-col gap-3',
  }[view];

  return (
    <>
      {/* ═══════════════════════════════════════
          MOBILE LAYOUT  (hidden on sm+)
      ═══════════════════════════════════════ */}
      <div className="block sm:hidden">

        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-4 py-2.5 flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={() => setShowMobileFilter(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 active:scale-95 transition-transform"
          >
            <CollectionIcon8 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort chips */}
          <div className="flex gap-1.5 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
            {[
              { val: 'relevant', label: 'Relevant' },
              { val: 'low-high', label: 'Price ↑' },
              { val: 'high-low', label: 'Price ↓' },
              { val: 'newest', label: 'Newest' },
              { val: 'popular', label: 'Popular' },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setSortType(val)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95
                  ${sortType === val
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips row */}
        {activeFilterCount > 0 && (
          <div className="flex gap-2 px-4 py-2 overflow-x-auto bg-gray-50 dark:bg-gray-900/50" style={{ scrollbarWidth: 'none' }}>
            {[...category, ...subCategory].map((tag) => (
              <button
                key={tag}
                onClick={() => category.includes(tag) ? toggle(setCategory, tag) : toggle(setSubCategory, tag)}
                className="flex-shrink-0 flex items-center gap-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full active:scale-95 transition-transform"
              >
                {tag}
                <CollectionIcon9 className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              </button>
            ))}
            {inStockOnly && (
              <button
                onClick={() => setInStockOnly(false)}
                className="flex-shrink-0 flex items-center gap-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full active:scale-95 transition-transform"
              >
                In Stock
                <CollectionIcon10 className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              </button>
            )}
          </div>
        )}

        {/* Count */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs text-gray-400 dark:text-gray-500">{filterProducts.length} items found</p>
        </div>

        {/* Products */}
        {isFiltering ? (
          <div className="grid grid-cols-2 gap-3 px-4 py-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden">
                <div className="bg-gray-200 dark:bg-gray-800 aspect-[3/4] w-full rounded-2xl" />
                <div className="mt-2 h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-2" />
                <div className="mt-1.5 h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mx-2 mb-2" />
              </div>
            ))}
          </div>
        ) : filterProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <CollectionIcon11 className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            </div>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">No products found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="mt-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full text-sm font-medium active:scale-95 transition-transform"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 px-4 py-3">
              {pagedProducts.map((item, index) => (
                <MobileProductCard
                  key={index}
                  item={item}
                  wishlisted={wishlist.includes(item._id)}
                  onToggleWishlist={toggleWishlist}
                  currency={currency}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 py-5 px-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-30 active:scale-95 transition-transform"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-30 active:scale-95 transition-transform"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Bottom sheet filter */}
        <MobileFilterSheet
          open={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          currency={currency}
          category={category} setCategory={setCategory}
          subCategory={subCategory} setSubCategory={setSubCategory}
          priceRange={priceRange} setPriceRange={setPriceRange} maxPrice={maxPrice}
          minRating={minRating} setMinRating={setMinRating}
          inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
          clearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
          toggle={toggle}
        />
      </div>

      {/* ═══════════════════════════════════════
                      DESKTOP LAYOUT
      ═══════════════════════════════════════ */}
      <div className="hidden sm:flex flex-row gap-6 sm:gap-10 pt-6 sm:pt-10 border-t border-gray-100 dark:border-gray-800">

        {/* Filter Sidebar */}
        <div className={`transition-all duration-300 ease-in-out flex-shrink-0 ${showFilter ? 'sm:w-60 md:w-64' : 'sm:w-10 md:w-12'}`}>
          <div className="flex items-center justify-between my-2 gap-3">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 cursor-pointer"
              title={showFilter ? 'Hide filters' : 'Show filters'}
            >
              <CollectionIcon12 className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              {showFilter && (
                <span className="text-lg sm:text-xl font-medium flex items-center gap-2">
                  FILTERS
                  {activeFilterCount > 0 && (
                    <span className="text-xs bg-black text-white dark:bg-white dark:text-gray-900 px-1.5 py-0.5 rounded-full font-normal">
                      {activeFilterCount}
                    </span>
                  )}
                </span>
              )}
              <CollectionIcon13
                className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${showFilter ? '' : 'rotate-180'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
               />
            </button>
            {showFilter && activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white underline underline-offset-2 transition-colors">
                Clear all
              </button>
            )}
          </div>

          <div className={`flex-col gap-3 mt-2 ${showFilter ? 'flex' : 'hidden'}`}>
            <div className="border border-gray-200 dark:border-gray-800 px-4 sm:px-5 py-3.5 flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200 tracking-widest uppercase">In Stock Only</span>
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-10 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 ${inStockOnly ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow transition-transform duration-200 ${inStockOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <FilterSection title="Categories" defaultOpen={true} activeCount={category.length}>
              <div className="flex flex-col gap-2 pt-1">
                {CATEGORIES.map((cat) => (
                  <CheckItem key={cat} label={cat} checked={category.includes(cat)} onChange={() => toggle(setCategory, cat)} count={getCatCount(cat)} />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Type" defaultOpen={true} activeCount={subCategory.length}>
              <div className="flex flex-col gap-2 pt-1">
                {SUB_CATEGORIES.map((sub) => (
                  <CheckItem key={sub} label={sub} checked={subCategory.includes(sub)} onChange={() => toggle(setSubCategory, sub)} count={getSubCatCount(sub)} />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Price Range" defaultOpen={true} activeCount={priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0}>
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>{currency}{priceRange[0]}</span><span>{currency}{priceRange[1]}</span>
                </div>
                <input type="range" min={0} max={maxPrice} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full accent-black dark:accent-white" />
                <div className="flex gap-2 mt-3">
                  <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} placeholder="Min"
                    className="w-1/2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-2 py-1 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                  <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} placeholder="Max"
                    className="w-1/2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-2 py-1 text-xs focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Min Rating" defaultOpen={false} activeCount={minRating.length}>
              <div className="flex flex-col gap-2 pt-1">
                {RATINGS.map((r) => (
                  <StarRow key={r} rating={r} checked={minRating.includes(r)} onChange={() => toggle(setMinRating, r)} />
                ))}
              </div>
            </FilterSection>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {[...category, ...subCategory].map((tag) => (
                  <span key={tag} onClick={() => category.includes(tag) ? toggle(setCategory, tag) : toggle(setSubCategory, tag)}
                    className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-2.5 py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    {tag}
                    <CollectionIcon14 className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  </span>
                ))}
                {inStockOnly && (
                  <span onClick={() => setInStockOnly(false)}
                    className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-2.5 py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    In Stock
                    <CollectionIcon15 className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Title text1={'ALL'} text2={'COLLECTIONS'} />
              <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 hidden sm:block">
                ({filterProducts.length} items)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <ViewToggle view={view} setView={setView} />
              <div className="relative w-full sm:w-auto">
                <select value={sortType} onChange={(e) => setSortType(e.target.value)}
                  className="w-full sm:w-auto border border-gray-200 dark:border-gray-700 text-xs sm:text-sm px-3 py-2 pr-8 appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer">
                  <option value="relevant">Sort: Relevant</option>
                  <option value="low-high">Price: Low → High</option>
                  <option value="high-low">Price: High → Low</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
                <CollectionIcon16 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              </div>
            </div>
          </div>

          {isFiltering ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-800 aspect-3/4 w-full rounded" />
                  <div className="mt-2 h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="mt-1.5 h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filterProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center gap-3">
              <CollectionIcon17 className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              <p className="text-gray-500 dark:text-gray-300 font-medium">No products found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting or clearing your filters</p>
              <button onClick={clearFilters} className="mt-2 text-sm border border-gray-300 dark:border-gray-700 px-5 py-2 hover:border-black dark:hover:border-white transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={gridClass}>
                {pagedProducts.map((item, index) => {
                  const price = Number(item.price) || 0;
                  const comparePrice = Number(item.comparePrice) || 0;
                  const hasDiscount = comparePrice > price;
                  const discountPct = hasDiscount ? Math.round((1 - price / comparePrice) * 100) : 0;
                  const savings = hasDiscount ? comparePrice - price : 0;
                  
                  return view === 'list' ? (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 border border-gray-100 dark:border-gray-800 p-3 hover:border-gray-300 dark:hover:border-gray-600 transition-colors relative">
                      <div className="relative w-full sm:w-24 h-44 sm:h-32 flex-shrink-0 overflow-hidden">
                        <img
                          src={transformCloudinaryUrl(item.image[0], { width: 320 })}
                          srcSet={buildCloudinarySrcSet(item.image[0], [160, 240, 320, 480], { crop: 'fill' })}
                          sizes="(max-width: 639px) 100vw, 6rem"
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Discount Badge */}
                        {hasDiscount && (
                          <div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded shadow-md">
                            -{discountPct}%
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between py-1 min-w-0 flex-1">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.category} · {item.subCategory}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{currency}{Math.round(price)}</p>
                          {hasDiscount && (
                            <p className="text-sm text-gray-400 line-through">{currency}{Math.round(comparePrice)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ProductItem key={index} name={item.name} id={item._id} price={item.price} comparePrice={item.comparePrice} image={item.image} />
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-8 h-8 sm:w-9 sm:h-9 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-black dark:hover:border-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <CollectionIcon18 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 border text-sm transition-colors ${page === p ? 'bg-black text-white border-black dark:bg-white dark:text-gray-900 dark:border-gray-200' : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white'}`}>
                          {p}
                        </button>
                      );
                    if (Math.abs(p - page) === 2) return <span key={p} className="text-gray-400 dark:text-gray-500 text-sm">…</span>;
                    return null;
                  })}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-8 h-8 sm:w-9 sm:h-9 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-black dark:hover:border-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <CollectionIcon19 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
    </>
  );
};

export default Collection;
