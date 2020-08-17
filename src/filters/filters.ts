import {
  DirectoryFilter,
  TimeFilter,
  NameFilter,
  ExtensionFilter,
  NameFilterFunc,
} from "./filter-interface";
import { TimeUnit } from "../utils/timeUtils";
import { NameUnit } from "../utils/nameUtils";

export class DirFilter implements DirectoryFilter {
  dirPath: string;

  constructor(dirPath: string) {
    this.dirPath = dirPath;
  }
}

export class TFilter implements TimeFilter {
  timeUnit: TimeUnit;
  threshold: number;

  constructor(timeUnit: TimeUnit, threshold: number) {
    this.timeUnit = timeUnit;
    this.threshold = threshold;
  }
}

export class NFilter implements NameFilter {
  nameUnit: NameUnit;
  nameValue: string;
  nameFilterer: NameFilterFunc;

  constructor(nameUnit: NameUnit, nameValue: string, nameFilterer: NameFilterFunc) {
    this.nameUnit = nameUnit;
    this.nameValue = nameValue;
    this.nameFilterer = nameFilterer;
  }
}

export class ExtFilter implements ExtensionFilter {
  fileExtension: string;

  constructor(fileExtension: string) {
    this.fileExtension = fileExtension;
  }
}
