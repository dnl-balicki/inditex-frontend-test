import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useCart } from '../../hooks/useCart';
import Skeleton from '../../components/Skeleton/Skeleton';
import './ProductDetail.css';

const SPEC_ROWS = [
  { key: 'cpu',              label: 'CPU'          },
  { key: 'ram',              label: 'RAM'          },
  { key: 'os',               label: 'OS'           },
  { key: 'displayResolution', label: 'Screen'      },
  { key: 'battery',          label: 'Battery'      },
  { key: 'primaryCamera',    label: 'Camera'       },
  { key: 'secondaryCmera',   label: 'Front Camera' },
  { key: 'dimentions',       label: 'Dimensions'   },
  { key: 'weight',           label: 'Weight'       },
];

const formatSpec = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  return value ?? '—';
};

function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProductDetail(id);
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [cartError, setCartError] = useState(null);
  const [cartSuccess, setCartSuccess] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (product?.options?.colors?.length > 0) {
      setSelectedColor(String(product.options.colors[0].code));
    }
    if (product?.options?.storages?.length > 0) {
      setSelectedStorage(String(product.options.storages[0].code));
    }
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToCart(id, Number(selectedColor), Number(selectedStorage));
      setCartError(null);
      clearTimeout(toastTimer.current);
      setCartSuccess(true);
      toastTimer.current = setTimeout(() => setCartSuccess(false), 3000);
    } catch {
      setCartError('Could not add to cart. Please try again.');
      setCartSuccess(false);
    }
  };

  if (isLoading) {
    return (
      <section className="product-detail">
        <Skeleton className="skeleton-back-link" />
        <div className="detail-content">
          <Skeleton className="skeleton-detail-image" />
          <div className="detail-info">
            <div className="product-heading">
              <Skeleton className="skeleton-detail-brand" />
              <Skeleton className="skeleton-detail-model" />
              <Skeleton className="skeleton-detail-price" />
            </div>
            <div className="skeleton-spec-table">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="skeleton-spec-row" />
              ))}
            </div>
            <Skeleton className="skeleton-add-btn" />
          </div>
        </div>
      </section>
    );
  }

  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  return (
    <section className="product-detail">
      <Link to="/" className="back-link">&#8592; Back</Link>

      <div className="detail-content">
        <div className="detail-image">
          <img
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
            loading="lazy"
          />
        </div>

        <div className="detail-info">
          <div className="product-heading">
            <p className="product-heading-brand">{product.brand}</p>
            <h1 className="product-heading-model">{product.model}</h1>
            <p className="product-heading-price">{product.price} EUR</p>
          </div>

          <div className="spec-table">
            {SPEC_ROWS.filter(({ key }) => product[key] !== undefined).map(({ key, label }) => (
              <div key={key} className="spec-row">
                <span className="spec-key">{label}</span>
                <span className="spec-val">{formatSpec(product[key])}</span>
              </div>
            ))}
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

      {cartSuccess && (
        <div className="toast" role="status" aria-live="polite">
          Added to cart
        </div>
      )}
    </section>
  );
}

export default ProductDetail;
