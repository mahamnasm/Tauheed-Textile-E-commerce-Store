import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { mockProduct, mockCollection } = vi.hoisted(() => {
  const p = {
    id: 'prod-101',
    title: 'Chiffon Silk Kurta',
    slug: 'chiffon-silk-kurta-101',
    sku: 'TT-CHF-101',
    basePrice: 9500,
    comparePrice: 12000,
    salePrice: 8900,
    fabric: 'Pure Chinkle Chiffon',
    description: 'Handcrafted luxury',
    inStock: true,
    variants: [
      { id: 'var-1', size: 'M', color: 'Emerald', sku: 'TT-CHF-101-M-1', stockQuantity: 15 },
    ],
    images: [{ id: 'img-1', url: '/assets/prod-nafasat.jpg', displayOrder: 0 }],
  };
  const c = {
    id: 'col-1',
    name: 'Winter Festive 2026',
    slug: 'winter-festive-2026',
    description: 'Velvet and marina edit',
    bannerImage: '/assets/cat-lawn-summer.jpg',
    products: [{ id: 'prod-101', title: 'Chiffon Silk Kurta', sku: 'TT-CHF-101' }],
    _count: { products: 1 },
  };
  return { mockProduct: p, mockCollection: c };
});

vi.mock('@/lib/requireAdmin', () => ({
  requireAdmin: vi.fn().mockResolvedValue({
    ok: true,
    session: { id: 'admin-1', role: 'ADMIN', name: 'Executive' },
    response: null,
  }),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: vi.fn().mockResolvedValue(mockProduct),
      findFirst: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([mockProduct]),
      count: vi.fn().mockResolvedValue(1),
      create: vi.fn().mockResolvedValue(mockProduct),
      update: vi.fn().mockResolvedValue(mockProduct),
      delete: vi.fn().mockResolvedValue(mockProduct),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    collection: {
      findUnique: vi.fn().mockResolvedValue(mockCollection),
      findMany: vi.fn().mockResolvedValue([mockCollection]),
      create: vi.fn().mockResolvedValue(mockCollection),
      update: vi.fn().mockResolvedValue(mockCollection),
      delete: vi.fn().mockResolvedValue(mockCollection),
    },
    productImage: {
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      createMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
    productVariant: {
      findMany: vi.fn().mockResolvedValue(mockProduct.variants),
      create: vi.fn().mockResolvedValue({ id: 'var-2' }),
      update: vi.fn().mockResolvedValue({ id: 'var-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'var-old' }),
    },
    $transaction: vi.fn().mockImplementation(async (cb) => {
      const tx = {
        product: {
          update: vi.fn().mockResolvedValue(mockProduct),
          updateMany: vi.fn().mockResolvedValue({ count: 1 }),
          findUnique: vi.fn().mockResolvedValue(mockProduct),
        },
        collection: {
          create: vi.fn().mockResolvedValue(mockCollection),
          update: vi.fn().mockResolvedValue(mockCollection),
          findUnique: vi.fn().mockResolvedValue(mockCollection),
          delete: vi.fn().mockResolvedValue(mockCollection),
        },
        productImage: {
          deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
          createMany: vi.fn().mockResolvedValue({ count: 2 }),
        },
        productVariant: {
          findMany: vi.fn().mockResolvedValue(mockProduct.variants),
          update: vi.fn().mockResolvedValue({ id: 'var-1' }),
          create: vi.fn().mockResolvedValue({ id: 'var-2' }),
          delete: vi.fn().mockResolvedValue({ id: 'var-1' }),
        },
      };
      return cb(tx);
    }),
  },
}));

import { PUT as updateProduct } from '../src/app/api/admin/products/route';
import {
  GET as getCollections,
  POST as createCollection,
  PUT as updateCollection,
} from '../src/app/api/admin/collections/route';

describe('Admin Product & Collection Editing Endpoints', () => {
  it('should update product attributes, gallery, and variants via PUT /api/admin/products', async () => {
    const payload = {
      id: 'prod-101',
      title: 'Updated Chiffon Silk Kurta',
      sku: 'TT-CHF-101',
      basePrice: 10500,
      salePrice: 9500,
      fabric: 'Pure French Chiffon',
      images: ['/assets/prod-nafasat.jpg', '/assets/prod-armani.jpg'],
      variants: [
        { id: 'var-1', size: 'M', color: 'Crimson', sku: 'TT-CHF-101-M', priceAdjustment: 0, stockQuantity: 20 },
      ],
    };

    const req = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const res = await updateProduct(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.product).toBeDefined();
  });

  it('should reject product update without ID', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'No ID Product' }),
    });

    const res = await updateProduct(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain('Product ID is required');
  });

  it('should fetch collections via GET /api/admin/collections', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/collections', {
      method: 'GET',
    });

    const res = await getCollections(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.collections).toHaveLength(1);
    expect(json.collections[0].name).toBe('Winter Festive 2026');
  });

  it('should create and update a collection with assigned product IDs', async () => {
    // 1. Create collection
    const createReq = new NextRequest('http://localhost:3000/api/admin/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Summer Lawn Edit',
        description: 'Breezy luxury lawn',
        bannerImage: '/assets/cat-lawn-summer.jpg',
        productIds: ['prod-101'],
      }),
    });

    const createRes = await createCollection(createReq);
    const createJson = await createRes.json();
    expect(createRes.status).toBe(200);
    expect(createJson.success).toBe(true);

    // 2. Update collection
    const updateReq = new NextRequest('http://localhost:3000/api/admin/collections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'col-1',
        name: 'Updated Summer Lawn Edit',
        bannerImage: '/assets/cat-lawn-summer.jpg',
        productIds: ['prod-101'],
      }),
    });

    const updateRes = await updateCollection(updateReq);
    const updateJson = await updateRes.json();
    expect(updateRes.status).toBe(200);
    expect(updateJson.success).toBe(true);
  });

  it('should support subcategoryId in product update payload', async () => {
    const payload = {
      id: 'prod-101',
      title: 'Velvet Suit with Subcategory',
      subcategoryId: 'sub-w-velvet',
    };

    const req = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const res = await updateProduct(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });
});
