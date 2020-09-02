/* eslint-disable @typescript-eslint/no-explicit-any */
import { readdir, unlink } from "../src/asyncFs";
import { remove } from "../src/rmby";

jest.mock("../src/asyncFs", () => ({
  readdir: jest.fn(),
  stat: jest.fn(),
  unlink: jest.fn(),
}));

const dirPath = "/path/to/dir";
const dirContent = ["file1.txt", "file2.css", "dir1", "dir2", "file3.html", "file4.js", "file5.js"];
const file1 = "/path/to/dir/file1.txt";

describe("Remove By File Extension Tests", () => {
  beforeEach(() => {
    (readdir as any).mockResolvedValue(dirContent);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should remove all files that equal to provided file extension", async () => {
    const deletedFiles = await remove().from(dirPath).byExtension(".txt").run();
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(unlink).toHaveBeenCalledTimes(1);
    expect(unlink).toHaveBeenCalledWith(file1);
    expect(deletedFiles).toEqual([file1]);
  });

  it("should return empty results and delete nothing if no matches found", async () => {
    const deleteResult = await remove().from(dirPath).byExtension(".java").run();
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(deleteResult.length).toBe(0);
    expect(unlink).not.toHaveBeenCalled();
  });
});
