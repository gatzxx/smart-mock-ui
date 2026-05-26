export type ApiMetaRoute = {
  method: string;
  path: string;
};

export type ApiMeta = {
  basePath: string;
  endpoints: string[];
  routes?: ApiMetaRoute[];
  openapiPath?: string;
  schemaVersion?: number;
  responseDelayMs: number;
};

export type OpenApiDocument = Record<string, unknown>;
