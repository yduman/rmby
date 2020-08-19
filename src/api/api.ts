import { FilterState } from "../filters/filter-interface";
import { TFilter, ExtFilter, NFilter } from "../filters/filters";
import {
  IRemoveBy,
  IRemoveByTimeUnit,
  IRemoveByName,
  IRemoveRunOrConcat,
  IRemoveByTime,
} from "./api-interface";
import {
  TimeUnit,
  isEqual,
  startsWith,
  endsWith,
  includes,
  removeFiles,
  getDirectoryContent,
  initHandlers,
} from "../utils";

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
    this.filterState.push(new NFilter(nameValue, isEqual));
    return new RemoveRunOrConcat(this.filterState);
  }

  thatStartsWith(nameValue: string): IRemoveRunOrConcat {
    this.filterState.push(new NFilter(nameValue, startsWith));
    return new RemoveRunOrConcat(this.filterState);
  }

  thatEndsWith(nameValue: string): IRemoveRunOrConcat {
    this.filterState.push(new NFilter(nameValue, endsWith));
    return new RemoveRunOrConcat(this.filterState);
  }

  thatIncludes(nameValue: string): IRemoveRunOrConcat {
    this.filterState.push(new NFilter(nameValue, includes));
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
    let filteredFiles: string[] = [];
    const handlers = initHandlers();
    const dirContent = await getDirectoryContent(this.filterState);

    for (const filter of this.filterState) {
      filteredFiles = await handlers.handle(filter, dirContent);
    }

    return await removeFiles(filteredFiles);
  }
}
