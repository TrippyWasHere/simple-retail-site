import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Heart } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const LOGO_URL = "/manus-storage/8DF2EC4B-A4FA-4ED2-ADA9-83293B3C1C61_0cf65313.png";

export default function About() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAdminClick={() => setShowAdmin(true)} logoUrl={LOGO_URL} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Sublime Science</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dedicated to bringing premium scientific products and tools to researchers, enthusiasts, and innovators worldwide.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 border border-purple-200 hover:shadow-lg transition">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4 rounded-full">
                <Target className="text-white" size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Our Mission</h3>
            <p className="text-gray-600 text-center">
              To provide access to the finest scientific instruments and products that empower discovery and innovation.
            </p>
          </Card>

          <Card className="p-8 border border-purple-200 hover:shadow-lg transition">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4 rounded-full">
                <Sparkles className="text-white" size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Our Vision</h3>
            <p className="text-gray-600 text-center">
              To be the trusted source for premium scientific products that inspire and enable groundbreaking research.
            </p>
          </Card>

          <Card className="p-8 border border-purple-200 hover:shadow-lg transition">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4 rounded-full">
                <Heart className="text-white" size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Our Values</h3>
            <p className="text-gray-600 text-center">
              Quality, integrity, and a passion for supporting the scientific community in their pursuit of excellence.
            </p>
          </Card>
        </div>

        {/* Story Section */}
        <Card className="p-12 border border-purple-200 mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              Sublime Science was founded with a simple vision: to make premium scientific products accessible to everyone who shares a passion for discovery and innovation. We believe that great science deserves great tools.
            </p>
            <p>
              Our carefully curated collection features only the finest instruments and products from trusted manufacturers around the world. Each item in our catalog has been selected for its quality, precision, and contribution to scientific advancement.
            </p>
            <p>
              Whether you're a professional researcher, a student, or an enthusiast, we're committed to providing you with the products you need to pursue your scientific goals. Our team is dedicated to exceptional customer service and ensuring your complete satisfaction.
            </p>
            <p>
              We also embrace modern payment methods, including cryptocurrency, to provide our global community with flexible and secure transaction options.
            </p>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Explore?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our collection of premium scientific products and discover the tools that will elevate your research.
          </p>
          <Link href="/products">
            <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8 py-3 text-lg">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Modal */}
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
