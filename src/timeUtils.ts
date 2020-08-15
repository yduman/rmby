const MS_IN_SECS = 60000;
const MS_IN_HOUR = 3600000;

export enum TimeUnit {
  MILLIS,
  SECONDS,
  MINUTES,
  HOURS,
}

export function calcTimeDiff(
  timeUnit: TimeUnit,
  lastModifiedTime: Date,
): number {
  let diff;
  const now = new Date();

  switch (timeUnit) {
    case TimeUnit.MILLIS:
      diff = getDiffMillis(now, lastModifiedTime);
      break;
    case TimeUnit.SECONDS:
      diff = getDiffSeconds(now, lastModifiedTime);
      break;
    case TimeUnit.MINUTES:
      diff = getDiffMinutes(now, lastModifiedTime);
      break;
    case TimeUnit.HOURS:
      diff = getDiffHours(now, lastModifiedTime);
      break;
  }

  return diff;
}

function floorOrCeil(diff: number) {
  return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

function getDiffMillis(laterDate: Date, earlierDate: Date): number {
  return laterDate.getTime() - earlierDate.getTime();
}

function getDiffSeconds(laterDate: Date, earlierDate: Date): number {
  const diff = getDiffMillis(laterDate, earlierDate) / 1000;
  return floorOrCeil(diff);
}

function getDiffMinutes(laterDate: Date, earlierDate: Date): number {
  const diff = getDiffMillis(laterDate, earlierDate) / MS_IN_SECS;
  return floorOrCeil(diff);
}

function getDiffHours(laterDate: Date, earlierDate: Date): number {
  const diff = getDiffMillis(laterDate, earlierDate) / MS_IN_HOUR;
  return floorOrCeil(diff);
}
