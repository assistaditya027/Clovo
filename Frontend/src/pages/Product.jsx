import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { buildCloudinarySrcSet, transformCloudinaryUrl } from '../utils/cloudinary';
import { ProductIcon1, ProductIcon2, ProductIcon3, ProductIcon4, ProductIcon5, ProductIcon6, ProductIcon7, ProductIcon8, ProductIcon9, ProductIcon10, ProductIcon11, ProductIcon12, ProductIcon13, ProductIcon14, ProductIcon15, ProductIcon16, ProductIcon17 } from '../assets/assets';

const LOW_STOCK = 5;

// ── Size Guide Data ──
const sizeGuideData = {
  headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)', 'Length (in)'],
  rows: [
    ['XS', '32-34', '24-26', '34-36', '25'],
    ['S', '34-36', '26-28', '36-38', '26'],
    ['M', '36-38', '28-30', '38-40', '27'],
    ['L', '38-40', '30-32', '40-42', '28'],
    ['XL', '40-42', '32-34', '42-44', '29'],
    ['XXL', '42-44', '34-36', '44-46', '30'],
  ],
  tips: [
    'Measure your chest at the fullest point, keeping the tape horizontal.',
    'Measure your natural waist — the narrowest part of your torso.',
    'Measure your hips at the fullest point, about 8 inches below your waist.',
    "If you're between sizes, we recommend sizing up for a relaxed fit.",
  ],
};

// ── Get stock for a size from productData.stock (Map or plain object) ──
const getStock = (stockField, size) => {
  if (!stockField || !size) return null;
  // Mongoose Map serialised to object after API call
  if (typeof stockField.get === 'function') return stockField.get(size) ?? null;
  return stockField[size] ?? null;
};

// ── Stars ──
const Stars = ({ rating, size = 'w-3.5' }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <img
        key={i}
        src={i < Math.round(rating) ? assets.star_icon : assets.star_dull_icon}
        alt=""
        className={size}
      />
    ))}
  </div>
);

// ── Modal ──
const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="font-medium text-base">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ProductIcon1 className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

// ── Image Zoom Modal ──
const ZoomModal = ({ open, onClose, src, alt }) => {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);

  useEffect(() => {
    if (!open) {
      setScale(1);
      setPos({ x: 0, y: 0 });
    }
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.min(4, Math.max(1, s - e.deltaY * 0.002)));
  };
  const onMouseDown = (e) => {
    if (scale <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  const onMouseMove = (e) => {
    if (!dragging || !dragStart.current) return;
    setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const onMouseUp = () => setDragging(false);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
      >
        <ProductIcon2 className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setScale((s) => Math.max(1, s - 0.5));
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg font-light"
        >
          −
        </button>
        <span className="text-white/60 text-xs min-w-[40px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setScale((s) => Math.min(4, s + 0.5));
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg font-light"
        >
          +
        </button>
      </div>
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-out' }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={() => {
          if (!dragging) onClose();
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 0.15s ease',
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            userSelect: 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs">
        Scroll or pinch to zoom · Drag to pan
      </p>
    </div>
  );
};

// ── Review Form ──
const ReviewForm = ({ onSubmit }) => {
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({ name: '', rating: 0, comment: '' });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.rating) return setError('Please select a star rating.');
    if (form.comment.trim().length < 10) return setError('Review must be at least 10 characters.');
    setError('');
    onSubmit({
      ...form,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    });
    setForm({ name: '', rating: 0, comment: '' });
    setHovered(0);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (submitted)
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
          <ProductIcon3
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
           />
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          Thanks for your review!
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Your feedback helps other shoppers.
        </p>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2">
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
          Your Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Sarah M."
          className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
          Rating
        </label>
        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm({ ...form, rating: star })}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
            >
              <img
                src={(hovered || form.rating) >= star ? assets.star_icon : assets.star_dull_icon}
                alt={`${star} star`}
                className="w-6 h-6"
              />
            </button>
          ))}
          {form.rating > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
            </span>
          )}
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
          Your Review
        </label>
        <textarea
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          rows={3}
          placeholder="Share your experience with this product..."
          className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-right">
          {form.comment.length} / 10 min
        </p>
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <ProductIcon4 className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" />
          {error}
        </p>
      )}
      <button
        type="submit"
        className="bg-black text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 py-2.5 text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
      >
        <ProductIcon5 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
        Submit Review
      </button>
    </form>
  );
};

