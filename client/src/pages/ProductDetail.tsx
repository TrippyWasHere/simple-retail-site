import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/8DF2EC4B-A4FA-4ED2-ADA9-83293B3C1C61_0cf65313.png";

export default function ProductDetail() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/product/:id");

  const productId = params?.id ? parseInt(params.id) : null;
  const { data: product, isLoading } = trpc.products.getById.useQuery(productId || 0, {
    enabled: !!productId,
  });

  const addToCartMutation = trpc.cart.addItem.useMutation();

  const handleAddToCart = async () => {
    const sessionId = localStorage.getItem("sessionId") || Math.random().toString(36);
    localStorage.setItem("sessionId", sessionId);

    try {
      await addToCartMutation.mutateAsync({
        sessionId,
        productId: product!.id,
        quantity,
      });
      toast.success(`${product!.name} added to cart!`);
      setQuantity(1);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (!match) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAdminClick={() => setShowAdmin(true)} logoUrl={LOGO_URL} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/products">
          <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition">
            <ArrowLeft size={18} />
            Back to Products
          </button>
        </Link>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 bg-gray-100 rounded animate-pulse" />
              <div className="h-32 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl || ""}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-purple-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Stock Available</p>
                <p className="text-3xl font-bold text-purple-600">{product.stock} units</p>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-lg font-semibold text-gray-900">Quantity:</label>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border-purple-300"
                  />
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || product.stock === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white py-3 text-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>

              {/* Product Info */}
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Category</p>
                    <p className="font-semibold text-gray-900">Premium Collection</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Featured</p>
                    <p className="font-semibold text-gray-900">
                      {product.featured ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Product not found</p>
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
