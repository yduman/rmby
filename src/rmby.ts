import { FilterState } from "./filters/filter-interface";
import { DirFilter, ExtFilter, TFilter, NFilter } from "./filters/filters";
import {
  TimeUnit,
  isEqual,
  startsWith,
  endsWith,
  includes,
  initHandlers,
  getDirectoryContent,
  removeFiles,
} from "./utils";
import {
  Remove,
  ByFilter,
  ByTime,
  ByName,
  ByExtension,
  OlderThan,
  RunOrCombine,
  Run,
} from "./types";

let filterState: FilterState[] = [];

export function remove(): Remove {
  return { from };
}

function from(dirPath: string): ByFilter {
  filterState.push(new DirFilter(dirPath));
  return { byTime, byName, byExtension };
}

function byTime(): ByTime {
  return { olderThan };
}

function byName(): ByName {
  return { thatEquals, thatStartsWith, thatEndsWith, thatIncludes };
}

function byExtension(fileExtension: string): ByExtension {
  filterState.push(new ExtFilter(fileExtension));
  return { run, and };
}

function olderThan(threshold: number): OlderThan {
  function milliseconds(): RunOrCombine {
    filterState.push(new TFilter(TimeUnit.MILLIS, threshold));
    return { run, and };
  }

  function seconds(): RunOrCombine {
    filterState.push(new TFilter(TimeUnit.SECONDS, threshold));
    return { run, and };
  }

  function minutes(): RunOrCombine {
    filterState.push(new TFilter(TimeUnit.MINUTES, threshold));
    return { run, and };
  }

  function hours(): RunOrCombine {
    filterState.push(new TFilter(TimeUnit.HOURS, threshold));
    return { run, and };
  }

  return { milliseconds, seconds, minutes, hours };
}

function thatEquals(nameValue: string): RunOrCombine {
  filterState.push(new NFilter(nameValue, isEqual));
  return { run, and };
}

function thatStartsWith(nameValue: string): RunOrCombine {
  filterState.push(new NFilter(nameValue, startsWith));
  return { run, and };
}

function thatEndsWith(nameValue: string): RunOrCombine {
  filterState.push(new NFilter(nameValue, endsWith));
  return { run, and };
}

function thatIncludes(nameValue: string): RunOrCombine {
  filterState.push(new NFilter(nameValue, includes));
  return { run, and };
}

function and(): ByFilter {
  return { byTime, byName, byExtension };
}

async function run(): Run {
  let filteredFiles: string[] = [];
  const handlers = initHandlers();
  let dirContent = await getDirectoryContent(filterState);

  for (const filter of filterState) {
    filteredFiles = await handlers.handle(filter, dirContent);
    dirContent = filteredFiles;
  }

  filterState = [];
  return removeFiles(filteredFiles);
}
