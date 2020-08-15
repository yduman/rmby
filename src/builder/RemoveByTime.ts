import { removeOlderThan, TimeUnit } from "../utils/timeUtils";

export class RemoveByTime {
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
      throw new Error(error);
    }
  }
}
