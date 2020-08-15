import path from "path";
import { readdir, unlink } from "../asyncFs";

export async function removeByExtension(dirPath: string, fileExtension: string): Promise<string[]> {
  try {
    const deletedFiles: string[] = [];
    const dirContent = await readdir(dirPath);

    for (const fsObject of dirContent) {
      const fsObjectPath = path.join(dirPath, fsObject);
      const currFileExt = path.extname(fsObject);

      if (currFileExt === fileExtension) {
        await unlink(fsObjectPath);
        deletedFiles.push(fsObjectPath);
      }
    }

    return deletedFiles;
  } catch (error) {
    throw new Error(error);
  }
}
