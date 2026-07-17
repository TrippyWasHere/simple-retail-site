import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Edit2, ArrowLeft, CheckCircle } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { toast } from "sonner";

export default function Checkout() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [, setLocation] = useLocation();
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    const id = localStorage.getItem("sessionId") || Math.random().toString(36);
    localStorage.setItem("sessionId", id);
    setSessionId(id);
  }, []);

  const { data: cartItems } = trpc.cart.getItems.useQuery(sessionId, {
    enabled: !!sessionId,
  });

  const createOrderMutation = trpc.orders.create.useMutation();

  const subtotal =
    cartItems?.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0;
  const total = subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.name || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        sessionId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || 0,
        })),
        total,
      });

      setOrderId(result.orderId);
      setOrderConfirmed(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  if (orderConfirmed && orderId) {
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

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle size={64} className="text-green-600" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 text-lg">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </div>

            <Card className="p-8 bg-gray-50">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-semibold text-gray-900">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Email</span>
                  <span className="font-semibold text-gray-900">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-green-600">Confirmed</span>
                </div>
              </div>
            </Card>

            <p className="text-gray-600">
              A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>

            <div className="space-y-3 pt-4">
              <Link href="/products">
                <a>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800">Continue Shopping</Button>
                </a>
              </Link>
              <Link href="/">
                <a>
                  <Button variant="outline" className="w-full">
                    Return to Home
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Modal */}
        <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />
      </div>
    );
  }

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
          onClick={() => setLocation("/cart")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="NY"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        type="text"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={createOrderMutation.isPending}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg"
                >
                  {createOrderMutation.isPending ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cartItems?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

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

              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />
    </div>
  );
}
