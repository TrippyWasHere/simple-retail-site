import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Edit2, Trash2, ArrowLeft } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { toast } from "sonner";

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
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition">
                Elegance
              </a>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/products">
                <a className="text-gray-700 hover:text-gray-900 font-medium transition">
                  Shop
                </a>
              </Link>
              <Link href="/cart">
                <a className="text-gray-700 hover:text-gray-900 font-medium transition flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Cart
                </a>
              </Link>
            </div>
          </div>
          <button
            onClick={() => setShowAdmin(true)}
            className="p-2 text-gray-600 hover:text-gray-900 transition"
            title="Admin"
          >
            <Edit2 size={18} />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => setLocation("/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </button>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Shopping Cart</h1>

        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <Link href="/products">
              <a>
                <Button className="bg-gray-900 hover:bg-gray-800">Continue Shopping</Button>
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-2xl">📦</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.product?.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{item.product?.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                          >
                            −
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                Math.min(item.product?.stock || 1, item.quantity + 1)
                              )
                            }
                          >
                            +
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium mt-2 flex items-center gap-1 ml-auto"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card className="p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-900">Free</span>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <Link href="/checkout">
                  <a>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6">
                      Proceed to Checkout
                    </Button>
                  </a>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />
    </div>
  );
}
