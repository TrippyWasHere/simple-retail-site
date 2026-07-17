import { Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-100 to-orange-50 border-t border-purple-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-2">
              Sublime Science
            </h3>
            <p className="text-gray-600">
              Premium scientific products and tools for the discerning researcher.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="/products" className="hover:text-purple-600 transition">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-purple-600 transition">
                  About
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-purple-600 transition">
                  Cart
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Contact</h4>
            <div className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition">
              <Mail size={20} />
              <a href="mailto:SublimeScience@protonmail.com">
                SublimeScience@protonmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-200 pt-8">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span>Made with</span>
            <Heart size={18} className="text-red-500" />
            <span>by Sublime Science</span>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            © 2026 Sublime Science. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
