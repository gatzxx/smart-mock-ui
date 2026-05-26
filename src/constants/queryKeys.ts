export const queryKeys = {
  users: {
    all: (apiBaseUrl: string) => ["users", apiBaseUrl] as const,
    detail: (apiBaseUrl: string, userId: string) =>
      ["user-detail", apiBaseUrl, userId] as const,
  },
  products: {
    all: (apiBaseUrl: string) => ["products", apiBaseUrl] as const,
    detail: (apiBaseUrl: string, productId: string) =>
      ["product-detail", apiBaseUrl, productId] as const,
  },
} as const;
