export interface IRemove {
  fromDirectory(dirPath: string): IRemoveBy;
}

export interface IRemoveBy {
  byTime(): IRemoveByTimeUnit;
  byName(): IRemoveByName;
  byExtension(fileExtension: string): IRemoveRunOrConcat;
}

export interface IRemoveByTimeUnit {
  inMilliseconds(): IRemoveByTime;
  inSeconds(): IRemoveByTime;
  inMinutes(): IRemoveByTime;
  inHours(): IRemoveByTime;
}

export interface IRemoveByName {
  thatEqualsTo(nameValue: string): IRemoveRunOrConcat;
  thatStartsWith(nameValue: string): IRemoveRunOrConcat;
  thatEndsWith(nameValue: string): IRemoveRunOrConcat;
  thatIncludes(nameValue: string): IRemoveRunOrConcat;
}

export interface IRemoveByTime {
  olderThan(threshold: number): IRemoveRunOrConcat;
}

export interface IRemoveRunOrConcat {
  and(): IRemoveBy;
  run(): Promise<string[]>;
}
