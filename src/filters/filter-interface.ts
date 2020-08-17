import { TimeUnit } from "../utils/timeUtils";
import { NameUnit } from "../utils/nameUtils";

export type FilterState = DirectoryFilter | TimeFilter | NameFilter | ExtensionFilter;

export type NameFilterFunc = (args: NameFiltererArgs) => boolean;

export interface DirectoryFilter {
  dirPath: string;
}

export interface TimeFilter {
  timeUnit: TimeUnit;
  threshold: number;
}

export interface NameFilter {
  nameUnit: NameUnit;
  nameValue: string;
  nameFilterer: NameFilterFunc;
}

export interface ExtensionFilter {
  fileExtension: string;
}

export interface NameFiltererArgs {
  fileName: string;
  nameValue: string;
}

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
export function isDirFilter(filterState: FilterState): filterState is DirectoryFilter {
  return (filterState as DirectoryFilter) !== undefined;
}

export function isTimeFilter(filterState: FilterState): filterState is TimeFilter {
  return (filterState as TimeFilter) !== undefined;
}

export function isNameFilter(filterState: FilterState): filterState is NameFilter {
  return (filterState as NameFilter) !== undefined;
}

export function isExtensionFilter(filterState: FilterState): filterState is ExtensionFilter {
  return (filterState as ExtensionFilter) !== undefined;
}
