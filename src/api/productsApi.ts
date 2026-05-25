import type { Product } from "@/types/product";

const PRODUCTS_PATH = "/api/products";

export async function fetchProducts(apiBaseUrl: string): Promise<Product[]> {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}${PRODUCTS_PATH}`);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить товары (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Некорректный ответ API: ожидался массив");
  }

  return data as Product[];
}
