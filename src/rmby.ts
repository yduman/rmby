import fs from "fs";
import path from "path";

const MILLIS = "millis";
const SECONDS = "seconds";
const MINUTES = "minutes";
const HOURS = "hours";

const MS_IN_SECS = 60000;
const MS_IN_HOUR = 3600000;

type TimeUnit = "millis" | "seconds" | "minutes" | "hours";

export function removeOlderThan(
  timeUnit: TimeUnit,
  dirPath: string,
  threshold: number,
): void {
  fs.readdir(dirPath, (err, files) => {
    if (err) throwError(err);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) throwError(err);

        let diff;
        switch (timeUnit) {
          case MILLIS:
            diff = getDiffMillis(new Date(), stats.mtime);
            break;
          case SECONDS:
            diff = getDiffSeconds(new Date(), stats.mtime);
            break;
          case MINUTES:
            diff = getDiffMinutes(new Date(), stats.mtime);
            break;
          case HOURS:
            diff = getDiffHours(new Date(), stats.mtime);
            break;
          default:
            throw new Error("The parameter 'timeUnit' has an invalid value");
        }

        if (diff >= threshold) {
          fs.unlink(filePath, (err) => {
            if (err) throwError(err);
          });
        }
      });
    });
  });
}

function throwError(error: NodeJS.ErrnoException | null) {
  throw new Error(error?.message);
}

function floorOrCeil(diff: number) {
  return diff > 0 ? Math.floor(diff) : Math.ceil(diff);
}

function getDiffMillis(laterDate: Date, earlierDate: Date) {
  return laterDate.getTime() - earlierDate.getTime();
}

function getDiffSeconds(laterDate: Date, earlierDate: Date) {
  const diff = getDiffMillis(laterDate, earlierDate) / 1000;
  return floorOrCeil(diff);
}

function getDiffMinutes(laterDate: Date, earlierDate: Date) {
  const diff = getDiffMillis(laterDate, earlierDate) / MS_IN_SECS;
  return floorOrCeil(diff);
}

function getDiffHours(laterDate: Date, earlierDate: Date) {
  const diff = getDiffMillis(laterDate, earlierDate) / MS_IN_HOUR;
  return floorOrCeil(diff);
}
