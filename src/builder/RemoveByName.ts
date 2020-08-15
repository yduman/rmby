import { removeByName, NameUnit } from "../utils/nameUtils";

export class RemoveByName {
  private dirPath: string;

  constructor(dirPath: string) {
    this.dirPath = dirPath;
  }

  async equalTo(nameValue: string): Promise<string[]> {
    try {
      return await removeByName(NameUnit.EQUAL_TO, this.dirPath, nameValue);
    } catch (error) {
      throw new Error(error);
    }
  }

  async thatStartsWith(nameValue: string): Promise<string[]> {
    try {
      return await removeByName(NameUnit.STARTS_WITH, this.dirPath, nameValue);
    } catch (error) {
      throw new Error(error);
    }
  }

  async thatEndsWith(nameValue: string): Promise<string[]> {
    try {
      return await removeByName(NameUnit.ENDS_WITH, this.dirPath, nameValue);
    } catch (error) {
      throw new Error(error);
    }
  }

  async thatIncludes(nameValue: string): Promise<string[]> {
    try {
      return await removeByName(NameUnit.INCLUDES, this.dirPath, nameValue);
    } catch (error) {
      throw new Error(error);
    }
  }
}
