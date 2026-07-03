import { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { buildCloudinarySrcSet, transformCloudinaryUrl } from '../utils/cloudinary';

const LatestCollection = () => {
  const { products, currency } = useContext(ShopContext);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const MOBILE_PREVIEW_COUNT = 4;
  const latestProducts = useMemo(() => products.slice(0, 10), [products]);

  return (
    <div className="my-8 sm:my-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center py-6 sm:py-8 text-2xl sm:text-3xl">
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className="w-full sm:w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
          Step into our latest collections where style meets comfort. From timeless classics to
          modern trends, find the perfect pieces to elevate your everyday look.
        </p>
      </div>

      {/* Mobile-only: compact app-style cards */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide">Latest Drops</h3>
          <span className="text-xs text-gray-400">{latestProducts.length} items</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(showAllMobile ? latestProducts : latestProducts.slice(0, MOBILE_PREVIEW_COUNT)).map((item) => {
            const price = Number(item.price) || 0;
            const comparePrice = Number(item.comparePrice) || 0;
            const hasDiscount = comparePrice > price;
            const discountPct = hasDiscount ? Math.round((1 - price / comparePrice) * 100) : 0;
            return (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform duration-150"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="relative aspect-[3/4] bg-gray-50 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={transformCloudinaryUrl(Array.isArray(item.image) ? item.image[0] : item.image, { width: 480 })}
                    srcSet={buildCloudinarySrcSet(Array.isArray(item.image) ? item.image[0] : item.image, [240, 360, 480, 640], { crop: 'fill' })}
                    sizes="(max-width: 639px) 50vw, 0vw"
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded shadow-md">
                      -{discountPct}%
                    </div>
                  )}
                  {/* Wishlist Heart */}
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-gray-900/90 border border-white/60 dark:border-gray-800 flex items-center justify-center" style={hasDiscount ? {display: 'none'} : {}}>
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="px-2.5 pt-2 pb-3">
                  <p className="text-xs text-gray-800 dark:text-gray-100 font-medium leading-tight line-clamp-2">
                    {item.name}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {currency}{Math.round(price)}
                    </p>
                    {hasDiscount && (
                      <p className="text-xs text-gray-400 line-through">
                        {currency}{Math.round(comparePrice)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {latestProducts.length > MOBILE_PREVIEW_COUNT && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => setShowAllMobile((v) => !v)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-full active:scale-95 transition-transform"
            >
              {showAllMobile ? 'Show less' : 'Show more'}
              <svg
                className={`w-3.5 h-3.5 transition-transform ${showAllMobile ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Desktop/Tablet: unchanged grid */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            comparePrice={item.comparePrice}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
