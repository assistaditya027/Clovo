import { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { PlaceOrderIcon1, PlaceOrderIcon2, PlaceOrderIcon3, PlaceOrderIcon4, PlaceOrderIcon5, PlaceOrderIcon6, PlaceOrderIcon7, PlaceOrderIcon8, PlaceOrderIcon9, PlaceOrderIcon10, PlaceOrderIcon11, PlaceOrderIcon12, PlaceOrderIcon13, PlaceOrderIcon14, PlaceOrderIcon15 } from '../assets/assets';

const inputClass =
  'w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order, dbOrderId) => {
    // ✅ accept dbOrderId
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          if (!backendUrl) {
            toast.error('Backend URL is not configured.');
            return;
          }
          const apiBase = backendUrl.replace(/\/+$/, '');

          const payload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: dbOrderId, // ✅ send DB _id as fallback
          };

          const pollVerify = async (attempt = 0) => {
            const verifyRes = await axios.post(`${apiBase}/api/order/verifyRazorpay`, payload, {
              headers: { token },
              validateStatus: () => true,
            });

            if (verifyRes.status === 202) {
              if (attempt >= 5) {
                toast.info('Payment is processing. Check your orders in a moment.');
                navigate('/orders');
                return;
              }
              setTimeout(() => pollVerify(attempt + 1), 2000);
              return;
            }

            if (verifyRes.data.success) {
              setCartItems({});
              navigate('/orders'); // ✅ redirect
            } else {
              toast.error(verifyRes.data.message || 'Payment verification failed.');
            }
          };

          await pollVerify();
        } catch (error) {
          console.warn(error);
          toast.error(error?.response?.data?.message || error.message || 'Verification failed.');
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      console.warn(response);
      toast.error('Payment failed. Please try again.');
    });
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (!token) {
        toast.error('Please log in to place your order.');
        navigate('/login');
        return;
      }

      if (!orderItems.length) {
        toast.error('Your cart is empty.');
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      const idempotencyKey =
        window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      switch (method) {
        // API calls for COD
        case 'cod': {
          if (!backendUrl) {
            toast.error('Backend URL is not configured.');
            return;
          }

          const apiBase = backendUrl.replace(/\/+$/, '');
          const response = await axios.post(`${apiBase}/api/order/place`, orderData, {
            headers: { token, 'idempotency-key': idempotencyKey },
          });

          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case 'stripe': {
          const apiBase = backendUrl.replace(/\/+$/, '');
          const responseStripe = await axios.post(`${apiBase}/api/order/stripe`, orderData, {
            headers: { token, 'idempotency-key': idempotencyKey },
          });

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }

        case 'razorpay': {
          const apiBase = backendUrl.replace(/\/+$/, '');
          const responseRazorpay = await axios.post(`${apiBase}/api/order/razorpay`, orderData, {
            headers: { token, 'idempotency-key': idempotencyKey },
          });
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order, responseRazorpay.data.orderId); // ✅ pass orderId
          } else {
            toast.error(responseRazorpay.data.message);
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.warn(error);
      toast.error(error?.response?.data?.message || error.message || 'Something went wrong.');
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-100 dark:border-gray-800"
    >
      {/* Left: Delivery Info */}
      <div className="flex flex-col gap-3 w-full sm:max-w-120">
        <div className="text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        {/* Name row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <PlaceOrderIcon1 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            </span>
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              type="text"
              placeholder="First name"
              className={`${inputClass} pl-10`}
            />
          </div>
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <PlaceOrderIcon2 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            </span>
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              type="text"
              placeholder="Last name"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <PlaceOrderIcon3 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </span>
          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            type="email"
            placeholder="Email address"
            className={`${inputClass} pl-10`}
          />
        </div>

        {/* Street */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <PlaceOrderIcon4 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </span>
          <input
            required
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            type="text"
            placeholder="Street Address"
            className={`${inputClass} pl-10`}
          />
        </div>

        {/* City / State */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <PlaceOrderIcon5 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            </span>
            <input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              type="text"
              placeholder="City"
              className={`${inputClass} pl-10`}
            />
          </div>
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <PlaceOrderIcon6 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            </span>
            <input
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              type="text"
              placeholder="State"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Zip / Country */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <PlaceOrderIcon7 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            </span>
            <input
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              type="number"
              placeholder="Zip Code"
              className={`${inputClass} pl-10`}
            />
          </div>
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <PlaceOrderIcon8 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            </span>
            <input
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              type="text"
              placeholder="Country"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <PlaceOrderIcon9 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </span>
          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            type="number"
            placeholder="Phone"
            className={`${inputClass} pl-10`}
          />
        </div>

        <div
          onClick={() => navigate('/cart')}
          className=" mt-4 px-6 py-2.5 flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-600"
        >
          <PlaceOrderIcon10
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
           />

          <span className="text-sm font-medium">Update Products</span>
        </div>
      </div>

      {/* Right: Summary + Payment */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          <div className="flex gap-3 flex-col lg:flex-row mt-4">
            {/* Stripe */}
            <div
              onClick={() => setMethod('stripe')}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition-all duration-150
                ${method === 'stripe' ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}
            >
              <span
                className={`min-w-3.5 h-3.5 border rounded-full transition-colors flex-shrink-0
                ${method === 'stripe' ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}
              />
              <img src={assets.stripe_logo} alt="Stripe" className="h-5 mx-4" />
            </div>

            {/* Razorpay */}
            <div
              onClick={() => setMethod('razorpay')}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition-all duration-150
                ${method === 'razorpay' ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}
            >
              <span
                className={`min-w-3.5 h-3.5 border rounded-full transition-colors flex-shrink-0
                ${method === 'razorpay' ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}
              />
              <img src={assets.razorpay_logo} alt="Razorpay" className="h-5 mx-4" />
            </div>

            {/* COD */}
            <div
              onClick={() => setMethod('cod')}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition-all duration-150
                ${method === 'cod' ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}
            >
              <span
                className={`min-w-3.5 h-3.5 border rounded-full transition-colors flex-shrink-0
                ${method === 'cod' ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}
              />
              <div className="flex items-center gap-2 mx-4">
                <PlaceOrderIcon11
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                 />
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  CASH ON DELIVERY
                </p>
              </div>
            </div>
          </div>

          {/* Selected method info */}
          {method === 'cod' && (
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
              <PlaceOrderIcon12 className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20" />
              Pay when your order arrives. No advance payment needed.
            </p>
          )}
          {method === 'stripe' && (
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
              <PlaceOrderIcon13 className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20" />
              Secured by Stripe. Your card details are never stored.
            </p>
          )}
          {method === 'razorpay' && (
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
              <PlaceOrderIcon14 className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20" />
              Secured by Razorpay. UPI, cards, and wallets accepted.
            </p>
          )}

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              // onClick={() => navigate("/orders")}
              className="bg-black text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 px-16 py-3 text-sm hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 flex items-center gap-2 ml-auto"
            >
              <PlaceOrderIcon15 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
