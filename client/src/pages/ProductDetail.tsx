import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Edit2, ArrowLeft } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { toast } from "sonner";

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
          Back to Products
        </button>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-100 rounded-lg h-96 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
              <div className="h-32 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">📦</div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 text-sm font-medium">Price</p>
                <p className="text-5xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 text-sm font-medium">Stock</p>
                <p className="text-lg text-gray-900">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-semibold">In Stock ({product.stock})</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  )}
                </p>
              </div>

              {product.stock > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Quantity</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        −
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(product.stock, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg"
                  >
                    {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              )}
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
    </div>
  );
}
