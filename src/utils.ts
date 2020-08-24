import { join, parse } from "path";
import { NameFiltererArgs, FilterState, isDirFilter } from "./filters/filter-interface";
import { unlink, readdir } from "./asyncFs";
import { AbstractHandler } from "./handler/handler";
import {
  TimeFilterHandler,
  NameFilterHandler,
  ExtensionFilterHandler,
} from "./handler/conrete-handlers";

const MS = 1;
const SEC_IN_MS = MS * 1000;
const MIN_IN_MS = SEC_IN_MS * 60;
const HOUR_IN_MS = MIN_IN_MS * 60;

export enum TimeUnit {
  MILLIS,
  SECONDS,
  MINUTES,
  HOURS,
}

export function initHandlers(): AbstractHandler {
  const byTimeHandler = new TimeFilterHandler();
  const byNameHandler = new NameFilterHandler();
  const byExtensionHandler = new ExtensionFilterHandler();

  byTimeHandler.setNext(byNameHandler).setNext(byExtensionHandler);

  return byTimeHandler;
}

export async function removeFiles(filteredFiles: string[]): Promise<string[]> {
  if (filteredFiles.length === 0) {
    throw new Error("Your filter criteria resulted in 0 matches.");
  } else {
    await Promise.all(filteredFiles.map((file) => unlink(file)));
    return filteredFiles;
  }
}

export async function getDirectoryContent(filterState: FilterState[]): Promise<string[]> {
  const dirContentWithFullPaths: string[] = [];
  const dirPath = getDirPath(filterState);
  const dirContent = await readdir(dirPath);

  for (const fsObject of dirContent) {
    const fsObjectPath = join(dirPath, fsObject);
    dirContentWithFullPaths.push(fsObjectPath);
  }

  return dirContentWithFullPaths;
}

export function getDirPath(filterState: FilterState[]): string {
  let dirPath = "";

  for (const filter of filterState) {
    if (isDirFilter(filter)) {
      dirPath = filter.dirPath;
      break;
    }
  }

  return dirPath;
}

export function getTimeDiff(timeUnit: TimeUnit, lastModifiedDate: Date): number {
  const timeDiffUnitInMs = {
    [TimeUnit.MILLIS]: MS,
    [TimeUnit.SECONDS]: SEC_IN_MS,
    [TimeUnit.MINUTES]: MIN_IN_MS,
    [TimeUnit.HOURS]: HOUR_IN_MS,
  }[timeUnit];

  return calcTimeDiff(lastModifiedDate, timeDiffUnitInMs);
}

function calcTimeDiff(lastModifiedDate: Date, timeUnitInMs: number): number {
  return Math.floor((new Date().getTime() - lastModifiedDate.getTime()) / timeUnitInMs);
}

export function isEqual(args: NameFiltererArgs): boolean {
  return getRawFilename(args.fileName) === args.nameValue;
}

export function startsWith(args: NameFiltererArgs): boolean {
  return getRawFilename(args.fileName).startsWith(args.nameValue);
}

export function endsWith(args: NameFiltererArgs): boolean {
  return getRawFilename(args.fileName).endsWith(args.nameValue);
}

export function includes(args: NameFiltererArgs): boolean {
  return getRawFilename(args.fileName).includes(args.nameValue);
}

function getRawFilename(fsObject: string): string {
  return parse(fsObject).name;
}

export function intersect(dirContent: string[], matchedFiles: string[]): string[] {
  return dirContent.filter((x) => matchedFiles.includes(x));
}
