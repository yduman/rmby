import {
  IRemoveBy,
  IRemoveByTimeUnit,
  IRemoveByName,
  IRemoveRunOrConcat,
  IRemoveByTime,
} from "./api-interface";
import { FilterState } from "../filters/filter-interface";
import { TimeUnit } from "../utils/timeUtils";
import { TFilter, ExtFilter, NFilter } from "../filters/filters";
import { NameUnit, isEqual, startsWith, endsWith, includes } from "../utils/nameUtils";
import {
  DirectoryFilterHandler,
  TimeFilterHandler,
  NameFilterHandler,
  ExtensionFilterHandler,
} from "../handler/conrete-handlers";
import { unlink } from "../asyncFs";

export class RemoveBy implements IRemoveBy {
  private filterState: FilterState[];

  constructor(filterState: FilterState[]) {
    this.filterState = filterState;
  }

  byTime(): IRemoveByTimeUnit {
    return new RemoveByTimeUnit(this.filterState);
  }

  byName(): IRemoveByName {
    return new RemoveByName(this.filterState);
  }

  byExtension(fileExtension: string): IRemoveRunOrConcat {
    this.filterState.push(new ExtFilter(fileExtension));
    return new RemoveRunOrConcat(this.filterState);
  }
}

class RemoveByTimeUnit implements IRemoveByTimeUnit {
  private filterState: FilterState[];

  constructor(filterState: FilterState[]) {
    this.filterState = filterState;
  }

  inMilliseconds(): IRemoveByTime {
    return new RemoveByTime(this.filterState, TimeUnit.MILLIS);
  }

  inSeconds(): IRemoveByTime {
    return new RemoveByTime(this.filterState, TimeUnit.SECONDS);
  }

  inMinutes(): IRemoveByTime {
    return new RemoveByTime(this.filterState, TimeUnit.MINUTES);
  }

  inHours(): IRemoveByTime {
    return new RemoveByTime(this.filterState, TimeUnit.HOURS);
  }
}

class RemoveByTime implements IRemoveByTime {
  private filterState: FilterState[];
  private timeUnit: TimeUnit;

  constructor(filterState: FilterState[], timeUnit: TimeUnit) {
    this.filterState = filterState;
    this.timeUnit = timeUnit;
  }

  olderThan(threshold: number): IRemoveRunOrConcat {
    this.filterState.push(new TFilter(this.timeUnit, threshold));
    return new RemoveRunOrConcat(this.filterState);
  }
}

class RemoveByName implements IRemoveByName {
  private filterState: FilterState[];

  constructor(filterState: FilterState[]) {
    this.filterState = filterState;
  }

  thatEqualsTo(nameValue: string): IRemoveRunOrConcat {
    this.filterState.push(new NFilter(NameUnit.EQUAL_TO, nameValue, isEqual));
    return new RemoveRunOrConcat(this.filterState);
  }

  thatStartsWith(nameValue: string): IRemoveRunOrConcat {
    this.filterState.push(new NFilter(NameUnit.STARTS_WITH, nameValue, startsWith));
    return new RemoveRunOrConcat(this.filterState);
  }

  thatEndsWith(nameValue: string): IRemoveRunOrConcat {
    this.filterState.push(new NFilter(NameUnit.ENDS_WITH, nameValue, endsWith));
    return new RemoveRunOrConcat(this.filterState);
  }

  thatIncludes(nameValue: string): IRemoveRunOrConcat {
    this.filterState.push(new NFilter(NameUnit.INCLUDES, nameValue, includes));
    return new RemoveRunOrConcat(this.filterState);
  }
}

class RemoveRunOrConcat implements IRemoveRunOrConcat {
  private filterState: FilterState[];

  constructor(filterState: FilterState[]) {
    this.filterState = filterState;
  }

  and(): IRemoveBy {
    return new RemoveBy(this.filterState);
  }

  async run(): Promise<string[]> {
    const fromDirHandler = new DirectoryFilterHandler();
    const byTimeHandler = new TimeFilterHandler();
    const byNameHandler = new NameFilterHandler();
    const byExtensionHandler = new ExtensionFilterHandler();

    fromDirHandler.setNext(byTimeHandler).setNext(byNameHandler).setNext(byExtensionHandler);

    let filteredFiles: string[] = [];
    for (const filter of this.filterState) {
      const result = await fromDirHandler.handle(filter, filteredFiles);
      // TODO: diff the results
      filteredFiles = result;
    }

    const deletedFiles: string[] = [];
    for (const file of filteredFiles) {
      await unlink(file);
      deletedFiles.push(file);
    }

    return deletedFiles;
  }
}
