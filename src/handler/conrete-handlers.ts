import { readdir } from "../asyncFs";
import { AbstractHandler } from "./handler";
import {
  FilterState,
  isDirFilter,
  isTimeFilter,
  isNameFilter,
  isExtensionFilter,
} from "../filters/filter-interface";

export class DirectoryFilterHandler extends AbstractHandler {
  public async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
    if (isDirFilter(request) && dirContent.length == 0) {
      return await readdir(request.dirPath);
    }
    return await super.handle(request, dirContent);
  }
}

// TODO: implement
export class TimeFilterHandler extends AbstractHandler {
  public async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
    if (isTimeFilter(request)) {
      console.log(request.timeUnit);
      console.log(request.threshold);
    }
    return await super.handle(request, dirContent);
  }
}

// TODO: implement
export class NameFilterHandler extends AbstractHandler {
  public async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
    if (isNameFilter(request)) {
      console.log(request.nameUnit);
      console.log(request.nameValue);
      console.log(request.nameFilterer);
    }
    return await super.handle(request, dirContent);
  }
}

// TODO: implement
export class ExtensionFilterHandler extends AbstractHandler {
  public async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
    if (isExtensionFilter(request)) {
      console.log(request.fileExtension);
    }
    return await super.handle(request, dirContent);
  }
}
