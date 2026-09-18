import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { Role, User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'woxxapp-v2-super-secret-jwt-key-2026';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(req?: NextRequest | Request): Promise<User | null> {
  let token: string | undefined;

  // 1. Essayer depuis les cookies Next.js
  try {
    const cookieStore = await cookies();
    token = cookieStore.get('woxx_token')?.value;
  } catch {
    // Si cookies() n'est pas accessible, on passe à req
  }

  // 2. Si pas trouvé, essayer depuis les headers de la requête
  if (!token && req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Cookie header
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(/woxx_token=([^;]+)/);
        if (match) token = match[1];
      }
    }
  }

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload || !payload.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

export async function requireAuth(req?: NextRequest | Request): Promise<User> {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireRole(allowedRoles: Role[], req?: NextRequest | Request): Promise<User> {
  const user = await requireAuth(req);
  if (!allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

// Format utilisateur pour l'API (exclut le hash du mot de passe)
export function sanitizeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    full_name: user.fullName,
    role: user.role.toLowerCase(),
    google_id: user.googleId,
    assigned_sales_rep_id: user.assignedSalesRepId,
    is_active: user.isActive,
    created_at: user.createdAt.toISOString(),
  };
}