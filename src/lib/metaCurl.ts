import type { ApiMeta, ApiMetaRoute } from "@/types/apiMeta";

export function normalizeMetaRoutes(meta: ApiMeta): ApiMetaRoute[] {
  if (meta.routes && meta.routes.length > 0) {
    return meta.routes;
  }

  return meta.endpoints.map((path) => ({
    method: "GET",
    path,
  }));
}

export function buildApiUrl(apiBaseUrl: string, path: string): string {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  return `${baseUrl}${path}`;
}

type ExampleBodyRule = {
  method: string;
  pathPattern: RegExp;
  body: string;
};

const EXAMPLE_BODY_RULES: ExampleBodyRule[] = [
  {
    method: "POST",
    pathPattern: /\/api\/users$/,
    body: '{"fullName":"Demo User","email":"demo@example.com","role":"Engineer"}',
  },
  {
    method: "PATCH",
    pathPattern: /\/api\/users\//,
    body: '{"fullName":"Updated User"}',
  },
  {
    method: "POST",
    pathPattern: /\/api\/products$/,
    body: '{"title":"Demo Product","price":42.5,"inStock":true}',
  },
  {
    method: "PATCH",
    pathPattern: /\/api\/products\//,
    body: '{"title":"Updated Product","inStock":false}',
  },
];

function getExampleBody(method: string, path: string): string | undefined {
  const matchedRule = EXAMPLE_BODY_RULES.find(
    (rule) => rule.method === method && rule.pathPattern.test(path),
  );

  return matchedRule?.body;
}

export function buildCurlCommand(
  apiBaseUrl: string,
  method: string,
  path: string,
): string {
  const normalizedMethod = method.toUpperCase();
  const url = buildApiUrl(apiBaseUrl, path);

  if (normalizedMethod === "GET") {
    return `curl "${url}"`;
  }

  if (normalizedMethod === "DELETE") {
    return `curl -X DELETE "${url}"`;
  }

  const exampleBody = getExampleBody(normalizedMethod, path);

  if (exampleBody) {
    return `curl -X ${normalizedMethod} "${url}" -H "Content-Type: application/json" -d '${exampleBody}'`;
  }

  return `curl -X ${normalizedMethod} "${url}"`;
}
