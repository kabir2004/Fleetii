import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function MarketingLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="sticky top-0 z-50 w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/fleetiilogolight-removebg-preview.png" alt="Fleetii" className="h-12 object-contain" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Fleetii</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Pricing</Link>
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900 hidden sm:inline-flex">
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild className="bg-gray-900 text-white hover:bg-gray-700 rounded-lg px-4">
              <Link to="/signup">Get started</Link>
            </Button>
            <button
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
            <Link
              to="/pricing"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </Link>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-white mt-0">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <img src="/fleetiilogolight-removebg-preview.png" alt="Fleetii" className="h-12 object-contain" />
                <span className="text-lg font-bold text-gray-900 tracking-tight">Fleetii</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">The financial operating system for trucking companies. Audit every invoice, pay every carrier, track every dollar.</p>
            </div>
            <div className="flex flex-wrap gap-6 md:gap-16">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 tracking-tight mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><Link to="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
                  <li><a href="#" className="hover:text-gray-900 transition-colors">Changelog</a></li>
                  <li><a href="#" className="hover:text-gray-900 transition-colors">Integrations</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 tracking-tight mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><Link to="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
                  <li><a href="#" className="hover:text-gray-900 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 tracking-tight mb-4">Legal</h4>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-gray-900 transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-gray-900 transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Fleetii, Inc. All rights reserved.</p>
            <p className="text-sm text-gray-400">Built for the backbone of America.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
