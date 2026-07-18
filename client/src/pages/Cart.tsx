import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Trash2, ArrowLeft } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/8DF2EC4B-A4FA-4ED2-ADA9-83293B3C1C61_0cf65313.png";

export default function Cart() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const id = localStorage.getItem("sessionId") || Math.random().toString(36);
    localStorage.setItem("sessionId", id);
    setSessionId(id);
  }, []);

  const { data: cartItems, refetch } = trpc.cart.getItems.useQuery(sessionId, {
    enabled: !!sessionId,
  });

  const removeFromCartMutation = trpc.cart.removeItem.useMutation();
  const updateCartMutation = trpc.cart.updateItem.useMutation();

  const handleRemove = async (productId: number) => {
    try {
      await removeFromCartMutation.mutateAsync({ sessionId, productId });
      refetch();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    try {
      await updateCartMutation.mutateAsync({ sessionId, productId, quantity });
      refetch();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const subtotal =
    cartItems?.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAdminClick={() => setShowAdmin(true)} logoUrl={LOGO_URL} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/products">
          <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition">
            <ArrowLeft size={18} />
            Continue Shopping
          </button>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Shopping Cart</h1>

        {!cartItems || cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white">
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.productId} className="p-6 border border-purple-100">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.imageUrl || ""}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.product?.name}
                      </h3>
                      <p className="text-purple-600 font-semibold mb-4">
                        ${item.product?.price.toFixed(2)}
                      </p>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-4">
                        <label className="text-sm text-gray-600">Qty:</label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.productId,
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-16 text-center border-purple-300"
                        />
                        <p className="text-sm text-gray-600">
                          Subtotal: ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card className="p-8 border border-purple-200 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(subtotal * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-purple-600">
                    ${(subtotal * 1.1).toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white py-3 text-lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />

      {/* Footer */}
      <Footer onAdminClick={() => setShowAdmin(true)} />
    </div>
  );
}
