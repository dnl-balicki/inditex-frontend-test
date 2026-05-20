import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product, to }) {
  return (
    <Link to={to} className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.imgUrl}
          alt={`${product.brand} ${product.model}`}
          className="product-card-image"
          loading="lazy"
        />
      </div>
      <div className="product-card-info">
        <p className="product-brand">{product.brand}</p>
        <p className="product-model">{product.model}</p>
        <p className="product-price">{product.price ? `${product.price} EUR` : 'N/A'}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
