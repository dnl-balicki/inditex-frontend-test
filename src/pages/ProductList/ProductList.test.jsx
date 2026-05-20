import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductList from './ProductList';
import * as api from '../../services/api';

vi.mock('../../services/api');

const makeProducts = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    brand: `Brand${i + 1}`,
    model: `Model${i + 1}`,
    price: '100',
    imgUrl: 'https://example.com/img.jpg',
  }));

const renderList = () =>
  render(
    <MemoryRouter>
      <ProductList />
    </MemoryRouter>
  );

describe('ProductList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shouldDisplaySkeletonCardsWhileProductsAreLoading', () => {
    api.getProducts.mockReturnValue(new Promise(() => {}));
    renderList();
    expect(document.querySelectorAll('.skeleton-card')).toHaveLength(8);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shouldRenderAllProductsAfterSuccessfulFetch', async () => {
    api.getProducts.mockResolvedValue(makeProducts(3));
    renderList();
    await waitFor(() => expect(screen.getByText('Brand1')).toBeInTheDocument());
    expect(screen.getByText('Brand2')).toBeInTheDocument();
    expect(screen.getByText('Brand3')).toBeInTheDocument();
  });

  it('shouldShowEmptyStateWhenSearchYieldsNoResults', async () => {
    api.getProducts.mockResolvedValue(makeProducts(3));
    renderList();
    await waitFor(() => screen.getByText('Brand1'));
    fireEvent.change(screen.getByLabelText('Search products'), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('shouldNotShowPaginationWhenProductsFitOnOnePage', async () => {
    api.getProducts.mockResolvedValue(makeProducts(5));
    renderList();
    await waitFor(() => screen.getByText('Brand1'));
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
  });

  it('shouldShowPaginationControlsWhenProductsExceedPageSize', async () => {
    api.getProducts.mockResolvedValue(makeProducts(15));
    renderList();
    await waitFor(() => screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
  });

  it('shouldDisplayOnlyTenProductsOnTheFirstPage', async () => {
    api.getProducts.mockResolvedValue(makeProducts(15));
    renderList();
    await waitFor(() => screen.getByText('Brand1'));
    expect(screen.getAllByRole('link')).toHaveLength(10);
  });

  it('shouldNavigateToTheNextPageWhenNextIsClicked', async () => {
    api.getProducts.mockResolvedValue(makeProducts(15));
    renderList();
    await waitFor(() => screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Brand11')).toBeInTheDocument();
    expect(screen.queryByText('Brand1')).not.toBeInTheDocument();
  });

  it('shouldDisablePreviousButtonOnTheFirstPage', async () => {
    api.getProducts.mockResolvedValue(makeProducts(15));
    renderList();
    await waitFor(() => screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('shouldDisableNextButtonOnTheLastPage', async () => {
    api.getProducts.mockResolvedValue(makeProducts(15));
    renderList();
    await waitFor(() => screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('shouldResetToPageOneWhenTheSearchTermChanges', async () => {
    api.getProducts.mockResolvedValue(makeProducts(15));
    renderList();
    await waitFor(() => screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => screen.getByText('Brand11'));
    fireEvent.change(screen.getByLabelText('Search products'), {
      target: { value: 'Brand' },
    });
    await waitFor(() => screen.getByText('Brand1'));
    expect(screen.queryByText('Brand11')).not.toBeInTheDocument();
  });
});
