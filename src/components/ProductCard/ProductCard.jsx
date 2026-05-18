import './ProductCard.css';

function ProductCard({ product, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') onClick();
  };

  return (
    <div
      className="product-card"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="product-card-image-wrapper">
        <img
          src={product.imgUrl}
          alt={`${product.brand} ${product.model}`}
          className="product-card-image"
        />
      </div>
      <div className="product-card-info">
        <p className="product-brand">{product.brand}</p>
        <p className="product-model">{product.model}</p>
        <p className="product-price">{product.price ? `${product.price} EUR` : 'N/A'}</p>
      </div>
    </div>
  );
}

export default ProductCard;
