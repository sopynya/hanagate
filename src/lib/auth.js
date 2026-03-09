import { jwtVerify } from "jose";

export async function getUserIdFromToken(token) {
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    return payload.id;
  } catch {
    return null;
  }
}