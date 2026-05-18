import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, addToCart } from '../../services/api';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [cartError, setCartError] = useState(null);
  const { updateCartCount } = useCart();

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        setProduct(data);
        if (data.options?.colors?.length > 0) {
          setSelectedColor(String(data.options.colors[0].code));
        }
        if (data.options?.storages?.length > 0) {
          setSelectedStorage(String(data.options.storages[0].code));
        }
      })
      .catch(() => setError('Failed to load product. Please try again later.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(id, Number(selectedColor), Number(selectedStorage));
      updateCartCount(result.count);
      setCartError(null);
    } catch {
      setCartError('Could not add to cart. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  const cameras = Array.isArray(product.primaryCamera)
    ? product.primaryCamera.join(', ')
    : product.primaryCamera;

  return (
    <section className="product-detail">
      <Link to="/" className="back-link">&#8592; Back</Link>

      <div className="detail-content">
        <div className="detail-image">
          <img src={product.imgUrl} alt={`${product.brand} ${product.model}`} />
        </div>

        <div className="detail-info">
          <div className="product-heading">
            <p className="product-heading-brand">{product.brand}</p>
            <h1 className="product-heading-model">{product.model}</h1>
            <p className="product-heading-price">{product.price} EUR</p>
          </div>

          <div className="spec-table">
            <div className="spec-row">
              <span className="spec-key">CPU</span>
              <span className="spec-val">{product.cpu}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">RAM</span>
              <span className="spec-val">{product.ram}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">OS</span>
              <span className="spec-val">{product.os}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">Screen</span>
              <span className="spec-val">{product.displayResolution}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">Battery</span>
              <span className="spec-val">{product.battery}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">Camera</span>
              <span className="spec-val">{cameras} / {product.secondaryCmera}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">Dimensions</span>
              <span className="spec-val">{product.dimentions}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">Weight</span>
              <span className="spec-val">{product.weight}</span>
            </div>
          </div>

          <div className="detail-actions">
            {product.options?.storages?.length > 0 && (
              <div className="option-group">
                <p className="option-label">Storage</p>
                <div className="option-buttons">
                  {product.options.storages.map((s) => (
                    <button
                      key={s.code}
                      className={`option-btn${selectedStorage === String(s.code) ? ' option-btn--active' : ''}`}
                      onClick={() => setSelectedStorage(String(s.code))}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.options?.colors?.length > 0 && (
              <div className="option-group">
                <p className="option-label">Color</p>
                <div className="option-buttons">
                  {product.options.colors.map((c) => (
                    <button
                      key={c.code}
                      className={`option-btn${selectedColor === String(c.code) ? ' option-btn--active' : ''}`}
                      onClick={() => setSelectedColor(String(c.code))}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cartError && <p className="cart-error">{cartError}</p>}

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
