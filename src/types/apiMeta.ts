export type ApiMetaRoute = {
  method: string;
  path: string;
};

export type ApiMeta = {
  basePath: string;
  endpoints: string[];
  routes?: ApiMetaRoute[];
  responseDelayMs: number;
};
