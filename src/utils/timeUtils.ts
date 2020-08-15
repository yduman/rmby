import path from "path";
import { readdir, stat, unlink } from "../asyncFs";

const MS_IN_SECS = 60000;
const MS_IN_HOUR = 3600000;

export enum TimeUnit {
  MILLIS,
  SECONDS,
  MINUTES,
  HOURS,
}

export async function removeOlderThan(
  timeUnit: TimeUnit,
  dirPath: string,
  threshold: number,
): Promise<string[]> {
  try {
    const deletedFiles: string[] = [];
    const dirContent = await readdir(dirPath);

    for (const fsObject of dirContent) {
      const fsObjectPath = path.join(dirPath, fsObject);
      const stats = await stat(fsObjectPath);
      if (stats.isFile()) {
        const diff = calcTimeDiff(timeUnit, stats.mtime);
        if (diff >= threshold) {
          await unlink(fsObjectPath);
          deletedFiles.push(fsObjectPath);
        }
      }
    }

    return deletedFiles;
  } catch (error) {
    throw new Error(error);
  }
}

function calcTimeDiff(timeUnit: TimeUnit, lastModifiedTime: Date): number {
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

function getDiffMillis(laterDate: Date, earlierDate: Date): number {
  return laterDate.getTime() - earlierDate.getTime();
}

function getDiffSeconds(laterDate: Date, earlierDate: Date): number {
  const diff = getDiffMillis(laterDate, earlierDate) / 1000;
  return Math.floor(diff);
}

function getDiffMinutes(laterDate: Date, earlierDate: Date): number {
  const diff = getDiffMillis(laterDate, earlierDate) / MS_IN_SECS;
  return Math.floor(diff);
}

function getDiffHours(laterDate: Date, earlierDate: Date): number {
  const diff = getDiffMillis(laterDate, earlierDate) / MS_IN_HOUR;
  return Math.floor(diff);
}
