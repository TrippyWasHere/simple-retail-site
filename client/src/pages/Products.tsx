import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import AdminModal from "@/components/AdminModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const LOGO_URL = "/manus-storage/8DF2EC4B-A4FA-4ED2-ADA9-83293B3C1C61_0cf65313.png";

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
      <Navigation onAdminClick={() => setShowAdmin(true)} logoUrl={LOGO_URL} />

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
            <div className="bg-white rounded-lg border border-purple-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedCategory === null
                      ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white font-medium"
                      : "text-gray-700 hover:bg-purple-50"
                  }`}
                >
                  All Products
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white font-medium"
                        : "text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="h-96 bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={product.imageUrl || ""}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-2xl font-bold text-purple-600">
                              ${product.price.toFixed(2)}
                            </span>
                            <Button
                              variant="outline"
                              className="border-purple-600 text-purple-600 hover:bg-purple-50"
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found in this category.</p>
              </div>
            )}
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
