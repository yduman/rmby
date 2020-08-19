import { join, parse } from "path";
import { NameFiltererArgs, FilterState, isDirFilter } from "../filters/filter-interface";
import { unlink, readdir } from "../asyncFs";
import { AbstractHandler } from "../handler/handler";
import {
  TimeFilterHandler,
  NameFilterHandler,
  ExtensionFilterHandler,
} from "../handler/conrete-handlers";

const MS_IN_SECS = 60000;
const MS_IN_HOUR = 3600000;

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
  await Promise.all(filteredFiles.map((fileName) => unlink(fileName)))  const removedFiles: string[] = [];

  for (const file of filteredFiles) {
    await unlink(file);
    removedFiles.push(file);
  }

  return removedFiles;
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
    }
  }

  return dirPath;
}

export function getTimeDiff(timeUnit: TimeUnit, lastModifiedTime: Date): number {
  let diff;

  switch (timeUnit) {
    case TimeUnit.MILLIS:
      diff = getDiffMillis(new Date(), lastModifiedTime);
      break;
    case TimeUnit.SECONDS:
      diff = getDiffSeconds(new Date(), lastModifiedTime);
      break;
    case TimeUnit.MINUTES:
      diff = getDiffMinutes(new Date(), lastModifiedTime);
      break;
    case TimeUnit.HOURS:
      diff = getDiffHours(new Date(), lastModifiedTime);
      break;
  }

  return diff;
}

export function filter(dirContent: string[], matchedFiles: string[]): string[] {
  return dirContent.filter((x) => matchedFiles.includes(x));
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

function getDiffMillis(laterDate: Date, earlierDate: Date): number {
  return laterDate.getTime() - earlierDate.getTime();
}

function getDiffSeconds(laterDate: Date, earlierDate: Date): number {
  const diff = getDiffMillis(laterDate, earlierDate) / 1000;
  return Math.floor(diff);
}

function getDiffMinutes(laterDate: Date, earlierDate: Date): number {
  const diff = getDiffMillis(laterDate, earlierDate) / MS_IN_SECS;
  return Math.floor(diff);
}

function getDiffHours(laterDate: Date, earlierDate: Date): number {
  const diff = getDiffMillis(laterDate, earlierDate) / MS_IN_HOUR;
  return Math.floor(diff);

function getRawFilename(fsObject: string): string {
  return parse(fsObject).name;
}