// ══════════════════════════════════════════
//  MAIN PRODUCT PAGE
// ══════════════════════════════════════════
const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, toggleWishlist, isWishlisted } = useContext(ShopContext);

  const productData = useMemo(
    () => products.find((item) => item._id === productId) || null,
    [productId, products],
  );
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [shareState, setShareState] = useState('idle');
  const imgRef = useRef(null);
  const addToCartRef = useRef(null);

  const [reviews, setReviews] = useState([]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length
      ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100)
      : 0,
  }));

  // ── Derive stock state from real productData.stock ──
  const selectedStock = size ? getStock(productData?.stock, size) : null;
  const isOutOfStock = selectedStock !== null && selectedStock === 0;
  const isLowStock = selectedStock !== null && selectedStock > 0 && selectedStock <= LOW_STOCK;

  useEffect(() => {
    if (!productData) return;
    setImage(productData.image[0]);
    setSize('');
    setQuantity(1);
  }, [productData]);

  useEffect(() => {
    setImgLoaded(false);
    if (!image) return;
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0)
      setImgLoaded(true);
  }, [image]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-100px 0px 0px 0px' },
    );
    if (addToCartRef.current) observer.observe(addToCartRef.current);
    return () => observer.disconnect();
  }, [productData]);

  const handleAddToCart = () => {
    if (!size || isOutOfStock) return;
    for (let i = 0; i < quantity; i++) addToCart(productData._id, size);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: productData.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2000);
      }
    } catch {
      // Ignore share errors
    }
  };

  const handleNewReview = (review) =>
    setReviews((prev) => [{ ...review, id: Date.now() }, ...prev]);

  if (!productData) return <div className="opacity-0 min-h-[60vh]" />;

  const price = Number(productData.price) || 0;
  const comparePrice = Number(productData.comparePrice) || 0;
  const hasDiscount = comparePrice > price;
  const discountPct = hasDiscount ? Math.round((1 - price / comparePrice) * 100) : 0;
  const savings = hasDiscount ? comparePrice - price : 0;

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* ════ Sticky Bar ════ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
              {productData.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currency}
              {productData.price}
              {size ? ` · ${size}` : ''}
            </p>
          </div>
          <div className="flex gap-2 items-center shrink-0">
            {!size && <p className="text-xs text-gray-400 hidden sm:block">Select a size above</p>}
            <button
              onClick={handleAddToCart}
              disabled={!size || isOutOfStock}
              className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] whitespace-nowrap
                ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : size && !isOutOfStock
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {addedToCart ? 'Added!' : isOutOfStock && size ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* ════ Product Layout ════ */}
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* ── Gallery ── */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full gap-2">
            {productData.image.map((item, index) => (
              <div
                key={index}
                onClick={() => setImage(item)}
                className={`relative w-[24%] sm:w-full aspect-[4/5] shrink-0 cursor-pointer overflow-hidden border-2 transition-all duration-200
                  ${image === item ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
              >
                <img
                  src={transformCloudinaryUrl(item, { width: 180 })}
                  alt={`${productData.name} view ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          <div
            className="w-full sm:w-[80%] relative overflow-hidden cursor-zoom-in group"
            onClick={() => imgLoaded && setZoomOpen(true)}
          >
            <div className="relative w-full" style={{ paddingBottom: '125%' }}>
              {!imgLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse z-10" />}
              <img
                ref={imgRef}
                key={image}
                src={transformCloudinaryUrl(image, { width: 1200 })}
                srcSet={buildCloudinarySrcSet(image, [720, 960, 1200, 1440], { crop: 'fill' })}
                sizes="(min-width: 640px) 60vw, 100vw"
                alt={productData.name}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              {imgLoaded && (
                <div className="absolute bottom-3 right-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs text-gray-500 dark:text-gray-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <ProductIcon6 className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  Click to zoom
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Details ── */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mt-2">
            <h1 className="font-medium text-2xl leading-snug">{productData.name}</h1>
            <div className="flex items-center gap-2 shrink-0 mt-0.5">
              <button
                onClick={handleShare}
                title="Share"
                className="w-9 h-9 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-black dark:hover:border-white transition-all text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                {shareState === 'copied' ? (
                  <ProductIcon7
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                   />
                ) : (
                  <ProductIcon8 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                )}
              </button>
              <button
                onClick={() => toggleWishlist(productData._id)}
                className={`w-9 h-9 border flex items-center justify-center transition-all
                  ${
                    isWishlisted(productData._id)
                      ? 'border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
                  }`}
                aria-label={isWishlisted(productData._id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <ProductIcon9
                  className={`w-4 h-4 transition-colors ${isWishlisted(productData._id) ? 'text-red-500 fill-red-500' : 'text-gray-400 dark:text-gray-500 fill-none'}`}
                  stroke="currentColor"
                  strokeWidth={isWishlisted(productData._id) ? 0 : 1.8}
                  viewBox="0 0 24 24"
                 />
              </button>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Stars rating={avgRating} />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {avgRating} <span className="text-gray-400">({reviews.length} reviews)</span>
              </p>
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  setTimeout(
                    () =>
                      document
                        .getElementById('tabs-section')
                        ?.scrollIntoView({ behavior: 'smooth' }),
                    50,
                  );
                }}
                className="text-xs text-gray-400 underline underline-offset-2 hover:text-black transition-colors"
              >
                Write a review
              </button>
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-end gap-3 flex-wrap">
              <p className="text-3xl font-medium">
                {currency}
                {productData.price}
              </p>
              {hasDiscount && (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    MRP {currency}
                    {productData.comparePrice}
                  </p>
                  <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>
            {hasDiscount && (
              <p className="text-xs text-gray-500 mt-1">
                You save {currency}
                {savings}
              </p>
            )}
          </div>

          {/* ── Size selector ── */}
          <div className="flex flex-col gap-3 my-8">
            <div className="flex items-center justify-between md:w-4/5">
              <p className="text-sm font-medium">Select Size</p>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs text-gray-400 underline underline-offset-2 hover:text-black transition-colors flex items-center gap-1"
              >
                <ProductIcon10 className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                Size Guide
              </button>
            </div>

            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {productData.sizes.map((item) => {
                const stock = getStock(productData.stock, item);
                const outOfStock = stock !== null && stock === 0;
                const lowStock = stock !== null && stock > 0 && stock <= LOW_STOCK;
                return (
                  <div key={item} className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => {
                        if (!outOfStock) {
                          setSize(item);
                          setQuantity(1);
                        }
                      }}
                      disabled={outOfStock}
                      title={
                        outOfStock ? 'Out of stock' : lowStock ? `Only ${stock} left` : 'In stock'
                      }
                      className={`relative border px-4 py-2 text-sm transition-all duration-150
                        ${
                          outOfStock
                            ? 'opacity-40 cursor-not-allowed bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 line-through'
                            : item === size
                              ? 'bg-black text-white border-black'
                              : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      {item}
                      {/* Amber dot for low stock */}
                      {!outOfStock && lowStock && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
                      )}
                    </button>
                    {/* Stock label under button */}
                    {outOfStock && (
                      <span className="text-[10px] text-red-500 font-medium">Out of stock</span>
                    )}
                    {!outOfStock && lowStock && (
                      <span className="text-[10px] text-amber-500 font-medium">
                        Only {stock} left
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Show stock hint for selected size */}
            {size && isLowStock && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <ProductIcon11 className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                Only {selectedStock} left in size {size} — order soon!
              </p>
            )}

            {!size && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <ProductIcon12 className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                Please select a size before adding to cart.
              </p>
            )}
          </div>

          {/* ── Add to Cart ── */}
          <div ref={addToCartRef} className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!size || isOutOfStock}
              className={`flex items-center gap-2 px-8 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] w-fit
                ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : size && !isOutOfStock
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {addedToCart ? (
                <>
                  <ProductIcon13 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  ADDED TO CART
                </>
              ) : isOutOfStock && size ? (
                <>
                  <ProductIcon14 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  OUT OF STOCK
                </>
              ) : (
                <>
                  <ProductIcon15 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  ADD TO CART
                </>
              )}
            </button>
          </div>

          <hr className="border-t border-gray-200 mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-5 flex flex-col gap-2">
            {[
              {
                d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                text: '100% Original products.',
              },
              {
                d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
                text: 'Cash on delivery is available on this product.',
              },
              {
                d: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
                text: 'Easy return and exchange within 7 days.',
              },
            ].map(({ d, text }) => (
              <div key={text} className="flex items-center gap-2">
                <ProductIcon16
                  className="w-4 h-4 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  d={d}
                 />
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ Tabs ════ */}
      <div id="tabs-section" className="mt-20">
        <div className="flex">
          {[
            { key: 'description', label: 'Description' },
            {
              key: 'reviews',
              label: reviews.length > 0 ? `Reviews (${reviews.length})` : 'Reviews',
            },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 text-sm border transition-all duration-150
                ${
                  activeTab === key
                    ? 'border-b-white bg-white font-medium text-black dark:border-b-gray-900 dark:bg-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white bg-gray-50 dark:bg-gray-950'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="flex flex-col gap-4 border border-gray-200 dark:border-gray-800 px-6 py-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {productData.description ? (
              productData.description
                .split('\n')
                .filter(Boolean)
                .map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p className="italic text-gray-400 dark:text-gray-600">
                No description available for this product.
              </p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="border px-6 py-6">
            {reviews.length > 0 && (
              <>
                <div className="flex flex-col md:flex-row gap-10 mb-8">
                  <div className="flex flex-col items-center justify-center gap-1 min-w-[120px]">
                    <p className="text-5xl font-bold text-gray-900">{avgRating}</p>
                    <Stars rating={avgRating} size="w-4" />
                    <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    {ratingBreakdown.map(({ star, count, pct }) => (
                      <div
                        key={star}
                        className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400"
                      >
                        <span className="w-3 text-right">{star}</span>
                        <img src={assets.star_icon} alt="" className="w-3" />
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gray-800 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr className="border-gray-100 dark:border-gray-800 mb-6" />
              </>
            )}

            <div className="mb-8">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">
                Write a Review
              </p>
              <ReviewForm onSubmit={handleNewReview} />
            </div>

            {reviews.length > 0 && (
              <>
                <hr className="border-gray-100 dark:border-gray-800 mb-6" />
                <div className="flex flex-col gap-5">
                  {reviews.map((review, i) => (
                    <div
                      key={review.id || i}
                      className="border-b border-gray-100 dark:border-gray-800 pb-5 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {review.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                              {review.name}
                            </p>
                            <p className="text-[10px] text-gray-400">{review.date}</p>
                          </div>
                        </div>
                        <Stars rating={review.rating} size="w-3.5" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed ml-10">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

      {/* ════ Size Guide Modal ════ */}
      <Modal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} title="Size Guide">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Find your perfect fit. All measurements are in inches.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white">
                {sizeGuideData.headers.map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-medium text-xs tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeGuideData.rows.map(([sz, ...rest], i) => (
                <tr
                  key={sz}
                  className={`border-b border-gray-100 dark:border-gray-800 transition-colors
                  ${
                    size === sz
                      ? 'bg-black text-white dark:bg-white dark:text-gray-900'
                      : i % 2 === 0
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-gray-50 dark:bg-gray-950'
                  }`}
                >
                  <td
                    className={`px-4 py-2.5 font-semibold text-xs ${size === sz ? 'text-white' : ''}`}
                  >
                    {sz}
                  </td>
                  {rest.map((val, vi) => (
                    <td
                      key={vi}
                      className={`px-4 py-2.5 text-xs ${size === sz ? 'text-white' : 'text-gray-600'}`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
            How to Measure
          </p>
          <ul className="flex flex-col gap-2">
            {sizeGuideData.tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400"
              >
                <span className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <ProductIcon17
              className="w-4 h-4 text-green-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
             />
            Not sure? Size up for a relaxed fit. Free exchanges within 7 days.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {productData.sizes.map((s) => {
            const stock = getStock(productData.stock, s);
            const outOfStock = stock !== null && stock === 0;
            return (
              <button
                key={s}
                disabled={outOfStock}
                onClick={() => {
                  if (!outOfStock) {
                    setSize(s);
                    setSizeGuideOpen(false);
                  }
                }}
                className={`border px-4 py-2 text-sm transition-all
                  ${
                    outOfStock
                      ? 'opacity-40 cursor-not-allowed border-gray-200 dark:border-gray-700 text-gray-400 line-through'
                      : size === s
                        ? 'bg-black text-white border-black dark:bg-white dark:text-gray-900 dark:border-white'
                        : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white text-gray-700 dark:text-gray-300'
                  }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Modal>

      <ZoomModal
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        src={image}
        alt={productData.name}
      />
    </div>
  );
};

export default Product;
