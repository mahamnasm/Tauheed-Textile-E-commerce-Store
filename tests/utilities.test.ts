import { describe, it, expect } from 'vitest';
import { optimizeImageBuffer } from '../src/lib/imageProcessor';
import { createOrderSchema } from '../src/lib/validation';
import sharp from 'sharp';

describe('Image Processing Pipeline (sharp)', () => {
  it('should resize and convert an image buffer to WebP', async () => {
    // Generate a 100x100 red image buffer using sharp
    const sampleBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const result = await optimizeImageBuffer(sampleBuffer, {
      maxWidth: 50,
      format: 'webp',
      quality: 80,
    });

    expect(result.format).toBe('webp');
    expect(result.width).toBeLessThanOrEqual(50);
    expect(result.data).toBeInstanceOf(Buffer);
  });
});

describe('Zod Schema Validation', () => {
  it('should successfully validate a valid order payload', () => {
    const validPayload = {
      customerName: 'Muhammad Ali',
      guestPhone: '03001234567',
      address: 'House 123, Street 5, Gulberg',
      city: 'Lahore',
      subtotal: 5000,
      total: 5000,
      paymentMethod: 'COD',
      items: [
        {
          productId: 'prod_123',
          price: 5000,
          quantity: 1,
          total: 5000,
        },
      ],
    };

    const parsed = createOrderSchema.parse(validPayload);
    expect(parsed.customerName).toBe('Muhammad Ali');
    expect(parsed.paymentMethod).toBe('COD');
  });

  it('should reject invalid order payload missing required fields', () => {
    const invalidPayload = {
      customerName: 'M',
      guestPhone: '123', // phone too short
    };

    expect(() => createOrderSchema.parse(invalidPayload)).toThrow();
  });
});
