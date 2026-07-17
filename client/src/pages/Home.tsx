import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import AdminModal from "@/components/AdminModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const LOGO_URL = "/manus-storage/8DF2EC4B-A4FA-4ED2-ADA9-83293B3C1C61_0cf65313.png";

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { data: featuredProducts, isLoading } = trpc.products.featured.useQuery();

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAdminClick={() => setShowAdmin(true)} logoUrl={LOGO_URL} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-orange-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                <span className="text-gray-900">Discover</span> <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Innovation</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Explore our curated collection of premium scientific products and tools designed for the discerning researcher and enthusiast.
              </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8 py-3 text-lg">
                Explore Collection
              </Button>
            </Link>
            </div>
            <div className="flex justify-center">
              <img src={LOGO_URL} alt="Sublime Science" className="h-80 w-auto drop-shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked selections from our finest offerings
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-96 bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
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
          )}

          <div className="text-center mt-12">
          <Link href="/products">
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg"
            >
              View All Products
            </Button>
          </Link>
          </div>
        </div>
      </section>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
