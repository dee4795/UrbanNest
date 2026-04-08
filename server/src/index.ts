import 'dotenv/config';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from './auth.js';
import { prisma } from './prisma.js';
import { JwtClaims } from './types.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const jwtSecret = process.env.JWT_SECRET;

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '3mb' }));

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

const listingSchema = z.object({
  ownerEmail: z.string().trim().email(),
  purpose: z.enum(['rent', 'buy']),
  propertyType: z.enum(['apartment', 'row-house']),
  title: z.string().trim().min(3),
  area: z.string().trim().min(2),
  bhk: z.number().int().min(1).max(4),
  price: z.number().int().min(1),
  address: z.string().trim().min(6),
  contactName: z.string().trim().min(2),
  contactPhone: z.string().trim().min(8),
  imageDataUrls: z.array(
    z.string().refine(
      (url) => {
        // Accept valid URLs (http/https) or base64 data URLs
        try {
          return url.startsWith('data:image/') || new URL(url).protocol.startsWith('http');
        } catch {
          return false;
        }
      },
      'Each image must be a valid URL or base64 data URL'
    )
  ).default([]),
  parking: z.string().trim().optional(),
  carpetAreaSqft: z.number().int().positive().optional(),
  builtUpAreaSqft: z.number().int().positive().optional(),
  amenities: z.array(z.string()).optional(),
  propertyAge: z.number().int().min(0).optional(),
  builderName: z.string().trim().optional()
});

function signToken(payload: JwtClaims): string {
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}

app.get('/', (_req, res) => {
  res.json({ message: 'UrbanNest API', version: '1.0.0' });
});

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid registration data.' });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'An account with this email already exists.' });
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      passwordHash: await bcrypt.hash(parsed.data.password, 10)
    }
  });

  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({ token, email: user.email, name: user.name });
});

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid login data.' });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValid) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token, email: user.email, name: user.name });
});

app.get('/api/listings', async (req, res) => {
  // If no page specified, return all listings (for backward compatibility)
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = 10; // 10 items per page

  if (!page) {
    // Return all listings without pagination
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const normalized = listings.map((item) => ({
      ...item,
      bhk: Number(item.bhk),
      price: Number(item.price),
      carpetAreaSqft: item.carpetAreaSqft !== null ? Number(item.carpetAreaSqft) : null,
      builtUpAreaSqft: item.builtUpAreaSqft !== null ? Number(item.builtUpAreaSqft) : null,
      propertyAge: item.propertyAge !== null ? Number(item.propertyAge) : null,
      createdAt: item.createdAt.toISOString(),
      imageDataUrls: Array.isArray(item.imageDataUrls) ? item.imageDataUrls : [],
      amenities: Array.isArray(item.amenities) ? item.amenities : []
    }));

    return res.json(normalized);
  }

  // Paginated response when page is specified
  const skip = (page - 1) * limit;

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.listing.count()
  ]);

  const normalized = listings.map((item) => ({
    ...item,
    bhk: Number(item.bhk),
    price: Number(item.price),
    carpetAreaSqft: item.carpetAreaSqft !== null ? Number(item.carpetAreaSqft) : null,
    builtUpAreaSqft: item.builtUpAreaSqft !== null ? Number(item.builtUpAreaSqft) : null,
    propertyAge: item.propertyAge !== null ? Number(item.propertyAge) : null,
    createdAt: item.createdAt.toISOString(),
    imageDataUrls: Array.isArray(item.imageDataUrls) ? item.imageDataUrls : [],
    amenities: Array.isArray(item.amenities) ? item.amenities : []
  }));

  const totalPages = Math.ceil(total / limit);
  res.json({
    data: normalized,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      total,
      totalPages
    }
  });
});

app.post('/api/listings', requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = listingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid listing data.' });
    return;
  }

  if (!req.user || req.user.email !== parsed.data.ownerEmail.toLowerCase()) {
    res.status(403).json({ message: 'You can only create listings for your own account.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) {
    res.status(401).json({ message: 'User no longer exists.' });
    return;
  }

  const created = await prisma.listing.create({
    data: {
      ownerId: user.id,
      ownerEmail: user.email,
      purpose: parsed.data.purpose,
      propertyType: parsed.data.propertyType,
      title: parsed.data.title,
      area: parsed.data.area,
      bhk: parsed.data.bhk,
      price: parsed.data.price,
      address: parsed.data.address,
      contactName: parsed.data.contactName,
      contactPhone: parsed.data.contactPhone,
      imageDataUrls: parsed.data.imageDataUrls,
      parking: parsed.data.parking ?? null,
      carpetAreaSqft: parsed.data.carpetAreaSqft ?? null,
      builtUpAreaSqft: parsed.data.builtUpAreaSqft ?? null,
      amenities: parsed.data.amenities ?? [],
      propertyAge: parsed.data.propertyAge ?? null,
      builderName: parsed.data.builderName ?? null
    }
  });

  res.status(201).json({
    id: created.id.toString(),
    ownerId: created.ownerId.toString(),
    ownerEmail: created.ownerEmail,
    purpose: created.purpose,
    propertyType: created.propertyType,
    title: created.title,
    area: created.area,
    bhk: Number(created.bhk),
    price: Number(created.price),
    address: created.address,
    contactName: created.contactName,
    contactPhone: created.contactPhone,
    imageDataUrls: Array.isArray(created.imageDataUrls) ? created.imageDataUrls : [],
    parking: created.parking !== null ? Number(created.parking) : null,
    carpetAreaSqft: created.carpetAreaSqft !== null ? Number(created.carpetAreaSqft) : null,
    builtUpAreaSqft: created.builtUpAreaSqft !== null ? Number(created.builtUpAreaSqft) : null,
    amenities: Array.isArray(created.amenities) ? created.amenities : [],
    propertyAge: created.propertyAge !== null ? Number(created.propertyAge) : null,
    builderName: created.builderName,
    createdAt: created.createdAt.toISOString()
  });
});

app.delete('/api/listings/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated.' });
    return;
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { owner: true }
  });

  if (!listing) {
    res.status(404).json({ message: 'Listing not found.' });
    return;
  }

  // Only owner can delete
  if (listing.ownerId !== req.user.userId) {
    res.status(403).json({ message: 'You can only delete your own listings.' });
    return;
  }

  await prisma.listing.delete({ where: { id } });
  res.json({ message: 'Listing deleted successfully.' });
});

app.listen(port, () => {
  console.log(`UrbanNest API running on http://localhost:${port}`);
});
