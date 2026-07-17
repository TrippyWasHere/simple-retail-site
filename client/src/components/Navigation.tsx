import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Edit2, Menu, X } from "lucide-react";

interface NavigationProps {
  onAdminClick: () => void;
  logoUrl?: string;
}

export default function Navigation({ onAdminClick, logoUrl }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          {logoUrl && (
            <img src={logoUrl} alt="Sublime Science" className="h-10 w-auto" />
          )}
          <Link href="/">
            <a className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent hover:opacity-80 transition">
              Sublime Science
            </a>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products">
            <a className="text-gray-700 hover:text-purple-600 font-medium transition">
              Shop
            </a>
          </Link>
          <Link href="/cart">
            <a className="text-gray-700 hover:text-purple-600 font-medium transition flex items-center gap-2">
              <ShoppingCart size={18} />
              Cart
            </a>
          </Link>
          <button
            onClick={onAdminClick}
            className="p-2 text-gray-600 hover:text-purple-600 transition"
            title="Admin"
          >
            <Edit2 size={18} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={onAdminClick}
            className="p-2 text-gray-600 hover:text-purple-600 transition"
            title="Admin"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-purple-600 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-200">
          <div className="px-4 py-4 space-y-3">
            <Link href="/">
              <a
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium"
              >
                Home
              </a>
            </Link>
            <Link href="/products">
              <a
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium"
              >
                Shop
              </a>
            </Link>
            <Link href="/cart">
              <a
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium flex items-center gap-2"
              >
                <ShoppingCart size={18} />
                Cart
              </a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
