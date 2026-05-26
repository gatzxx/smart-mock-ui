export function formatUptimeSeconds(uptime: number): string {
  const roundedUptime = Math.round(uptime);

  if (roundedUptime < 60) {
    return `${roundedUptime} с`;
  }

  const minutes = Math.floor(roundedUptime / 60);

  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  return `${hours} ч`;
}

export function formatHealthTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
