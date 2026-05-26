import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type { Product } from "@/types/product";
import type { ProductDetail } from "@/types/productDetail";
import type { User } from "@/types/user";
import type { UserDetail } from "@/types/userDetail";

export async function invalidateListQuery(
  queryClient: QueryClient,
  queryKey: QueryKey,
): Promise<void> {
  await queryClient.invalidateQueries({
    queryKey,
    refetchType: "all",
  });
}

export function appendToListCache<TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  item: TItem,
): void {
  queryClient.setQueryData<TItem[]>(queryKey, (currentItems) => {
    if (!currentItems) {
      return [item];
    }

    if (currentItems.some((entry) => entry.id === item.id)) {
      return currentItems;
    }

    return [...currentItems, item];
  });
}

export function updateListCacheItem<TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string,
  updater: (item: TItem) => TItem,
): void {
  queryClient.setQueryData<TItem[]>(queryKey, (currentItems) =>
    currentItems?.map((entry) => (entry.id === itemId ? updater(entry) : entry)),
  );
}

export function upsertListCacheItem<TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  item: TItem,
): void {
  queryClient.setQueryData<TItem[]>(queryKey, (currentItems) => {
    if (!currentItems) {
      return [item];
    }

    const existingIndex = currentItems.findIndex((entry) => entry.id === item.id);

    if (existingIndex === -1) {
      return [...currentItems, item];
    }

    const nextItems = [...currentItems];
    nextItems[existingIndex] = {
      ...nextItems[existingIndex],
      ...item,
    };

    return nextItems;
  });
}

export function removeFromListCache<TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string,
): void {
  queryClient.setQueryData<TItem[]>(queryKey, (currentItems) =>
    currentItems?.filter((entry) => entry.id !== itemId),
  );
}

export function syncListAfterCreate<TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  item: TItem,
): void {
  appendToListCache(queryClient, queryKey, item);
  void invalidateListQuery(queryClient, queryKey);
}

export function syncListAfterUpdate<TItem extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  item: TItem,
): void {
  upsertListCacheItem(queryClient, queryKey, item);
  void invalidateListQuery(queryClient, queryKey);
}

export function syncListAfterDelete(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string,
): void {
  removeFromListCache(queryClient, queryKey, itemId);
  void invalidateListQuery(queryClient, queryKey);
}

export function toProductListItem(item: Product | ProductDetail): Product {
  return {
    id: item.id,
    title: item.title,
    price: item.price,
    inStock: item.inStock,
    updatedAt: item.updatedAt,
  };
}

export function toUserListItem(item: User | UserDetail): User {
  return {
    id: item.id,
    fullName: item.fullName,
    email: item.email,
    role: item.role ?? "",
    createdAt: "createdAt" in item ? item.createdAt : undefined,
  };
}

export function getListCount<TItem>(
  queryClient: QueryClient,
  queryKey: QueryKey,
): number {
  const items = queryClient.getQueryData<TItem[]>(queryKey);
  return items?.length ?? 0;
}
