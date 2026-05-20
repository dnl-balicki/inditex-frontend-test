import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

const mockProduct = {
  id: '1',
  brand: 'Apple',
  model: 'iPhone 12',
  price: '999',
  imgUrl: 'https://example.com/image.jpg',
};

const renderCard = (overrides = {}) =>
  render(
    <MemoryRouter>
      <ProductCard product={mockProduct} to="/product/1" {...overrides} />
    </MemoryRouter>
  );

describe('ProductCard', () => {
  it('renders brand, model and price', () => {
    renderCard();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 12')).toBeInTheDocument();
    expect(screen.getByText('999 EUR')).toBeInTheDocument();
  });

  it('renders as a navigation link pointing to the product route', () => {
    renderCard();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/product/1');
  });

  it('shows N/A when price is absent', () => {
    renderCard({ product: { ...mockProduct, price: null } });
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
