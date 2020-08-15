import { removeByExtension } from "../utils/extensionUtils";

export class RemoveByExtension {
  private dirPath: string;

  constructor(dirPath: string) {
    this.dirPath = dirPath;
  }

  async thatEquals(fileExtension: string): Promise<string[]> {
    try {
      return await removeByExtension(this.dirPath, fileExtension);
    } catch (error) {
      throw new Error(error);
    }
  }
}
