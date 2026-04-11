import { useState } from 'react';
import { FirebaseUser, db, collection, addDoc, Timestamp } from '../firebase';
import { UserProfile, RiceOrder, PaymentRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ShoppingCart, CheckCircle, ArrowRight, Minus, Plus, Download, CreditCard, ShoppingBasket } from 'lucide-react';
import { simulatePayment } from '../services/paymentService';
import { generateReceiptPDF } from '../services/pdfService';
import { sendCompanyNotification } from '../services/notificationService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface BuyRiceProps {
  user: FirebaseUser;
  profile: UserProfile | null;
}

export default function BuyRice({ user, profile }: BuyRiceProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<{ productId: string; name: string; quantity: number; price: number }[]>([]);
  const navigate = useNavigate();

  const products = [
    { id: 'rice-50kg', name: 'salvagebizhub Premium Rice (50kg)', price: 15000, image: 'https://raw.githubusercontent.com/ghostshadow526/jtech/main/updt3.jpeg' },
    { id: 'rice-25kg', name: 'salvagebizhub Premium Rice (25kg)', price: 8000, image: 'https://raw.githubusercontent.com/ghostshadow526/jtech/main/update%20rice.jpeg' },
    { id: 'rice-10kg', name: 'salvagebizhub Premium Rice (10kg)', price: 5000, image: 'https://raw.githubusercontent.com/ghostshadow526/jtech/main/updt2.jpeg' },
    { id: 'rice-5kg', name: 'salvagebizhub Premium Rice (5kg)', price: 5000, image: 'https://picsum.photos/seed/rice-5kg/400/400' },
  ];

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, price: product.price }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    const existing = cart.find(item => item.productId === productId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(item => item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item));
    } else {
      setCart(cart.filter(item => item.productId !== productId));
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      await simulatePayment(totalAmount, 'Rice Purchase', user.uid, { cart });
      // User is redirected to Korapay. Webhook handles order creation.
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900 mb-0.5 tracking-tight uppercase">Buy salvagebizhub Rice</h1>
        <p className="text-gray-500 text-[11px]">Premium quality, locally grown rice delivered to your doorstep.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Product List */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-green-700">NGN {product.price.toLocaleString()}</p>
                      <button
                        onClick={() => addToCart(product)}
                        className="p-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2 uppercase">
                  <ShoppingCart className="w-6 h-6 text-green-700" />
                  <span>Your Cart</span>
                </h3>

                {cart.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <ShoppingBasket className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="max-h-[300px] overflow-auto space-y-4 pr-2">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex justify-between items-center">
                          <div className="flex-grow">
                            <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">NGN {item.price.toLocaleString()} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => addToCart({ id: item.productId, name: item.name, price: item.price })}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-end mb-6">
                        <span className="text-gray-500 font-bold">Total:</span>
                        <span className="text-2xl font-bold text-green-700">NGN {totalAmount.toLocaleString()}</span>
                      </div>
                      <motion.button
                        onClick={() => setStep(2)}
                        whileHover={{ 
                          borderTopLeftRadius: "2rem",
                          borderBottomRightRadius: "2rem",
                          scale: 1.02
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <span>Checkout</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2 uppercase">
                <CreditCard className="w-6 h-6 text-green-700" />
                <span>Confirm Order & Payment</span>
              </h2>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Order Items</h3>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} x {item.quantity}</span>
                      <span className="font-bold text-gray-900">NGN {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-700">NGN {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <motion.button
                  onClick={handleCheckout}
                  disabled={loading}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? 'Processing Payment...' : 'Pay Now & Place Order'}
                </motion.button>
                <motion.button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Back to Products
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-20 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">Order Placed Successfully!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Thank you for your purchase. Your order is being processed and will be shipped soon. You can download your receipt and track your order in the dashboard.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ 
                  borderTopLeftRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md"
              >
                Go to Dashboard
              </motion.button>
              <motion.button
                onClick={() => setStep(1)}
                whileHover={{ 
                  borderTopLeftRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Buy More Rice
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
