import path from "path";
import { stat } from "../asyncFs";
import { getTimeDiff, intersect } from "../utils";
import { AbstractHandler } from "./handler";
import {
  FilterState,
  isTimeFilter,
  isNameFilter,
  isExtensionFilter,
} from "../filters/filter-interface";

export class TimeFilterHandler extends AbstractHandler {
  async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
    if (isTimeFilter(request)) {
      const { timeUnit, threshold } = request;
      const matchedFiles: string[] = [];

      const stats = await Promise.all(dirContent.map((fsObjectPath) => stat(fsObjectPath)));
      for (let i = 0; i < dirContent.length; i++) {
        const fsObjectPath = dirContent[i];
        const stat = stats[i];
        if (stat.isFile()) {
          const diff = getTimeDiff(timeUnit, stat.mtime);
          if (diff >= threshold) {
            matchedFiles.push(fsObjectPath);
          }
        }
      }

      return intersect(dirContent, matchedFiles);
    }
    return super.handle(request, dirContent);
  }
}

export class NameFilterHandler extends AbstractHandler {
  async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
    if (isNameFilter(request)) {
      const { nameValue, nameFilterer } = request;
      const matchedFiles: string[] = [];

      for (const fsObjectPath of dirContent) {
        if (nameFilterer({ nameValue, fileName: fsObjectPath })) {
          matchedFiles.push(fsObjectPath);
        }
      }

      return intersect(dirContent, matchedFiles);
    }
    return super.handle(request, dirContent);
  }
}

export class ExtensionFilterHandler extends AbstractHandler {
  async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
    if (isExtensionFilter(request)) {
      const { fileExtension } = request;
      const matchedFiles: string[] = [];

      for (const fsObjectPath of dirContent) {
        const ext = path.parse(fsObjectPath).ext;
        if (ext === fileExtension) {
          matchedFiles.push(fsObjectPath);
        }
      }

      return intersect(dirContent, matchedFiles);
    }
    return super.handle(request, dirContent);
  }
}
