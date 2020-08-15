import { RemoveByTime } from "./builder/RemoveByTime";
import { RemoveByName } from "./builder/RemoveByName";
import { RemoveByExtension } from "./builder/RemoveByExtension";
import { TimeUnit } from "./utils/timeUtils";

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

  byName(): RemoveByName {
    return new RemoveByName(this.dirPath);
  }

  byExtension(): RemoveByExtension {
    return new RemoveByExtension(this.dirPath);
  }
}
