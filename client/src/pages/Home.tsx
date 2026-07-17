import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Edit2 } from "lucide-react";
import AdminModal from "@/components/AdminModal";

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { data: featuredProducts, isLoading } = trpc.products.featured.useQuery();

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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Curated Excellence
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover a carefully selected collection of premium products designed for the discerning customer.
                </p>
              </div>
              <div className="flex gap-4">
                <Link href="/products">
                  <a>
                    <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                      Explore Collection
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-gray-600 font-medium">Premium Products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked selections from our finest offerings
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <a>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
                      <div className="bg-gray-100 h-64 flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-4xl">📦</div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/products">
              <a>
                <Button variant="outline" size="lg">
                  View All Products
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />
    </div>
  );
}
