export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.log(message, sanitize(meta));
    } else {
      console.log(message);
    }
  },
  error(message: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.error(message, sanitize(meta));
    } else {
      console.error(message);
    }
  }
}

function sanitize(meta: Record<string, unknown>) {
  const clone = { ...meta };
  if ('token' in clone) {
    clone.token = '[REDACTED]';
  }
  return clone;
}
