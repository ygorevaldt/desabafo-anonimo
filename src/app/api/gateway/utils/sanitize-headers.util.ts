const SENSITIVE_HEADERS_TO_REMOVE: readonly string[] = [
  "x-powered-by",
  "server",
];

export function sanitizeResponseHeaders(
  sourceHeaders?: Headers | Record<string, string>,
  additionalHeaders?: Record<string, string>,
): Headers {
  const sanitized = new Headers();

  if (sourceHeaders) {
    if (sourceHeaders instanceof Headers) {
      sourceHeaders.forEach((value, key) => {
        sanitized.set(key, value);
      });
    } else {
      for (const [key, value] of Object.entries(sourceHeaders)) {
        sanitized.set(key, value);
      }
    }
  }

  for (const header of SENSITIVE_HEADERS_TO_REMOVE) {
    sanitized.delete(header);
  }

  if (additionalHeaders) {
    for (const [key, value] of Object.entries(additionalHeaders)) {
      sanitized.set(key, value);
    }
  }

  return sanitized;
}

