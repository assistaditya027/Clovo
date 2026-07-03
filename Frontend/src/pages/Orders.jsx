import { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { buildCloudinarySrcSet, transformCloudinaryUrl } from '../utils/cloudinary';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  const fmtDateTime = (ts) =>
    new Date(ts).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const loadOrderData = useCallback(async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        const allOrderItem = [];
        response.data.orders.forEach((order) => {
          (order.items || []).forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrderItem.push(item);
          });
        });
        setOrderData(allOrderItem.reverse());
      }
    } catch (error) {
      console.warn(error);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-16">
      <div className="text-2xl">
        <Title text1={'MY '} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col border-t border-b border-gray-100 dark:border-gray-800 py-4 md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                src={transformCloudinaryUrl(item.image[0], { width: 320 })}
                srcSet={buildCloudinarySrcSet(item.image[0], [160, 240, 320, 480], { crop: 'fill' })}
                sizes="80px"
                alt=""
                className="w-16 sm:w-20"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="font-medium sm:text-base">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700 dark:text-gray-300">
                  <p className="text-lg">
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="mt-1">
                  Date:{' '}
                  <span className="text-gray-400 dark:text-gray-500">{fmtDateTime(item.date)}</span>
                </p>
                <p className="mt-1">
                  Payment:{' '}
                  <span className="text-gray-400 dark:text-gray-500">{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium rounded-sm hover:border-black dark:hover:border-white transition-colors"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
