import { trackedFetch } from "@/lib/trackedFetch";
import type { Product } from "@/types/product";
import type { ProductDetail } from "@/types/productDetail";

const PRODUCTS_PATH = "/api/products";

export async function fetchProducts(apiBaseUrl: string): Promise<Product[]> {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const response = await trackedFetch(`${baseUrl}${PRODUCTS_PATH}`);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить товары (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Некорректный ответ API: ожидался массив");
  }

  return data as Product[];
}

export async function fetchProduct(
  apiBaseUrl: string,
  productId: string,
): Promise<ProductDetail> {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const response = await trackedFetch(`${baseUrl}${PRODUCTS_PATH}/${productId}`);

  if (response.status === 404) {
    throw new Error("Товар не найден");
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить товар (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (typeof data !== "object" || data === null) {
    throw new Error("Некорректный ответ API: ожидался объект");
  }

  return data as ProductDetail;
}
