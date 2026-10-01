export const REPORT_AUDIT_THRESHOLD = Number(
  process.env.REPORT_AUDIT_THRESHOLD || 3,
);

export const MODERATION_CACHE_TTL_MS = Number(
  process.env.MODERATION_CACHE_TTL_MS || 24 * 60 * 60 * 1000,
);

export const MAX_MODERATION_CACHE_ENTRIES = Number(
  process.env.MAX_MODERATION_CACHE_ENTRIES || 5000,
);
