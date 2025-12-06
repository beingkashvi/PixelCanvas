"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth, type SavedAddress } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, CreditCard, Truck, ShieldCheck, Trash2 } from 'lucide-react';
import Script from 'next/script';

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, loading: cartLoading } = useCart();
  const { userInfo } = useAuth();
  const router = useRouter();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'saved' | 'new'>('saved');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  // Fetch saved addresses
  useEffect(() => {
    if (userInfo) {
      fetchSavedAddresses();
    }
  }, [userInfo]);

  // Set shippingAddress based on selection/tab change
  useEffect(() => {
    if (activeTab === 'saved' && selectedAddressId) {
      const selected = savedAddresses.find(addr => addr._id === selectedAddressId);
      if (selected) {
        setShippingAddress({
          fullName: selected.fullName,
          addressLine1: selected.addressLine1,
          addressLine2: selected.addressLine2,
          city: selected.city,
          state: selected.state,
          zipCode: selected.zipCode,
          country: selected.country,
          phone: selected.phone,
        });
      }
    } else if (activeTab === 'new' && !selectedAddressId) {
      // Clear shipping address when switching to new address, but only if an address hasn't been started
      if (!shippingAddress.fullName) {
          setShippingAddress({
            fullName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India',
            phone: '',
          });
      }
    }
  }, [activeTab, selectedAddressId, savedAddresses]);

  const fetchSavedAddresses = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/addresses', {
        credentials: 'include',
      });

      if (response.ok) {
        const addresses = await response.json();
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          setSelectedAddressId(addresses[0]._id);
          setActiveTab('saved');
        } else {
            setActiveTab('new');
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Redirect if not logged in
  if (!userInfo && !cartLoading) {
    router.push('/login?redirect=/checkout');
    return null;
  }

  // Redirect if cart is empty
  if (!cartLoading && (!cart || cart.items.length === 0)) {
    router.push('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    if (activeTab === 'saved') {
        setSelectedAddressId(null); // Deselect saved address if user starts editing the form
        setActiveTab('new');
    }
  };

  const handleSelectSavedAddress = (address: SavedAddress) => {
    setSelectedAddressId(address._id);
    setActiveTab('saved');
    // The useEffect above will update shippingAddress
  };

  const handleSaveNewAddress = async (address: ShippingAddress) => {
    try {
      const response = await fetch('http://localhost:5001/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(address),
      });

      if (response.ok) {
        const result = await response.json();
        const newAddresses = [...savedAddresses, result.address];
        setSavedAddresses(newAddresses);
        setSelectedAddressId(result.address._id);
        setActiveTab('saved');
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save address');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const updatedAddresses = savedAddresses.filter(addr => addr._id !== addressId);
        setSavedAddresses(updatedAddresses);
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
          if (updatedAddresses.length > 0) {
              setSelectedAddressId(updatedAddresses[0]._id);
              setActiveTab('saved');
          } else {
              setActiveTab('new');
          }
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const calculateShipping = (itemCount: number) => {
    if (itemCount === 0) return 0;
    if (itemCount === 1) return 50;
    if (itemCount <= 3) return 80;
    return 120;
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.18;
  };

  const itemsTotal = cart?.totalPrice || 0;
  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  const shippingCost = calculateShipping(itemCount);
  const tax = calculateTax(itemsTotal);
  const totalPrice = itemsTotal + shippingCost + tax;

  const validateAddress = (address: ShippingAddress) => {
    return address.fullName && address.addressLine1 && address.city && address.state && address.zipCode && address.phone;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    
    // --- 1. Final Address Validation ---
    let finalAddress: ShippingAddress = shippingAddress;

    if (activeTab === 'saved' && selectedAddressId) {
      const selected = savedAddresses.find(addr => addr._id === selectedAddressId);
      if (selected) {
        finalAddress = {
          fullName: selected.fullName,
          addressLine1: selected.addressLine1,
          addressLine2: selected.addressLine2,
          city: selected.city,
          state: selected.state,
          zipCode: selected.zipCode,
          country: selected.country,
          phone: selected.phone,
        };
      }
    }

    if (!validateAddress(finalAddress)) {
        setError('Please select a saved address or fill in all required fields for the new address.');
        setIsProcessing(false);
        return;
    }
    
    // --- 2. Save new address if checked ---
    if (activeTab === 'new' && saveNewAddress) {
        await handleSaveNewAddress(finalAddress); // Save and continue with checkout
    }

    // --- 3. Proceed to Checkout ---
    try {
      // NOTE: The backend needs the full address (finalAddress) to calculate final tax/shipping if it re-calculates,
      // and it MUST use the user's session/cookie to retrieve the cart.
      const response = await fetch('http://localhost:5001/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // THIS IS KEY for sending session/cookie
        body: JSON.stringify({ shippingAddress: finalAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        // This is where your "No valid items in cart" error likely originates.
        // It means the server couldn't link the session/cart to the user.
        throw new Error(data.error || 'Checkout failed');
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Your Store Name',
        description: 'Order Payment',
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('http://localhost:5001/api/orders/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              router.push(`/checkout/success?order_id=${data.orderId}`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: finalAddress.fullName,
          contact: finalAddress.phone,
        },
        notes: {
          address: `${finalAddress.addressLine1}, ${finalAddress.city}`,
        },
        theme: {
          color: '#8B5CF6',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            router.push(`/checkout/cancel?order_id=${data.orderId}`);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout');
      setIsProcessing(false);
    }
  };

  if (cartLoading || loadingAddresses) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
  ];

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-3 mt-8">
          {/* Left Column - Address Tabs */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Address Tabs */}
              <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-lg border border-purple-100">
                <div className="flex gap-4 mb-6 border-b-2 border-purple-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('saved')}
                    disabled={savedAddresses.length === 0}
                    className={`px-4 py-2 font-semibold transition-colors ${
                      activeTab === 'saved'
                        ? 'border-b-2 border-purple-600 text-purple-600'
                        : 'text-gray-600 hover:text-purple-600'
                    } ${savedAddresses.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Saved Addresses ({savedAddresses.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('new')}
                    className={`px-4 py-2 font-semibold transition-colors ${
                      activeTab === 'new'
                        ? 'border-b-2 border-purple-600 text-purple-600'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    New Address
                  </button>
                </div>

                {/* Saved Addresses Tab */}
                {activeTab === 'saved' && (
                  <div className="space-y-3">
                    {savedAddresses.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No saved addresses yet</p>
                    ) : (
                      savedAddresses.map((address) => (
                        <div
                          key={address._id}
                          onClick={() => handleSelectSavedAddress(address)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedAddressId === address._id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{address.fullName}</p>
                              <p className="text-sm text-gray-600">{address.addressLine1}</p>
                              {address.addressLine2 && (
                                <p className="text-sm text-gray-600">{address.addressLine2}</p>
                              )}
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address._id);
                              }}
                              className="text-red-500 hover:text-red-700 ml-4 p-1 rounded-full hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* New Address Tab */}
                {activeTab === 'new' && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-600">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border-2 border-purple-200 bg-white px-3 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-600">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={shippingAddress.addressLine1}
                        onChange={handleInputChange}
                        required
                        placeholder="House/Flat No., Street name"
                        className="w-full rounded-lg border-2 border-purple-200 bg-white px-3 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-600">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Area, Landmark"
                        className="w-full rounded-lg border-2 border-purple-200 bg-white px-3 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg border-2 border-purple-200 bg-white px-3 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">
                          State *
                        </label>
                        <select
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg border-2 border-purple-200 bg-white px-3 py-3 text-gray-800 focus:border-purple-500 focus:ring-purple-500 transition-colors appearance-none"
                        >
                          <option value="">Select State</option>
                          {indianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={handleInputChange}
                          required
                          pattern="[0-9]{6}"
                          placeholder="e.g. 110001"
                          className="w-full rounded-lg border-2 border-purple-200 bg-white px-3 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleInputChange}
                          required
                          pattern="[0-9]{10}"
                          placeholder="10 digit mobile number"
                          className="w-full rounded-lg border-2 border-purple-200 bg-white px-3 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Save Address Checkbox */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="saveAddress" className="text-sm text-gray-600">
                        Save this address for future use
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-white">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span>Secure checkout powered by Razorpay</span>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500 bg-red-100/50 p-4 text-red-600 font-medium">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || (activeTab === 'saved' && !selectedAddressId)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-lg font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-lg border border-purple-100">
              <h2 className="mb-6 text-xl font-bold text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="mb-6 space-y-4">
                {cart?.items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                      <Image
                        src={item.baseImageUrl}
                        alt={item.productName}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-purple-600">
                        ₹{(item.itemPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 border-t-2 border-purple-100 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{itemsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">₹{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-purple-100 pt-3 text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-purple-600">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}