import crypto from 'crypto';

/**
 * Verify PayHere payment signature
 * Standalone version for Next.js API routes (not dependent on Vendure)
 */
export function verifyPayHereSignature(data: any, signature: string): boolean {
  const secret = process.env.PAYHERE_SECRET;
  if (!secret) return false;

  // PayHere signature verification
  const hashString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('&');
  
  const hash = crypto
    .createHash('md5')
    .update(hashString + secret)
    .digest('hex')
    .toUpperCase();

  return hash === signature;
}

