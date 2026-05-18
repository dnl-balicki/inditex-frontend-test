import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

function Header() {
  const { cartCount } = useCart();
  const location = useLocation();
  const isDetail = location.pathname.startsWith('/product/');

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">MobileShop</Link>
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link to="/" className="breadcrumbs-home">Home</Link>
          {isDetail && (
            <>
              <span className="breadcrumbs-separator" aria-hidden="true">/</span>
              <span className="breadcrumbs-current">Product</span>
            </>
          )}
        </nav>
      </div>
      <div className="header-cart" role="status" aria-label={`Cart: ${cartCount} items`}>
        <svg
          className="cart-icon"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <span className="cart-count">{cartCount}</span>
      </div>
    </header>
  );
}

export default Header;
