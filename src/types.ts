export type Remove = {
  from: (dirPath: string) => ByFilter;
};

export type ByFilter = {
  byTime: () => ByTime;
  byName: () => ByName;
  byExtension: (fileExtension: string) => ByExtension;
};

export type ByTime = {
  olderThan: (threshold: number) => OlderThan;
};

export type OlderThan = {
  milliseconds: () => RunOrCombine;
  seconds: () => RunOrCombine;
  minutes: () => RunOrCombine;
  hours: () => RunOrCombine;
};

export type ByName = {
  thatEquals: (nameValue: string) => RunOrCombine;
  thatStartsWith: (nameValue: string) => RunOrCombine;
  thatEndsWith: (nameValue: string) => RunOrCombine;
  thatIncludes: (nameValue: string) => RunOrCombine;
};

export type ByExtension = RunOrCombine;

export type RunOrCombine = { run: () => Run; and: () => ByFilter };

export type Run = Promise<string[]>;
