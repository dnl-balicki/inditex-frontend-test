import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Failed to load products. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.brand?.toLowerCase().includes(term) ||
      product.model?.toLowerCase().includes(term)
    );
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="product-list">
      <div className="list-toolbar">
        <p className="list-meta">{filteredProducts.length} products</p>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
        {filteredProducts.length === 0 && (
          <p className="no-results">No results for &ldquo;{searchTerm}&rdquo;</p>
        )}
      </div>
    </section>
  );
}

export default ProductList;
