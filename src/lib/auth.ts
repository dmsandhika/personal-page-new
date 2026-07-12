// Uses Web Crypto (globalThis.crypto) so the same code runs both in
// middleware (Edge runtime) and in Server Actions (Node.js runtime).

const COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function getKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.ADMIN_SESSION_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken() {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(issuedAt));
  return `${issuedAt}.${toHex(signature)}`;
}

export async function isValidSessionToken(token: string | undefined) {
  if (!token) return false;
  const [issuedAt, signatureHex] = token.split(".");
  if (!issuedAt || !signatureHex) return false;

  const key = await getKey();
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromHex(signatureHex),
    encoder.encode(issuedAt)
  );
  if (!valid) return false;

  const age = Math.floor(Date.now() / 1000) - Number(issuedAt);
  return age >= 0 && age <= MAX_AGE_SECONDS;
}

export async function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD!;
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(password)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  return toHex(a) === toHex(b);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS;
