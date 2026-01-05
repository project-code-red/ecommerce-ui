import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">E-Commerce</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your one-stop shop for all your needs. Quality products at great prices.
            </p>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="font-semibold mb-4 text-base">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/categories/men" className="text-gray-300 hover:text-white transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/categories/women" className="text-gray-300 hover:text-white transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/categories/kids" className="text-gray-300 hover:text-white transition-colors">
                  Kids
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Section */}
          <div>
            <h4 className="font-semibold mb-4 text-base">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h4 className="font-semibold mb-4 text-base">About</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

