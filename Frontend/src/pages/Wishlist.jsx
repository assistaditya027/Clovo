import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { Link } from 'react-router-dom';
import { WishlistIcon1, WishlistIcon2 } from '../assets/assets';
import { buildCloudinarySrcSet, transformCloudinaryUrl } from '../utils/cloudinary';

const Wishlist = () => {
  const { wishlist, products, currency, toggleWishlist } = useContext(ShopContext);

  // Get wishlist product details
  const wishlistProducts = products.filter((product) => wishlist.includes(product._id));

  return (
    <div className="py-8 sm:py-12">
      {/* ── Title ── */}
      <div className="mb-6 sm:mb-8">
        <Title text1="My " text2="Wishlist" />
      </div>

      {/* ── Empty State ── */}
      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <WishlistIcon1
            className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
           />
          <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
            Your wishlist is empty
          </p>
          <Link
            to="/collection"
            className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black
              rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-150"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          {/* ── Desktop Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {wishlistProducts.map((product) => (
              <WishlistItem
                key={product._id}
                product={product}
                currency={currency}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>

          {/* ── Continue Shopping Button ── */}
          <div className="flex justify-center mt-8 sm:mt-12">
            <Link
              to="/collection"
              className="px-8 py-2.5 bg-black dark:bg-white text-white dark:text-black
                rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-150 text-sm"
            >
              Add More Items
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Wishlist Item Component ──
const WishlistItem = ({ product, currency, onToggleWishlist }) => {
  // Calculate discount
  const price = Number(product.price) || 0;
  const comparePrice = Number(product.comparePrice) || 0;
  const hasDiscount = comparePrice > price;
  const discountPct = hasDiscount ? Math.round((1 - price / comparePrice) * 100) : 0;
  const savings = hasDiscount ? comparePrice - price : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* ── Image Container ── */}
      <Link
        to={`/product/${product._id}`}
        className="relative overflow-hidden aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800 block"
      >
        <img
          src={transformCloudinaryUrl(product.image[0], { width: 640 })}
          srcSet={buildCloudinarySrcSet(product.image[0], [320, 480, 640, 800], { crop: 'fill' })}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
        {/* ── Sale Badge ── */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold
            px-2 py-1 rounded shadow-lg">
            -{discountPct}%
          </div>
        )}

        {/* ── Remove from Wishlist Button ── */}
        <button
          onClick={() => onToggleWishlist(product._id)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0
            group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
          aria-label="Remove from wishlist"
        >
          <WishlistIcon2 className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" />
        </button>
      </Link>

      {/* ── Product Info ── */}
      <div className="p-2.5 sm:p-3">
        {/* ── Name ── */}
        <Link
          to={`/product/${product._id}`}
          className="block text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200
            hover:text-gray-600 dark:hover:text-gray-400 truncate transition-colors duration-150"
        >
          {product.name}
        </Link>

        {/* ── Price Section ── */}
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              {currency}
              {Math.round(price)}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                {currency}
                {Math.round(comparePrice)}
              </span>
            )}
          </div>

        </div>

        {/* ── Add to Cart Button ── */}
        <Link
          to={`/product/${product._id}`}
          className="mt-3 w-full inline-block py-2 px-3 bg-gray-900 dark:bg-white
            text-white dark:text-gray-900 text-xs sm:text-sm font-medium rounded
            hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-150
            text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
