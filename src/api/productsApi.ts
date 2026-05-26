import { trackedFetch } from "@/lib/trackedFetch";
import type { Product } from "@/types/product";
import type { ProductDetail } from "@/types/productDetail";

const PRODUCTS_PATH = "/api/products";

export type CreateProductInput = {
  title: string;
  price: number;
  inStock: boolean;
};

export type UpdateProductInput = CreateProductInput;

function normalizeBaseUrl(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/$/, "");
}

async function parseObjectResponse(
  response: Response,
  errorMessage: string,
): Promise<Record<string, unknown>> {
  if (!response.ok) {
    throw new Error(`${errorMessage} (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (typeof data !== "object" || data === null) {
    throw new Error("Некорректный ответ API: ожидался объект");
  }

  return data as Record<string, unknown>;
}

export async function fetchProducts(apiBaseUrl: string): Promise<Product[]> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
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
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${PRODUCTS_PATH}/${productId}`);

  if (response.status === 404) {
    throw new Error("Товар не найден");
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить товар (HTTP ${response.status})`);
  }

  const data = await parseObjectResponse(response, "Не удалось загрузить товар");

  return data as ProductDetail;
}

export async function createProduct(
  apiBaseUrl: string,
  input: CreateProductInput,
): Promise<Product> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${PRODUCTS_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await parseObjectResponse(response, "Не удалось создать товар");

  return data as Product;
}

export async function updateProduct(
  apiBaseUrl: string,
  productId: string,
  input: UpdateProductInput,
): Promise<ProductDetail> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${PRODUCTS_PATH}/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (response.status === 404) {
    throw new Error("Товар не найден");
  }

  const data = await parseObjectResponse(response, "Не удалось обновить товар");

  return data as ProductDetail;
}

export async function deleteProduct(
  apiBaseUrl: string,
  productId: string,
): Promise<void> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${PRODUCTS_PATH}/${productId}`, {
    method: "DELETE",
  });

  if (response.status === 404) {
    throw new Error("Товар не найден");
  }

  if (!response.ok) {
    throw new Error(`Не удалось удалить товар (HTTP ${response.status})`);
  }
}
