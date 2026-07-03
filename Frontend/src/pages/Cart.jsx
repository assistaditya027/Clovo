import { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { CartIcon1, CartIcon2 } from '../assets/assets';
import { buildCloudinarySrcSet, transformCloudinaryUrl } from '../utils/cloudinary';

const Cart = () => {
  const { cartItems, products, currency, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    if (!cartItems || typeof cartItems !== 'object') {
      setCartData([]);
      return;
    }

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  const itemCount = cartData.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-14 min-h-[60vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-2xl">
          <Title text1={'YOUR'} text2={'CART'} />
        </div>
        {itemCount > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {/* Empty State */}
      {cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
            <CartIcon1
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
             />
          </div>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Your cart is empty</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add items to get started</p>
          <button
            onClick={() => navigate('/collection')}
            className="mt-4 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Column Headers */}
          <div className="hidden sm:grid grid-cols-[4fr_1fr_1fr_0.5fr] gap-4 px-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs uppercase tracking-widest text-gray-400">Product</p>
            <p className="text-xs uppercase tracking-widest text-gray-400">Qty</p>
            <p className="text-xs uppercase tracking-widest text-gray-400">Subtotal</p>
            <span />
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {cartData.map((item, index) => {
              const productData = products?.find((product) => product._id === item._id) || null;

              if (!productData) {
                return (
                  <div key={index} className="py-5 text-gray-400 dark:text-gray-600 text-sm italic">
                    Product no longer available
                  </div>
                );
              }

              const lineTotal = (Number(productData.price || 0) * item.quantity).toFixed(2);

              return (
                <div
                  key={index}
                  className="py-5 text-gray-700 dark:text-gray-300 grid grid-cols-[4fr_0.5fr_1fr_0.5fr] sm:grid-cols-[4fr_1fr_1fr_0.5fr] gap-4 items-center group transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/40 rounded-lg px-2 -mx-2"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0 overflow-hidden rounded bg-gray-50 dark:bg-gray-800">
                      <img
                        className="w-16 sm:w-20 h-20 sm:h-24 object-cover"
                        src={transformCloudinaryUrl(productData.image[0], { width: 320 })}
                        srcSet={buildCloudinarySrcSet(productData.image[0], [160, 240, 320, 480], { crop: 'fill' })}
                        sizes="80px"
                        alt={productData.name ?? ''}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {currency}
                          {Number(productData.price).toFixed(2)}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                          {item.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="flex items-center gap-1 ">
                    <button
                      onClick={() => {
                        if (item.quantity > 1)
                          updateQuantity(item._id, item.size, item.quantity - 1);
                      }}
                      className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors rounded text-base leading-none select-none"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-9 h-7 text-center text-sm rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 1) updateQuantity(item._id, item.size, value);
                      }}
                    />
                    <button
                      onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors rounded text-base leading-none select-none"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {currency}
                    {lineTotal}
                  </p>

                  {/* Delete */}
                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="justify-self-end p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group/del"
                    aria-label="Remove item"
                  >
                    <img
                      className="w-4 sm:w-4.5 opacity-40 group-hover/del:opacity-80 transition-opacity"
                      src={assets.bin_icon}
                      alt="Remove"
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-10 mt-12 mb-20">
            {/* Continue shopping */}
            <button
              onClick={() => navigate('/collection')}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
            >
              <CartIcon2
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
               />
              Continue Shopping
            </button>

            {/* Order summary */}
            <div className="w-full sm:w-96">
              <CartTotal />
              <div className="w-full text-end mt-6">
                <button
                  onClick={() => navigate('/place-order')}
                  className="w-full sm:w-auto bg-black text-white dark:bg-white dark:text-gray-900 text-sm font-medium px-10 py-3.5 hover:opacity-80 transition-opacity tracking-wide"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
