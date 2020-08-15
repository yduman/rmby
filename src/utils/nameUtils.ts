import path from "path";
import { readdir, unlink } from "../asyncFs";

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
        deletedFiles = await removeByNameEqualTo(
          nameValue,
          dirContent,
          dirPath,
        );
        break;
    }

    return deletedFiles;
  } catch (error) {
    throw new Error(error);
  }
}

async function removeByNameEqualTo(
  nameValue: string,
  dirContent: string[],
  dirPath: string,
): Promise<string[]> {
  try {
    const deletedFiles: string[] = [];
    for (const fsObject of dirContent) {
      const fsObjectPath = path.join(dirPath, fsObject);
      const fileNameWithoutExt = getRawFilename(fsObject);

      if (nameValue === fileNameWithoutExt) {
        await unlink(fsObjectPath);
        deletedFiles.push(fsObjectPath);
      }
    }

    return deletedFiles;
  } catch (error) {
    throw new Error(error);
  }
}

function getRawFilename(fsObject: string): string {
  return path.parse(fsObject).name;
}
