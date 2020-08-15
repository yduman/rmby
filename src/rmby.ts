import path from "path";

import { readdir, stat, unlink } from "./asyncFs";
import { calcTimeDiff, TimeUnit } from "./timeUtils";

export class Remove {
  private dirPath: string;

  constructor(dirPath: string) {
    this.dirPath = dirPath;
  }

  byMilliseconds(): RemoveByTime {
    return new RemoveByTime(this.dirPath, TimeUnit.MILLIS);
  }

  bySeconds(): RemoveByTime {
    return new RemoveByTime(this.dirPath, TimeUnit.SECONDS);
  }

  byMinutes(): RemoveByTime {
    return new RemoveByTime(this.dirPath, TimeUnit.MINUTES);
  }

  byHours(): RemoveByTime {
    return new RemoveByTime(this.dirPath, TimeUnit.HOURS);
  }
}

class RemoveByTime {
  private dirPath: string;
  private timeUnit: TimeUnit;

  constructor(dirPath: string, timeUnit: TimeUnit) {
    this.dirPath = dirPath;
    this.timeUnit = timeUnit;
  }

  async olderThan(threshold: number): Promise<string[]> {
    try {
      return await removeOlderThan(this.timeUnit, this.dirPath, threshold);
    } catch (error) {
      throw new Error(error?.message);
    }
  }
}

async function removeOlderThan(
  timeUnit: TimeUnit,
  dirPath: string,
  threshold: number,
) {
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
    throw new Error(error?.message);
  }
}
