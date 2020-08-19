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

async function timeFilter(request: FilterState, dirContent: string[]): Promise<void | string[]> {
  const { timeUnit, threshold } = request;
  const matchedFiles: string[] = [];

  // TODO: Add concurrency = 100
  const stats = await Promise.all(dirContent.map((dir) => stat(dir)));
  for (let i = 0; i < dirContent.length; i++) {
    const stat = stats[i];
    const fsObjectPath = dirContent[i];
    if (stat.isFile()) {
      const diff = getTimeDiff(timeUnit, stat.mtime);
      if (diff >= threshold) {
        matchedFiles.push(fsObjectPath);
      }
    }
  }
  return matchedFiles;
}

async function handle(
  request: FilterState,
  dirContent: string[],
  actualFilter: Function,
): Promise<string[]> {
  const matchedFiles: void | string[] = await actualFilter(request, dirContent);
  if (matchedFiles) {
    return filter(dirContent, matchedFiles);
  }
  return handle;
}

handle.foobar = () => {};

export class TimeFilterHandler extends AbstractHandler {
  public async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
    if (isTimeFilter(request)) {
      const { timeUnit, threshold } = request;
      const matchedFiles: string[] = [];

      const stats = await Promise.all(dirContent.map((dir) => stat(dir)));
      for (const stat of stats) {
        if (stat.isFile()) {
          const diff = getTimeDiff(timeUnit, stat.mtime);
          if (diff >= threshold) {
            matchedFiles.push(fsObjectPath);
          }
        }
      }

      return filter(dirContent, matchedFiles);
    }
    return super.handle(request, dirContent);
  }
}

export class NameFilterHandler extends AbstractHandler {
  public async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
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
  public async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
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
