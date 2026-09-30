const raw = process.env.COLDBREW_ENV_SECRET_BUNDLE;

if (raw) {
  try {
    const env = JSON.parse(raw);

    if (!Array.isArray(env)) {
      throw new Error('COLDBREW_ENV_SECRET_BUNDLE must be an array');
    }

    for (const item of env) {
      if (!item || typeof item !== 'object') {
        continue;
      }

      const key = item.key;
      const value = item.value;

      if (typeof key !== 'string') {
        continue;
      }

      if (process.env[key] === undefined) {
        process.env[key] = String(value ?? '');
      }
    }

    delete process.env.COLDBREW_ENV_SECRET_BUNDLE;
  } catch (err) {
    console.error('Failed to load bundled env vars:', err);
    process.exit(1);
  }
}
