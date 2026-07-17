import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Copy, Check } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/8DF2EC4B-A4FA-4ED2-ADA9-83293B3C1C61_0cf65313.png";

const BITCOIN_ADDRESS = "bc1qrgm8vhda5atc69eqakzgna6lnq4m6jh0qu9ng9";
const MONERO_ADDRESS = "8AQD5m8gtCp7W2x6G8y5uQLRYWQNPfuLC5UUmugxQ2xY1LH6TP49LeRWCEBXqQ7CawFZfUZYHtnsqiQpEZVds2h4QF3VwuM";

export default function Payment() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [, setLocation] = useLocation();
  const [selectedCrypto, setSelectedCrypto] = useState<"bitcoin" | "monero" | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const id = localStorage.getItem("sessionId") || Math.random().toString(36);
    localStorage.setItem("sessionId", id);
    setSessionId(id);

    // Get total from sessionStorage (passed from checkout)
    const storedTotal = sessionStorage.getItem("checkoutTotal");
    if (storedTotal) {
      setTotal(parseFloat(storedTotal));
    }
  }, []);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handlePaid = () => {
    setLocation("/order-confirmed");
  };

  const cryptoAddress = selectedCrypto === "bitcoin" ? BITCOIN_ADDRESS : MONERO_ADDRESS;
  const cryptoSymbol = selectedCrypto === "bitcoin" ? "BTC" : "XMR";

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAdminClick={() => setShowAdmin(true)} logoUrl={LOGO_URL} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/checkout">
          <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition">
            <ArrowLeft size={18} />
            Back to Checkout
          </button>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Payment Options</h1>

        {/* Total Display */}
        <Card className="p-8 border border-purple-200 mb-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Order Total</p>
            <p className="text-5xl font-bold text-purple-600">
              ${total.toFixed(2)}
            </p>
          </div>
        </Card>

        {/* Cryptocurrency Options */}
        <div className="space-y-6">
          {/* Bitcoin Option */}
          <Card className="p-6 border border-purple-200">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="checkbox"
                id="bitcoin"
                checked={selectedCrypto === "bitcoin"}
                onChange={() => setSelectedCrypto(selectedCrypto === "bitcoin" ? null : "bitcoin")}
                className="w-6 h-6 cursor-pointer accent-purple-600"
              />
              <label htmlFor="bitcoin" className="flex-grow cursor-pointer">
                <h3 className="text-xl font-bold text-gray-900">Bitcoin</h3>
                <p className="text-sm text-gray-600">Pay with Bitcoin (BTC)</p>
              </label>
            </div>

            {selectedCrypto === "bitcoin" && (
              <div className="mt-6 space-y-4 bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Amount in Bitcoin</p>
                  <div className="bg-white border border-purple-300 rounded-lg p-4">
                    <p className="text-2xl font-bold text-purple-600">
                      {(total / 43000).toFixed(6)} BTC
                    </p>
                    <p className="text-xs text-gray-500 mt-1">(Approximate rate: $43,000 per BTC)</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Send to this address:</p>
                  <div className="flex gap-2">
                    <Input
                      value={BITCOIN_ADDRESS}
                      readOnly
                      className="border-purple-300 font-mono text-xs"
                    />
                    <Button
                      onClick={() => handleCopyAddress(BITCOIN_ADDRESS)}
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      {copiedAddress ? <Check size={18} /> : <Copy size={18} />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Monero Option */}
          <Card className="p-6 border border-purple-200">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="checkbox"
                id="monero"
                checked={selectedCrypto === "monero"}
                onChange={() => setSelectedCrypto(selectedCrypto === "monero" ? null : "monero")}
                className="w-6 h-6 cursor-pointer accent-purple-600"
              />
              <label htmlFor="monero" className="flex-grow cursor-pointer">
                <h3 className="text-xl font-bold text-gray-900">Monero</h3>
                <p className="text-sm text-gray-600">Pay with Monero (XMR)</p>
              </label>
            </div>

            {selectedCrypto === "monero" && (
              <div className="mt-6 space-y-4 bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Amount in Monero</p>
                  <div className="bg-white border border-purple-300 rounded-lg p-4">
                    <p className="text-2xl font-bold text-purple-600">
                      {(total / 150).toFixed(4)} XMR
                    </p>
                    <p className="text-xs text-gray-500 mt-1">(Approximate rate: $150 per XMR)</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Send to this address:</p>
                  <div className="flex gap-2">
                    <Input
                      value={MONERO_ADDRESS}
                      readOnly
                      className="border-purple-300 font-mono text-xs"
                    />
                    <Button
                      onClick={() => handleCopyAddress(MONERO_ADDRESS)}
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      {copiedAddress ? <Check size={18} /> : <Copy size={18} />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* I Have Paid Button */}
        {selectedCrypto && (
          <div className="mt-8">
            <Button
              onClick={handlePaid}
              className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white py-3 text-lg"
            >
              I Have Paid
            </Button>
          </div>
        )}
      </div>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
