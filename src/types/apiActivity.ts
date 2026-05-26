export type ApiActivityEntry = {
  id: string;
  method: string;
  url: string;
  status: number | null;
  durationMs: number;
  ok: boolean;
  timestamp: string;
  errorMessage?: string;
};

export type ApiActivityRecord = Omit<ApiActivityEntry, "id">;
