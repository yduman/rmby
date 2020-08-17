import path from "path";
import { stat } from "../asyncFs";
import { getTimeDiff, filter } from "../utils";
import { AbstractHandler } from "./handler";
import {
  FilterState,
  isTimeFilter,
  isNameFilter,
  isExtensionFilter,
} from "../filters/filter-interface";

export class TimeFilterHandler extends AbstractHandler {
  public async handle(
    request: FilterState,
    dirContent: string[],
  ): Promise<string[]> {
    if (isTimeFilter(request)) {
      const { timeUnit, threshold } = request;
      const matchedFiles: string[] = [];

      for (const fsObjectPath of dirContent) {
        const stats = await stat(fsObjectPath);
        if (stats.isFile()) {
          const diff = getTimeDiff(timeUnit, stats.mtime);
          if (diff >= threshold) {
            matchedFiles.push(fsObjectPath);
          }
        }
      }

      return filter(dirContent, matchedFiles);
    }
    return await super.handle(request, dirContent);
  }
}

export class NameFilterHandler extends AbstractHandler {
  public async handle(
    request: FilterState,
    dirContent: string[],
  ): Promise<string[]> {
    if (isNameFilter(request)) {
      const { nameValue, nameFilterer } = request;
      const matchedFiles: string[] = [];

      for (const fsObjectPath of dirContent) {
        if (nameFilterer({ nameValue, fileName: fsObjectPath })) {
          matchedFiles.push(fsObjectPath);
        }
      }

      return filter(dirContent, matchedFiles);
    }
    return await super.handle(request, dirContent);
  }
}

export class ExtensionFilterHandler extends AbstractHandler {
  public async handle(
    request: FilterState,
    dirContent: string[],
  ): Promise<string[]> {
    if (isExtensionFilter(request)) {
      const { fileExtension } = request;
      const matchedFiles: string[] = [];

      for (const fsObjectPath of dirContent) {
        const ext = path.parse(fsObjectPath).ext;
        if (ext === fileExtension) {
          matchedFiles.push(fsObjectPath);
        }
      }

      return filter(dirContent, matchedFiles);
    }
    return await super.handle(request, dirContent);
  }
}
