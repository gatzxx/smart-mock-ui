import {
  ensureOkResponse,
  normalizeBaseUrl,
  parseListResponse,
  parseObjectResponse,
} from "@/lib/apiClient";
import { productDetailSchema, productSchema } from "@/lib/schemas/productSchemas";
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

export async function fetchProducts(apiBaseUrl: string): Promise<Product[]> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${PRODUCTS_PATH}`);

  return parseListResponse(response, productSchema, "Не удалось загрузить товары");
}

export async function fetchProduct(
  apiBaseUrl: string,
  productId: string,
): Promise<ProductDetail> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${PRODUCTS_PATH}/${productId}`);

  return parseObjectResponse(
    response,
    productDetailSchema,
    "Не удалось загрузить товар",
    "Товар не найден",
  );
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

  return parseObjectResponse(response, productSchema, "Не удалось создать товар");
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

  return parseObjectResponse(
    response,
    productDetailSchema,
    "Не удалось обновить товар",
    "Товар не найден",
  );
}

export async function deleteProduct(
  apiBaseUrl: string,
  productId: string,
): Promise<void> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${PRODUCTS_PATH}/${productId}`, {
    method: "DELETE",
  });

  await ensureOkResponse(response, "Не удалось удалить товар", "Товар не найден");
}
