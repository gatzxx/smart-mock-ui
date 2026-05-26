import type { ApiActivityRecord } from "@/types/apiActivity";

type ActivityRecorder = (entry: ApiActivityRecord) => void;

let activityRecorder: ActivityRecorder | null = null;

export function setApiActivityRecorder(recorder: ActivityRecorder | null): void {
  activityRecorder = recorder;
}

export function recordApiActivity(entry: ApiActivityRecord): void {
  activityRecorder?.(entry);
}
