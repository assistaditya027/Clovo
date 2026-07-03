import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { buildCloudinarySrcSet, transformCloudinaryUrl } from '../utils/cloudinary';

const ProductItem = ({ id, image, name, price, comparePrice }) => {
  const { currency, toggleWishlist, isWishlisted } = useContext(ShopContext);
  const wishlisted = isWishlisted(id);
  const primaryImage = Array.isArray(image) ? image[0] : image;
  const imageSrc = transformCloudinaryUrl(primaryImage, { width: 640 });
  const imageSrcSet = buildCloudinarySrcSet(primaryImage, [320, 480, 640, 800], { crop: 'fill' });

  // Calculate discount
  const productPrice = Number(price) || 0;
  const productComparePrice = Number(comparePrice) || 0;
  const hasDiscount = productComparePrice > productPrice;
  const discountPct = hasDiscount ? Math.round((1 - productPrice / productComparePrice) * 100) : 0;
  const savings = hasDiscount ? productComparePrice - productPrice : 0;

  return (
    <div className="text-gray-700 dark:text-gray-200 cursor-pointer">
      {/* ── Image Container with Wishlist Button ── */}
      <div className="relative overflow-hidden aspect-[4/5] w-full bg-gray-100 dark:bg-gray-800 group">
        <Link to={`/product/${id}`}>
          <img
            src={imageSrc}
            srcSet={imageSrcSet}
            sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 20vw, (min-width: 1024px) 24vw, (min-width: 640px) 33vw, 50vw"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition ease-in-out"
            alt={name}
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* ── Discount Badge (Top-Left) ── */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs sm:text-sm font-bold
            px-2.5 py-1.5 rounded shadow-lg">
            -{discountPct}%
          </div>
        )}

        {/* ── Wishlist Heart Button (Top-Right) ── */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200
            ${
              wishlisted
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white'
            }
            backdrop-blur-sm hover:shadow-lg`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className="w-5 h-5"
            fill={wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={wishlisted ? 0 : 2}
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* ── Product Details ── */}
      <Link
        to={`/product/${id}`}
        className="block pt-3 pb-1 text-sm hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        {name}
      </Link>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {currency}
          {Math.round(productPrice)}
        </p>
        {hasDiscount && (
          <p className="text-xs text-gray-400 line-through">
            {currency}
            {Math.round(productComparePrice)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
