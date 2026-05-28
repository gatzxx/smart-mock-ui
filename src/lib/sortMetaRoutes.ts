import type { ApiMetaRoute } from "@/types/apiMeta";

export type MetaRouteSortField = "method" | "path";
export type MetaRouteSortDirection = "asc" | "desc";

export type MetaRouteSortState = {
  direction: MetaRouteSortDirection;
  field: MetaRouteSortField;
};

const HTTP_METHOD_ORDER = ["DELETE", "GET", "PATCH", "POST", "PUT"] as const;

function getMethodSortIndex(method: string): number {
  const normalizedMethod = method.toUpperCase();
  const methodIndex = HTTP_METHOD_ORDER.indexOf(
    normalizedMethod as (typeof HTTP_METHOD_ORDER)[number],
  );

  if (methodIndex === -1) {
    return HTTP_METHOD_ORDER.length;
  }

  return methodIndex;
}

function comparePaths(leftPath: string, rightPath: string): number {
  return leftPath.localeCompare(rightPath);
}

function compareMethods(leftMethod: string, rightMethod: string): number {
  const methodOrderDifference =
    getMethodSortIndex(leftMethod) - getMethodSortIndex(rightMethod);

  if (methodOrderDifference !== 0) {
    return methodOrderDifference;
  }

  return leftMethod.localeCompare(rightMethod);
}

export function sortMetaRoutes(
  routes: ApiMetaRoute[],
  sortState: MetaRouteSortState | null,
): ApiMetaRoute[] {
  if (!sortState) {
    return routes;
  }

  const sortedRoutes = [...routes];
  const directionMultiplier = sortState.direction === "asc" ? 1 : -1;

  sortedRoutes.sort((leftRoute, rightRoute) => {
    if (sortState.field === "path") {
      const pathDifference = comparePaths(leftRoute.path, rightRoute.path);

      if (pathDifference !== 0) {
        return directionMultiplier * pathDifference;
      }

      return compareMethods(leftRoute.method, rightRoute.method);
    }

    const methodDifference = compareMethods(leftRoute.method, rightRoute.method);

    if (methodDifference !== 0) {
      return directionMultiplier * methodDifference;
    }

    return comparePaths(leftRoute.path, rightRoute.path);
  });

  return sortedRoutes;
}

export function getNextMetaRouteSortState(
  currentSortState: MetaRouteSortState | null,
  field: MetaRouteSortField,
): MetaRouteSortState | null {
  if (currentSortState?.field !== field) {
    return {
      field,
      direction: "asc",
    };
  }

  if (currentSortState.direction === "asc") {
    return {
      field,
      direction: "desc",
    };
  }

  return null;
}
