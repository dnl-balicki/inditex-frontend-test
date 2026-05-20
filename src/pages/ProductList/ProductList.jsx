import { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import Skeleton from '../../components/Skeleton/Skeleton';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import './ProductList.css';

const PAGE_SIZE = 10;

function ProductList() {
  const { data: products, isLoading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.brand?.toLowerCase().includes(term) ||
      product.model?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (isLoading) {
    return (
      <section className="product-list">
        <div className="list-toolbar">
          <Skeleton className="skeleton-meta" />
          <Skeleton className="skeleton-searchbar" />
        </div>
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <Skeleton className="skeleton-card-image" />
              <div className="skeleton-card-body">
                <Skeleton className="skeleton-card-brand" />
                <Skeleton className="skeleton-card-model" />
                <Skeleton className="skeleton-card-price" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) return <div className="error">{error}</div>;

  return (
    <section className="product-list">
      <div className="list-toolbar">
        <p className="list-meta">{filteredProducts.length} products</p>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="product-grid">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            to={`/product/${product.id}`}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-results">
          <p className="no-results-title">No results found</p>
          <p className="no-results-subtitle">
            No products match &ldquo;{searchTerm}&rdquo;
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="pagination-info">{page} / {totalPages}</span>
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductList;
