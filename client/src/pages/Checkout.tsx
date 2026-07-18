import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/8DF2EC4B-A4FA-4ED2-ADA9-83293B3C1C61_0cf65313.png";

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
  const shipping = 15;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shipping;

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
      console.log("Creating order with:", { sessionId, items: cartItems, total });
      const result = await createOrderMutation.mutateAsync({
        sessionId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || 0,
        })),
        total,
      });

      console.log("Order created:", result);
      sessionStorage.setItem("checkoutTotal", total.toString());
      toast.success("Proceeding to payment...");
      setLocation("/payment");
    } catch (error) {
      console.error("Order creation error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to place order: ${errorMessage}`);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation onAdminClick={() => setShowAdmin(true)} logoUrl={LOGO_URL} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="p-12 text-center border-2 border-green-500">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-2">Thank you for your purchase</p>
            <p className="text-lg text-purple-600 font-semibold mb-8">
              Order ID: #{orderId}
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-purple-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-purple-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>
            </p>

            <Link href="/products">
              <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8 py-3 text-lg">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>

        <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAdminClick={() => setShowAdmin(true)} logoUrl={LOGO_URL} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/cart">
          <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition">
            <ArrowLeft size={18} />
            Back to Cart
          </button>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <Card className="p-8 border border-purple-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="border-purple-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="border-purple-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St"
                    className="border-purple-300"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="New York"
                      className="border-purple-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="NY"
                      className="border-purple-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      placeholder="10001"
                      className="border-purple-300"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white py-3 text-lg rounded-lg font-semibold transition-all"
                  >
                    {createOrderMutation.isPending ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="p-8 border border-purple-200 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cartItems?.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping (USPS Priority)</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-purple-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
