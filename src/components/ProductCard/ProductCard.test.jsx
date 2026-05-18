import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

const mockProduct = {
  id: '1',
  brand: 'Apple',
  model: 'iPhone 12',
  price: '999',
  imgUrl: 'https://example.com/image.jpg',
};

describe('ProductCard', () => {
  it('renders brand, model and price', () => {
    render(<ProductCard product={mockProduct} onClick={() => {}} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 12')).toBeInTheDocument();
    expect(screen.getByText('999 EUR')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ProductCard product={mockProduct} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows N/A when price is absent', () => {
    render(<ProductCard product={{ ...mockProduct, price: null }} onClick={() => {}} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
