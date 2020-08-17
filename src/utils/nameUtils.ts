import path from "path";
import { readdir, unlink } from "../asyncFs";

interface RemoveArgs {
  nameValue: string;
  dirPath: string;
  dirContent: string[];
  predicate: (args: PredicateArgs) => boolean;
}

interface PredicateArgs {
  nameValue: string;
  fileName: string;
}

export enum NameUnit {
  EQUAL_TO,
  STARTS_WITH,
  ENDS_WITH,
  INCLUDES,
  MATCHES,
}

export async function removeByName(
  nameUnit: NameUnit,
  dirPath: string,
  nameValue: string,
): Promise<string[]> {
  try {
    let deletedFiles: string[] = [];
    const dirContent = await readdir(dirPath);

    switch (nameUnit) {
      case NameUnit.EQUAL_TO:
        deletedFiles = await remove({
          nameValue,
          dirPath,
          dirContent,
          predicate: isEqual,
        });
        break;
      case NameUnit.STARTS_WITH:
        deletedFiles = await remove({
          nameValue,
          dirPath,
          dirContent,
          predicate: startsWith,
        });
        break;
      case NameUnit.ENDS_WITH:
        deletedFiles = await remove({
          nameValue,
          dirPath,
          dirContent,
          predicate: endsWith,
        });
        break;
      case NameUnit.INCLUDES:
        deletedFiles = await remove({
          nameValue,
          dirPath,
          dirContent,
          predicate: includes,
        });
        break;
    }

    return deletedFiles;
  } catch (error) {
    throw new Error(error);
  }
}

async function remove(removeArgs: RemoveArgs): Promise<string[]> {
  try {
    const { nameValue, dirPath, dirContent, predicate } = removeArgs;
    const deletedFiles: string[] = [];

    for (const fsObject of dirContent) {
      const fsObjectPath = path.join(dirPath, fsObject);
      const fileName = getRawFilename(fsObject);

      if (predicate({ nameValue, fileName })) {
        await unlink(fsObjectPath);
        deletedFiles.push(fsObjectPath);
      }
    }

    return deletedFiles;
  } catch (error) {
    throw new Error(error);
  }
}

export function isEqual(args: PredicateArgs): boolean {
  return getRawFilename(args.fileName) === args.nameValue;
}

export function startsWith(args: PredicateArgs): boolean {
  return getRawFilename(args.fileName).startsWith(args.nameValue);
}

export function endsWith(args: PredicateArgs): boolean {
  return getRawFilename(args.fileName).endsWith(args.nameValue);
}

export function includes(args: PredicateArgs): boolean {
  return getRawFilename(args.fileName).includes(args.nameValue);
}

function getRawFilename(fsObject: string): string {
  return path.parse(fsObject).name;
}
