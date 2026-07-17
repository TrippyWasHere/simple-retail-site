import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const LOGO_URL = "/manus-storage/8DF2EC4B-A4FA-4ED2-ADA9-83293B3C1C61_0cf65313.png";

export default function OrderConfirmed() {
  const [showAdmin, setShowAdmin] = useState(false);
  const orderId = Math.floor(Math.random() * 1000000);

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAdminClick={() => setShowAdmin(true)} logoUrl={LOGO_URL} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="p-12 text-center border-2 border-green-500">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Received!</h1>
          <p className="text-xl text-gray-600 mb-2">Thank you for your order</p>
          <p className="text-lg text-purple-600 font-semibold mb-8">
            Order ID: #{orderId}
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 mb-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Confirmed</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-purple-200">
                <span className="text-gray-600">Status</span>
                <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                  Confirmed
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-purple-200">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">Cryptocurrency</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Steps</span>
                <span className="font-semibold text-gray-900">Awaiting Fulfillment</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We've received your payment and your order is being prepared for shipment. You'll receive a tracking number via email shortly.
          </p>

          <div className="space-y-4">
            <Link href="/products">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8 py-3 text-lg">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
