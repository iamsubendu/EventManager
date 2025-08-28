export const config = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL || "/api/graphql",
  graphql: {
    introspection:
      process.env.GRAPHQL_INTROSPECTION === "true" ||
      process.env.NODE_ENV === "development",
    playground:
      process.env.GRAPHQL_PLAYGROUND === "true" ||
      process.env.NODE_ENV === "development",
  },
  database: {
    url: process.env.DATABASE_URL,
    mongodb: process.env.MONGODB_URI,
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || "development-secret-key",
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
  },
  rateLimiting: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  },
  services: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
    analytics: {
      googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
      vercelAnalyticsId: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    },
  },
  cache: {
    redisUrl: process.env.REDIS_URL,
    redisPassword: process.env.REDIS_PASSWORD,
  },
  upload: {
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  },
} as const;

export function validateConfig() {
  if (config.isProduction) {
    const requiredVars: string[] = [];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missingVars.join(
          ", "
        )}`
      );
    }
  }
}

if (config.isProduction) {
  validateConfig();
}
