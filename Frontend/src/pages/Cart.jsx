import { useContext, useState, useEffect, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets, CartIcon1, CartIcon2 } from '../assets/assets';
import { buildCloudinarySrcSet, transformCloudinaryUrl } from '../utils/cloudinary';

// Neutral placeholder shown if a product image fails to load.
const FALLBACK_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="96" viewBox="0 0 80 96"%3E%3Crect width="80" height="96" fill="%23e5e7eb"/%3E%3Cpath d="M28 40h24v24H28z" fill="%23cbd5e1"/%3E%3C/svg%3E';

const formatPrice = (value) => {
  const num = Number(value);
  return (Number.isFinite(num) ? num : 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const CartItemSkeleton = () => (
  <div className="animate-pulse">
    <div className="sm:hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
      <div className="flex gap-3">
        <div className="w-20 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-3.5 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
          <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-800 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded mt-4" />
        </div>
      </div>
    </div>
    <div className="hidden sm:grid grid-cols-[4fr_1fr_1fr_0.5fr] gap-4 items-center px-2 py-5">
      <div className="flex items-center gap-4">
        <div className="w-20 h-24 rounded bg-gray-100 dark:bg-gray-800" />
        <div className="space-y-2 flex-1">
          <div className="h-3.5 w-2/3 bg-gray-100 dark:bg-gray-800 rounded" />
          <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-800 rounded" />
        </div>
      </div>
      <div className="h-7 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="h-3.5 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="h-4 w-4 bg-gray-100 dark:bg-gray-800 rounded justify-self-end" />
    </div>
  </div>
);

const CartQuantityControls = ({ item, onCommit, onStep, size = 'md', label }) => {
  const [draft, setDraft] = useState(String(item.quantity));

  // Keep the input in sync when quantity changes externally (e.g. +/- buttons).
  useEffect(() => {
    setDraft(String(item.quantity));
  }, [item.quantity]);

  const commit = () => {
    const parsed = parseInt(draft, 10);
    if (Number.isFinite(parsed) && parsed >= 1) {
      if (parsed !== item.quantity) onCommit(parsed);
      else setDraft(String(item.quantity));
    } else {
      setDraft(String(item.quantity));
    }
  };

  const btnSize = size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  const inputSize = size === 'lg' ? 'w-11 h-10' : 'w-9 h-7';

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onStep(-1)}
        disabled={item.quantity <= 1}
        className={`${btnSize} flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-900 text-gray-600 dark:text-gray-400 transition-colors rounded-lg text-base leading-none select-none touch-manipulation`}
        aria-label={`Decrease quantity${label ? ` of ${label}` : ''}`}
      >
        −
      </button>
      <input
        className={`border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${inputSize} text-center text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500`}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={`Quantity${label ? ` for ${label}` : ''}`}
        value={draft}
        onChange={(e) => {
          const v = e.target.value;
          if (v === '' || /^[0-9]{1,3}$/.test(v)) setDraft(v);
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
      />
      <button
        type="button"
        onClick={() => onStep(1)}
        className={`${btnSize} flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors rounded-lg text-base leading-none select-none touch-manipulation`}
        aria-label={`Increase quantity${label ? ` of ${label}` : ''}`}
      >
        +
      </button>
    </div>
  );
};

const RemoveButton = ({ onRemove, label, className = '' }) => (
  <button
    type="button"
    onClick={onRemove}
    className={`inline-flex items-center gap-1.5 rounded-lg border border-red-100 dark:border-red-900/40 bg-red-50/70 dark:bg-red-900/20 px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 active:bg-red-200 dark:active:bg-red-900/40 transition-colors touch-manipulation ${className}`}
    aria-label={`Remove${label ? ` ${label}` : ' item'} from cart`}
  >
    <img className="w-3.5 h-3.5" src={assets.bin_icon} alt="" aria-hidden="true" />
    Remove
  </button>
);

const Cart = () => {
  const { cartItems, products, currency, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    if (!cartItems || typeof cartItems !== 'object') {
      setCartData([]);
      return;
    }

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
        if (quantity > 0) {
          tempData.push({ _id: productId, size, quantity });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  const itemCount = useMemo(
    () => cartData.reduce((sum, item) => sum + item.quantity, 0),
    [cartData],
  );

  // products hasn't loaded yet (as opposed to having loaded and simply not
  // containing a given item) — show skeletons instead of a false "unavailable" state.
  const productsLoading = !Array.isArray(products);

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-10 sm:pt-14 min-h-[60vh] px-1 sm:px-0 pb-24 sm:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="text-xl sm:text-2xl">
          <Title text1={'YOUR'} text2={'CART'} />
        </div>
        {itemCount > 0 && (
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {/* Empty State */}
      {!productsLoading && cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
            <CartIcon1
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            />
          </div>
          <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
            Your cart is empty
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add items to get started</p>
          <button
            onClick={() => navigate('/collection')}
            className="mt-4 w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-black dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 active:opacity-70 transition-opacity touch-manipulation"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Column Headers - desktop only */}
          <div className="hidden sm:grid grid-cols-[4fr_1fr_1fr_0.5fr] gap-4 px-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs uppercase tracking-widest text-gray-400">Product</p>
            <p className="text-xs uppercase tracking-widest text-gray-400">Qty</p>
            <p className="text-xs uppercase tracking-widest text-gray-400">Subtotal</p>
            <span />
          </div>

          {/* Cart Items */}
          <ul
            aria-label="Shopping cart items"
            className="flex flex-col gap-3 sm:gap-0 sm:divide-y sm:divide-gray-100 dark:sm:divide-gray-800 mt-3 sm:mt-0 list-none p-0 m-0"
          >
            {productsLoading
              ? cartData.map((item) => (
                  <li key={`${item._id}-${item.size}`}>
                    <CartItemSkeleton />
                  </li>
                ))
              : cartData.map((item) => {
                  const productData = products.find((product) => product._id === item._id) || null;
                  const itemKey = `${item._id}-${item.size}`;

                  if (!productData) {
                    return (
                      <li
                        key={itemKey}
                        className="py-4 sm:py-5 flex items-center justify-between gap-3"
                      >
                        <span className="text-gray-400 dark:text-gray-600 text-sm italic">
                          Product no longer available
                        </span>
                        <RemoveButton onRemove={() => updateQuantity(item._id, item.size, 0)} />
                      </li>
                    );
                  }

                  const image = productData.image?.[0];
                  const lineTotal = formatPrice(Number(productData.price || 0) * item.quantity);
                  const itemLabel = `${productData.name}, size ${item.size}`;

                  return (
                    <li key={itemKey} className="text-gray-700 dark:text-gray-300">
                      {/* Mobile card */}
                      <div className="sm:hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-sm">
                        <div className="flex gap-3">
                          <div className="relative flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 w-20 h-24">
                            <img
                              className="w-full h-full object-cover"
                              src={
                                image
                                  ? transformCloudinaryUrl(image, { width: 320 })
                                  : FALLBACK_IMAGE
                              }
                              srcSet={
                                image
                                  ? buildCloudinarySrcSet(image, [160, 240, 320, 480], {
                                      crop: 'fill',
                                    })
                                  : undefined
                              }
                              sizes="80px"
                              alt={productData.name ?? ''}
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.srcset = '';
                                e.currentTarget.src = FALLBACK_IMAGE;
                              }}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
                              {productData.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Size {item.size}
                            </p>

                            <div className="flex items-center justify-between mt-3 gap-3">
                              <div>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                  Price
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {currency}
                                  {formatPrice(productData.price)}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">
                                  Total
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">
                                  {currency}
                                  {lineTotal}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                          <CartQuantityControls
                            item={item}
                            size="lg"
                            label={itemLabel}
                            onStep={(delta) =>
                              updateQuantity(item._id, item.size, item.quantity + delta)
                            }
                            onCommit={(value) => updateQuantity(item._id, item.size, value)}
                          />
                          <RemoveButton
                            onRemove={() => updateQuantity(item._id, item.size, 0)}
                            label={itemLabel}
                          />
                        </div>
                      </div>

                      {/* Desktop row */}
                      <div className="hidden sm:grid grid-cols-[4fr_1fr_1fr_0.5fr] gap-4 items-center group transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/40 rounded-lg px-2 -mx-2">
                        <div className="flex items-center gap-4 py-5">
                          <div className="relative flex-shrink-0 overflow-hidden rounded bg-gray-50 dark:bg-gray-800">
                            <img
                              className="w-16 sm:w-20 h-20 sm:h-24 object-cover"
                              src={
                                image
                                  ? transformCloudinaryUrl(image, { width: 320 })
                                  : FALLBACK_IMAGE
                              }
                              srcSet={
                                image
                                  ? buildCloudinarySrcSet(image, [160, 240, 320, 480], {
                                      crop: 'fill',
                                    })
                                  : undefined
                              }
                              sizes="80px"
                              alt={productData.name ?? ''}
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.srcset = '';
                                e.currentTarget.src = FALLBACK_IMAGE;
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {productData.name}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {currency}
                                {formatPrice(productData.price)}
                              </p>
                              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                {item.size}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 justify-start">
                          <CartQuantityControls
                            item={item}
                            label={itemLabel}
                            onStep={(delta) =>
                              updateQuantity(item._id, item.size, item.quantity + delta)
                            }
                            onCommit={(value) => updateQuantity(item._id, item.size, value)}
                          />
                        </div>

                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {currency}
                          {lineTotal}
                        </p>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, item.size, 0)}
                          className="justify-self-end p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group/del"
                          aria-label={`Remove ${itemLabel} from cart`}
                        >
                          <img
                            className="w-4 sm:w-4.5 opacity-40 group-hover/del:opacity-80 transition-opacity"
                            src={assets.bin_icon}
                            alt=""
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </li>
                  );
                })}
          </ul>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-start gap-6 sm:gap-10 mt-10 sm:mt-12 mb-16 sm:mb-20">
            <button
              onClick={() => navigate('/collection')}
              className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group py-2 touch-manipulation"
            >
              <CartIcon2
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              />
              Continue Shopping
            </button>

            <div className="w-full sm:w-96">
              <div className="rounded-2xl sm:rounded-none border border-gray-100 dark:border-gray-800 sm:border-none bg-white dark:bg-gray-900 sm:bg-transparent sm:dark:bg-transparent p-4 sm:p-0">
                <CartTotal />
                {/* Inline checkout CTA — hidden on mobile in favor of the sticky bar below,
                    which avoids two competing checkout buttons on small screens. */}
                <div className="hidden sm:block w-full text-end mt-6">
                  <button
                    onClick={() => navigate('/place-order')}
                    className="w-full sm:w-auto bg-black text-white dark:bg-white dark:text-gray-900 text-sm font-medium px-10 py-3.5 hover:opacity-80 active:opacity-70 transition-opacity tracking-wide touch-manipulation"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sticky mobile checkout bar */}
      {!productsLoading && cartData.length > 0 && (
        <div
          className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur px-4 py-3 flex items-center justify-between gap-4"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
          </span>
          <button
            onClick={() => navigate('/place-order')}
            className="bg-black text-white dark:bg-white dark:text-gray-900 text-sm font-medium px-8 py-3 rounded-xl hover:opacity-80 active:opacity-70 transition-opacity tracking-wide touch-manipulation"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
