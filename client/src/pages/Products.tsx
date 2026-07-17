import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Edit2 } from "lucide-react";
import AdminModal from "@/components/AdminModal";

export default function Products() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: allProducts, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  const filteredProducts = selectedCategory
    ? allProducts?.filter((p) => p.categoryId === selectedCategory)
    : allProducts;

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
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Collection
          </h1>
          <p className="text-lg text-gray-600">
            Browse our carefully curated selection of premium products
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedCategory === null
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Products
                </button>
                {categoriesLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  categories?.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === category.id
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {productsLoading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />
    </div>
  );
}
